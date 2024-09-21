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
        const storyId = id;
        const amount = 0.05;
        const currency = 'usd';

        const deposit_address = process.env.CODE_WALLET_DEPOSIT_ADDRESS ?? "";

        try {
            const { clientSecret, id } = await code.paymentIntents.create({
                amount,
                currency,
                destination: deposit_address,
                mode: "tip",
                idempotencyKey: `${storyId}`,
                // webhook: { url: config.webhookURL },
            });
            
            // The id value can also be used to query the status of the payment intent manually
            console.log('Created intent', id);

            // Save transaction record
            let transaction = await this.createTransaction(storyId, {
                type: "create-story",
                amount: amount.toString(),
                currency,
                deposit_address,
                clientSecret: clientSecret.toString(),
                id: id.toString(),
            });

            // const { success, message } = await code.webhook.register({
            //     intent: id,
            //     url: process.env.WEBHOOK_URL ?? "",
            // })
        
            // console.log('Registered webhook', success, message);

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

            // if (!transaction) throw new Error("Transaction Not Found");

            // const { status } = await code.paymentIntents.getStatus({ intent: id });

            res.status(200).json({ 
                data: { 
                    // status, 
                    id, transaction
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

        console.log('Received webhook event:', token);

        try {
            const publicKey = config.codeSequencerPublicKey;

        } catch (error) {
            
        }
    }

    createTransaction = async(storyId: string, payload: CreateTransactionInterface) => {
        const transaction = await this.transactionRepo.create({ 
            data: {
                storyId,       
                status: "initiated",          
                type: payload.type,          
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
                return { status, updatedTransaction};
            } else {
                return null;
            }
        }
    
        return transaction;
    }
    
}   
