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

export interface ICreditTransactionService {
    createCreditTransaction(req: Request, res: Response): Promise<void>;       
}

export class CreditTransactionService implements ICreditTransactionService {

    constructor(        
        private creditTransactionRepo: IBase,
        private userRepo: IBase,   
        private paymentRepo: IBase,            
        private authService: IAuth,
        private errorService: IErrorService
    ) {}

    public createCreditTransaction = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {

        // const { id: userId } = req.params;
        const { narration, type, destination, amount } = req.body;
        const user: IJwtPayload = req.user as IJwtPayload; 
        
        const currency = 'usd';

        try {
            const { clientSecret, id } = await code.paymentIntents.create({
                amount,
                currency,
                destination: destination,
                mode: type,
            });            
            console.log({ clientSecret, id });
            
            await this.addPayment({
                type: type,
                amount: amount.toString(),
                currency,
                narration,
                deposit_address: destination,
                clientSecret: clientSecret.toString(),
                userId: user.id,
                id: id.toString(),
                mode: "payment"
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

    public confirmCreditPurchase = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const { userId, clientSecret, destination, locale, mode, type, purpose, description } = req.body;
   
            const user: IJwtPayload = req.user as IJwtPayload; 

            // const user = await this.userRepo.getUnique({ where: { id: userId } }) as User | null;
            
            const transaction: any = await this.paymentRepo.get({
                where: { 
                    // unique_id: id, 
                    userId: user?.id,
                    key: clientSecret,
                    deposit_address: destination
                },
            });
            
            if (!transaction) throw new Error("Could not update transaction");

            const validation = await code.paymentIntents.getStatus({ intent: id });
            console.log({validation});            
            
            if (transaction.status !== "completed") {

                const updatedTransaction: any = await this.paymentRepo.update({
                    where: { 
                        id: transaction.id,
                        userId,
                        key: clientSecret,
                    },
                    data: {
                        status: "completed",
                        locale, 
                        mode,
                        confirmedAt: new Date(),
                    }
                });

                await this.addCreditTransaction({
                    userId: user?.id,
                    type: purpose, // "purchase" or "usage",
                    amount: updatedTransaction.amount,
                    description
                });

                let userCreditsUpdated = await this.userRepo.update({
                    where: { id: user?.id },
                    data: { 
                        credits: { increment: updatedTransaction.amount } 
                    },
                });
    
                res.status(200).json({ 
                    transaction: updatedTransaction,
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

    addPayment = async (transaction: any) => {

        const payment = await this.paymentRepo.create({
            data: {
                status: "initiated",          
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
                reference: uuidv4()
            }
        });      
    }

    addCreditTransaction = async (data: any) => {
        const creditTransaction = await this.creditTransactionRepo.create({
            data: {
                userId: data?.userId,
                type: data?.type,
                amount: data?.amount,
                description: data?.description,
            }
        }); 
    }


    
}   
