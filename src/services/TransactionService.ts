import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { Response, Request } from "express";
import { Character, CustomRequest, IJwtPayload, Image, Page, Scene, Story } from "../shared/Interface";
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
        private storyRepo: IBase,
        private characterRepo: IBase,
        private storyStructureRepo: IBase,        
        private authService: IAuth,
        private errorService: IErrorService
    ) {}

    public createIntent = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {

        const { id } = req.params;
        const { narration } = req.body;

        const storyId = id;
        const amount = 0.05;
        const currency = 'usd';

        const deposit_address = process.env.CODE_WALLET_DEPOSIT_ADDRESS ?? "";

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
                type: "create-story",
                amount: amount.toString(),
                currency,
                narration,
                deposit_address,
                clientSecret: clientSecret.toString(),
                id: id.toString(),
            });

            const { success, message } = await code.webhook.register({
                intent: id,
                // url: process.env.WEBHOOK_URL ?? "",
                url: "https://tions-put-teaching-qty.trycloudflare.com/transactions/webhook"
            });
        
            console.log('Registered webhook', success, message);

            res.status(200).json({ 
                data: { 
                    clientSecret, id
                }, 
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
            const { storyId, clientSecret, destination, locale, mode } = req.body;
            const user: IJwtPayload = req.user as IJwtPayload;    

            const transaction: any = await this.transactionRepo.get({
                where: { 
                    unique_id: id, 
                    storyId, 
                    key: clientSecret,
                    deposit_address: destination
                },
            });
    
            if (!transaction) {
                throw new Error("Could not update transaction")
            }

            const updatedTransaction: any = await this.transactionRepo.update({
                where: { 
                    id: transaction.id,
                    unique_id: id, 
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

            res.status(200).json({ 
                data: { 
                    transaction: updatedTransaction,
                    story: updateStory
                }, 
                error: false, 
                message: "success" 
            });

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

    createTransaction = async(storyId: string, payload: CreateTransactionInterface) => {
        const transaction = await this.transactionRepo.create({ 
            data: {
                storyId,       
                status: "initiated",          
                type: payload.type,          
                narration: payload.narration,
                amount: payload.amount,    
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
    
}   
