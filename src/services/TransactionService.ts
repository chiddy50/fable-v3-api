import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { Response, Request } from "express";
import { Character, CustomRequest, IJwtPayload, Image, Page, Scene, Story, User } from "../shared/Interface";
import { slugify } from "../shared/helpers";
import { PublicKey } from "@code-wallet/keys";
import * as code from "@code-wallet/client";
import { useConfig } from "../shared/config";
import { CreateTransactionInterface } from "../interfaces/TransactionInterface";
import { v4 as uuidv4 } from 'uuid';
const _ = require('lodash');

export interface ITransactionService {
    createIntent(req: Request, res: Response): Promise<void>; 
    verifyIntent(req: Request, res: Response): Promise<void>;  
    webhook(req: Request, res: Response): Promise<void>;         
}

export class TransactionService implements ITransactionService {

    constructor(        
        private transactionRepo: IBase,
        private storyAccessRepo: IBase,  
        private paymentRepo: IBase,        
        private articleTransactionRepo: IBase,        
        private userRepo: IBase,                
        private storyRepo: IBase,
        private characterRepo: IBase,
        private storyStructureRepo: IBase,        
        private errorService: IErrorService
    ) {}

    public createIntent = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {

        const { id } = req.params;
        const { narration, type, depositAddress } = req.body;

        const user: IJwtPayload = req.user as IJwtPayload; 
        
        if (!user?.id) throw new Error("User Not Found");        
        if ((type === "read-story" || type === "read-article") && !depositAddress) throw new Error("No deposit address found");        

        const storyId = id;
        const amount = type === "read-story" ? 0.05 : 0.25;
        console.log({amount});
        
        const currency = 'usd';

        const deposit_address = (type === "create-story" || type === "create-article") ? process.env.CODE_WALLET_DEPOSIT_ADDRESS : depositAddress;

        try {
            const { clientSecret, id } = await code.paymentIntents.create({
                amount,
                currency,
                destination: deposit_address,
                mode: "payment",
                // idempotencyKey: `${storyId}`,
                // webhook: { url: "https://tions-put-teaching-qty.trycloudflare.com/transactions/webhook" },
            });
            
            // The id value can also be used to query the status of the payment intent manually
            console.log('Created intent', id);

            // Save transaction record
            let transaction = await this.createTransaction(storyId, {
                type,
                amount: amount.toString(),
                currency,
                narration,
                deposit_address,
                clientSecret: clientSecret.toString(),
                userId: user?.id,
                id: id.toString(),
            });

            // const { success, message } = await code.webhook.register({
            //     intent: id,
            //     // url: process.env.WEBHOOK_URL ?? "",
            //     url: "https://quick-knowing-downtown-flow.trycloudflare.com"
            // });
        
            // console.log('Registered webhook', success, message);

            res.status(200).json({ 
                clientSecret, id,
                error: false, 
                message: "success" 
            });
        } catch (error) {
            console.error(error);
            this.errorService.handleErrorResponse(error)(res);                 
        }
    }

    public verifyIntent = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const { storyId } = req.body;

            // VALIDATE STORY FIRST

            const transaction = await this.handleIntentValidation(id, storyId);

            if (!transaction) throw new Error("Transaction Not Found");

            // const { status } = await code.paymentIntents.getStatus({ intent: id });

            res.status(200).json({ 
                data: { 
                    transaction
                }, 
                error: false, 
                message: "success" 
            });
        } catch (error) {
            console.error(error);
            this.errorService.handleErrorResponse(error)(res);   
        }
    }

    public confirmTransaction = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const { storyId, clientSecret, destination, locale, mode, type } = req.body;
            const user: IJwtPayload = req.user as IJwtPayload;    

            const authUser = await this.userRepo.getUnique({ where: { id: user?.id } }) as User | null;

            console.log({ 
                unique_id: id, 
                storyId, 
                key: clientSecret,
                deposit_address: destination
            });
            
            const transaction: any = await this.transactionRepo.get({
                where: { 
                    // unique_id: id, 
                    storyId, 
                    key: clientSecret,
                    deposit_address: destination
                },
            });
            console.log({transaction});
            
            if (!transaction) {
                throw new Error("Could not update transaction")
            }

            if (transaction.status !== "completed") {

                const updatedTransaction: any = await this.transactionRepo.update({
                    where: { 
                        id: transaction.id,
                        // unique_id: id, 
                        deposit_address: destination,
                        storyId 
                    },
                    data: {
                        status: "completed",
                        locale, 
                        mode,
                        confirmedAt: new Date(),
                    }
                });
    
                if (updatedTransaction?.type === "create-story") {                
                    const updateStory: any = await this.storyRepo.update({
                        where: { 
                            id: storyId,
                            userId: user?.id,   
                        },
                        data: {
                            paidAt: new Date(),
                            isPaid: true
                        }
                    });
                }
    
                if (type === "read-story") {                
                    const storyAccess = await this.storyAccessRepo.update({ 
                        where: { 
                            userId_storyId: {
                                storyId: storyId,
                                userId: user?.id,  
                            },
                            // id: storyId,
                            // userId: user?.id,   
                        },
                        data: {
                            hasAccess: true
                        }
                    });
                }

                await this.createPayment(updatedTransaction);

                res.status(200).json({ 
                    data: { 
                        transaction: updatedTransaction,
                        // story: updateStory
                    }, 
                    error: false, 
                    message: "success" 
                });
    
            }else{

                res.status(200).json({ 
                    error: false, 
                    message: "Transaction completed already" 
                });
            }



        } catch (error) {
            console.error(error);
            this.errorService.handleErrorResponse(error)(res);   
        }
    }

    public deleteTransaction = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const { id } = req.params;

        try {
            const transaction: any = await this.transactionRepo.get({
                where: { unique_id: id },
            });

            const deleted = await this.transactionRepo.delete({ where: { unique_id: id } });

            if(!deleted){
                throw new Error("Could not remove transaction")
            }

            res.status(200).json({ 
                data: { 
                    story: deleted
                }, 
                error: false, 
                message: "success" 
            });

        } catch (error) {
            console.error(error);   
            this.errorService.handleErrorResponse(error)(res);   
        }
    }

    public webhook = async (
        req: Request,
        res: Response
    ): Promise<void> => {

        const config = useConfig();
        const token: string = req.body;

        console.log('Received webhook event:');
        console.log({body: req.body});
        

        try {
            const publicKey = config.codeSequencerPublicKey;
            res.status(200).json({ 
                data: { 
                   body: req.body,
                   publicKey: publicKey
                }, 
                error: false, 
                message: "success" 
            });
        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                 
        }
    }

    public getUserTransactions = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        try {
            const user: IJwtPayload = req.user as IJwtPayload;         
            if (!user?.id) throw new Error("User Not Found"); 

            const { page = 1, limit } = req.query;
            const parsedPage: number = parseInt(page as string, 10); 
            const parsedLimit: number = parseInt(limit as string, 10); 
            let filter: object = { userId: user?.id };
            const totalCount: number = await this.transactionRepo.count(filter); // Assuming you have a method to count total challenges
            const offset = (parsedPage - 1) * parsedLimit;
            
            const transactions = await this.transactionRepo.getAll({ 
                where: {
                    userId: user?.id
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: Number(offset),
                take: Number(limit),
            });

            const createdStoryCompletedTransactions = await this.transactionRepo.getAll({ 
                where: {
                    userId: user?.id,
                    status: "completed",
                    type: "create-story"
                },
                select: {
                    amount: true,
                },
            });

            const readStoryCompletedTransactions = await this.transactionRepo.getAll({ 
                where: {
                    userId: user?.id,
                    status: "completed",
                    type: "read-story"
                },
                select: {
                    amount: true,
                },
            });

            const createdStoryTotalAmount = createdStoryCompletedTransactions.reduce((sum, transaction: any) => {
                const amountAsNumber = parseFloat(transaction?.amount);
                return sum + (isNaN(amountAsNumber) ? 0 : amountAsNumber);
            }, 0);

            const readStoryTotalAmount = readStoryCompletedTransactions.reduce((sum, transaction: any) => {
                const amountAsNumber = parseFloat(transaction?.amount);
                return sum + (isNaN(amountAsNumber) ? 0 : amountAsNumber);
            }, 0);

            const creatorStoriesThatHaveBeenRead: any = await this.transactionRepo.aggregate({
                _sum: {
                    formatAmount: true, // Sum the 'amount' field
                },
                where: {
                  type: "read-story", // Only transactions where users read your story
                  story: {
                    userId: user?.id, // Only consider transactions for stories that belong to you
                  },
                },
            });
            const amountEarned = creatorStoriesThatHaveBeenRead?._sum?.formatAmount || 0;


            const totalPages: number = Math.ceil(totalCount / parsedLimit);
            const hasNextPage: boolean = parsedPage < totalPages;
            const hasPrevPage: boolean = parsedPage > 1;

            res.status(200).json({ 
                totalPages, hasNextPage, hasPrevPage,
                amountEarned: Number(amountEarned?.toFixed(2)),
                transactions,
                createdStoryTotalAmount: createdStoryTotalAmount,
                readStoryTotalAmount: readStoryTotalAmount,
                createdStoryCompletedTransactionsCount: createdStoryCompletedTransactions.length,
                readStoryCompletedTransactionsCount: readStoryCompletedTransactions.length,
                error: false, 
                message: "success" 
            });
        } catch (error) {
            console.error(error);
            this.errorService.handleErrorResponse(error)(res); 
        }
    }

    
    public getAllUserTransactions = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        try {
            const user: IJwtPayload = req.user as IJwtPayload;         
            if (!user?.id) throw new Error("User Not Found"); 

            const { page = 1, limit } = req.query;
            const parsedPage: number = parseInt(page as string, 10); 
            const parsedLimit: number = parseInt(limit as string, 10); 
            let filter: object = { userId: user?.id };
            const totalCount: number = await this.transactionRepo.count(filter); // Assuming you have a method to count total challenges
            const offset = (parsedPage - 1) * parsedLimit;
            
            const transactions = await this.paymentRepo.getAll({ 
                where: {
                    userId: user?.id
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: Number(offset),
                take: Number(limit),
            });

            // STORY AGGREGATE
            const createdStoryCompletedTransactions = await this.getTransaction("create-story", user?.id);  
            const readStoryCompletedTransactions = await this.getTransaction("read-story", user?.id);  
            const tipsCompletedTransactions = await this.getTransaction("tip", user?.id);  
            const creditCompletedTransactions = await this.getTransaction("credit-purchase", user?.id);  
            
            const createdStoryCompletedTransactionsCount = await this.getTransactionCount("create-story", user?.id);  
            const readStoryCompletedTransactionsCount = await this.getTransactionCount("read-story", user?.id); 

            const createdStoryTotalAmount = this.calculateTransactionTotal(createdStoryCompletedTransactions); 
            const readStoryTotalAmount = this.calculateTransactionTotal(readStoryCompletedTransactions); 
            const tipsTotalAmount = this.calculateTransactionTotal(tipsCompletedTransactions); 
            const creditPurchaseTotalAmount = this.calculateTransactionTotal(creditCompletedTransactions); 
            
            // ARTICLE AGGREGATE
            const createdArticlesCompletedTransactions = await this.getTransaction("create-article", user?.id);  
            const readArticlesCompletedTransactions = await this.getTransaction("read-article", user?.id);

            const createdArticlesCompletedTransactionsCount = await this.getTransactionCount("create-article", user?.id);  
            const readArticlesCompletedTransactionsCount = await this.getTransactionCount("read-article", user?.id);
              

            const createdArticlesTotalAmount = this.calculateTransactionTotal(createdArticlesCompletedTransactions); 
            const readArticlesTotalAmount = this.calculateTransactionTotal(readArticlesCompletedTransactions); 
      
            const creatorStoriesThatHaveBeenRead: any = await this.transactionRepo.aggregate({
                _sum: {
                    formatAmount: true, // Sum the 'amount' field
                },
                where: {
                    type: "read-story", // Only transactions where users read your story
                    story: {
                        userId: user?.id, // Only consider transactions for stories that belong to you
                    },
                },
            });
            const amountEarnedFromStories = creatorStoriesThatHaveBeenRead?._sum?.formatAmount || 0;

            const creatorArticlesThatHaveBeenRead: any = await this.articleTransactionRepo.aggregate({
                _sum: {
                    formatAmount: true, // Sum the 'amount' field
                },
                where: {
                    type: "read-article", // Only transactions where users read your story
                    article: {
                        userId: user?.id, // Only consider transactions for stories that belong to you
                    },
                },
            });

            const amountEarnedFromArticles = creatorArticlesThatHaveBeenRead?._sum?.formatAmount || 0;


            const totalPages: number = Math.ceil(totalCount / parsedLimit);
            const hasNextPage: boolean = parsedPage < totalPages;
            const hasPrevPage: boolean = parsedPage > 1;

            res.status(200).json({ 
                totalPages, hasNextPage, hasPrevPage, 

                transactions,
                // createdStoryCompletedTransactions,
                // readStoryCompletedTransactions,
                createdStoryTotalAmount,
                readStoryTotalAmount,
                tipsTotalAmount,
                creditPurchaseTotalAmount,
                createdStoryCompletedTransactionsCount,
                readStoryCompletedTransactionsCount,
                // createdArticlesCompletedTransactions,
                // readArticlesCompletedTransactions,
                createdArticlesTotalAmount,
                readArticlesTotalAmount,
                createdArticlesCompletedTransactionsCount,
                readArticlesCompletedTransactionsCount,
                amountEarnedFromStories,

                amountEarnedFromArticles,
                error: false, 
                message: "success" 
            });
        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);             
        }
    }

    createTransaction = async(storyId: string, payload: CreateTransactionInterface) => {
        const transaction = await this.transactionRepo.create({ 
            data: {
                storyId,       
                status: "initiated",          
                userId: payload.userId,
                type: payload.type,          
                narration: payload.narration,
                amount: payload.amount,    
                formatAmount: Number(payload.amount),
                currency: payload.currency,
                deposit_address: payload.deposit_address,      
                key: payload.clientSecret,
                unique_id: payload.id,
                reference: uuidv4()
            }
        });
    }
    

    async handleIntentValidation(intent: string, storyId: string) {
        if (!intent) return null;
    
        const transaction: any = await this.transactionRepo.get({
            where: { unique_id: intent, storyId },
        });

        if (!transaction) return null;
    
        if (transaction.status !== 'completed') {
            const { status } = await code.paymentIntents.getStatus({ intent });
            console.log({status});
            
            if (status === 'confirmed') {
            // UPDATE TRANSACTION AFTER CONFIRMATION
                const updatedTransaction: any = await this.transactionRepo.update({
                    where: { unique_id: intent },
                    data: {
                        status: "completed"
                    }
                });
                return updatedTransaction;
            } else {
                return null;
            }
        }
    
        return transaction;
    }

    createPayment = async (transaction: any) => {
        const payment = await this.paymentRepo.create({
            data: {
                status: "completed",          
                userId: transaction?.userId,
                type: transaction?.type,          
                narration: transaction?.narration,
                amount: transaction?.amount,    
                formatAmount: parseFloat(transaction?.amount),
                currency: transaction?.currency,
                deposit_address: transaction?.deposit_address,      
                key: transaction?.clientSecret,
                unique_id: transaction?.id,
                locale: transaction?.locale,
                mode: transaction?.mode,
                confirmedAt: transaction?.confirmedAt,            
                reference: transaction?.reference
            }
        });

        console.log({payment});        
    }

    getTransaction = async (type: string, userId: string) => {
        const response = await this.paymentRepo.getAll({ 
            where: {
                userId: userId,
                status: "completed",
                type: type
            },
            select: {
                amount: true,
            },
        });
        return response;
    }

    getTransactionCount = async (type: string, userId: string) => {
        const count = await this.paymentRepo.count({ 
            userId: userId,
            status: "completed",
            type: type
        });
        return count;
    }

    calculateTransactionTotal = (transactions: object[]) => {
        let data = transactions.reduce((sum, transaction: any) => {
            const amountAsNumber = parseFloat(transaction?.amount);
            
            return sum + (isNaN(amountAsNumber) ? 0 : amountAsNumber);
        }, 0);
        console.log({data});

        return data;
    }
    
}   
