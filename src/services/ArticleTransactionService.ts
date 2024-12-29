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

export interface IArticleTransactionService {
    createIntent(req: Request, res: Response): Promise<void>; 
}

export class ArticleTransactionService implements IArticleTransactionService {
    constructor(    
        private articleTransactionRepo: IBase,
        private articleRepo: IBase,
        private paymentRepo: IBase,        
        private articleAccessRepo: IBase,    
        private userRepo: IBase,                
        private errorService: IErrorService,
    ) {}

    public createIntent = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {

        const { id } = req.params;
        const { narration, type, depositAddress, customPrice } = req.body;

        const user: IJwtPayload = req.user as IJwtPayload; 
        
        if (!user?.id) throw new Error("User Not Found");        
        if (type === "read-article" && !depositAddress) throw new Error("No deposit address found");        

        const storyId = id;
        const amount = type === "read-article" ? customPrice : 0.5;
        
        const currency = 'usd';

        const deposit_address = type === "create-article" ? process.env.CODE_WALLET_DEPOSIT_ADDRESS : depositAddress;

        try {
            const { clientSecret, id } = await code.paymentIntents.create({
                amount,
                currency,
                destination: deposit_address,
                mode: "payment",
            });            

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
            const { articleId } = req.body;

            // VALIDATE STORY FIRST

            const transaction = await this.handleIntentValidation(id, articleId);

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
            const { articleId, clientSecret, destination, locale, mode, type } = req.body;
            const user: IJwtPayload = req.user as IJwtPayload;    

            const authUser = await this.userRepo.getUnique({ where: { id: user?.id } }) as User | null;

            const transaction: any = await this.articleTransactionRepo.get({
                where: { 
                    // unique_id: id, 
                    articleId, 
                    key: clientSecret,
                    deposit_address: destination
                },
            });
            
            if (!transaction) throw new Error("Unidentified transaction");

            if (transaction.status !== "completed") {
                
                const updatedTransaction: any = await this.articleTransactionRepo.update({
                    where: { 
                        id: transaction.id,
                        // unique_id: id, 
                        deposit_address: destination,
                        articleId 
                    },
                    data: {
                        status: "completed",
                        locale, 
                        mode,
                        confirmedAt: new Date(),
                    }
                });                
    
                if (updatedTransaction?.type === "create-article") {                
                    const updateArticle: any = await this.articleRepo.update({
                        where: { 
                            id: articleId,
                            userId: user?.id,   
                        },
                        data: {
                            paidAt: new Date(),
                            isPaid: true
                        }
                    });
                }
    
                if (type === "read-article") {                
                    const articleAccess = await this.articleAccessRepo.update({ 
                        where: { 
                            userId_articleId: {
                                articleId: articleId,
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
            const transaction: any = await this.articleTransactionRepo.get({
                where: { unique_id: id },
            });

            const deleted = await this.articleTransactionRepo.delete({ where: { unique_id: id } });

            if(!deleted){
                throw new Error("Could not remove transaction")
            }

            res.status(200).json({ 
                data: { 
                    transaction: deleted
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

    public getTransactions = async (
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
            const totalCount: number = await this.articleTransactionRepo.count(filter); // Assuming you have a method to count total challenges
            const offset = (parsedPage - 1) * parsedLimit;
            
            const transactions = await this.articleTransactionRepo.getAll({ 
                where: {
                    userId: user?.id
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: Number(offset),
                take: Number(limit),
            });

            const createdArticleCompletedTransactions = await this.articleTransactionRepo.getAll({ 
                where: {
                    userId: user?.id,
                    status: "completed",
                    type: "create-article"
                },
                select: {
                    amount: true,
                },
            });

            const readArticleCompletedTransactions = await this.articleTransactionRepo.getAll({ 
                where: {
                    userId: user?.id,
                    status: "completed",
                    type: "read-article"
                },
                select: {
                    amount: true,
                },
            });

            const createdArticleTotalAmount = createdArticleCompletedTransactions.reduce((sum, transaction: any) => {
                const amountAsNumber = parseFloat(transaction?.amount);
                return sum + (isNaN(amountAsNumber) ? 0 : amountAsNumber);
            }, 0);

            const readArticleTotalAmount = readArticleCompletedTransactions.reduce((sum, transaction: any) => {
                const amountAsNumber = parseFloat(transaction?.amount);
                return sum + (isNaN(amountAsNumber) ? 0 : amountAsNumber);
            }, 0);

            const creatorArticlesThatHaveBeenRead: any = await this.articleTransactionRepo.aggregate({
                _sum: {
                    formatAmount: true, // Sum the 'amount' field
                },
                where: {
                    type: "read-article", // Only transactions where users read your article
                    article: {
                        userId: user?.id, 
                    },
                },
            });
            const amountEarned = creatorArticlesThatHaveBeenRead?._sum?.formatAmount || 0;


            const totalPages: number = Math.ceil(totalCount / parsedLimit);
            const hasNextPage: boolean = parsedPage < totalPages;
            const hasPrevPage: boolean = parsedPage > 1;

            res.status(200).json({ 
                totalPages, hasNextPage, hasPrevPage,
                amountEarned: Number(amountEarned?.toFixed(2)),
                transactions,
                createdArticleTotalAmount: createdArticleTotalAmount,
                readArticleTotalAmount: readArticleTotalAmount,
                createdArticleCompletedTransactionsCount: createdArticleCompletedTransactions.length,
                readArticleCompletedTransactionsCount: readArticleCompletedTransactions.length,
                error: false, 
                message: "success" 
            });
        } catch (error) {
            console.error(error);
            this.errorService.handleErrorResponse(error)(res); 
        }
    }

    createTransaction = async(articleId: string, payload: CreateTransactionInterface) => {
        const transaction = await this.articleTransactionRepo.create({ 
            data: {
                articleId,       
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
    
    async handleIntentValidation(intent: string, articleId: string) {
        if (!intent) return null;
    
        const transaction: any = await this.articleTransactionRepo.get({
            where: { unique_id: intent, articleId },
        });

        if (!transaction) return null;
    
        if (transaction.status !== 'completed') {
            const { status } = await code.paymentIntents.getStatus({ intent });
            console.log({status});
            
            if (status === 'confirmed') {
            // UPDATE TRANSACTION AFTER CONFIRMATION
                const updatedTransaction: any = await this.articleTransactionRepo.update({
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
        console.log({transaction});
        try {
            
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
                    key: transaction?.key,
                    unique_id: transaction?.id,
                    locale: transaction?.locale,
                    mode: transaction?.mode,
                    confirmedAt: transaction?.confirmedAt,            
                    reference: transaction?.reference
                }
            });
            console.log({payment});
            
        } catch (error) {
            console.error(error);            
        }
    }
}