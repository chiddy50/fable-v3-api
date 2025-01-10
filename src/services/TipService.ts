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

export interface ITipService {
    createIntent(req: Request, res: Response): Promise<void>;       
}

export class TipService implements ITipService {

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
        req: Request,
        res: Response
    ): Promise<void> => {

        const { id: userId } = req.params;
        const { narration, type, destination, amount } = req.body;
        
        const currency = 'usd';

        try {
            const { clientSecret, id } = await code.paymentIntents.create({
                amount,
                currency,
                destination: destination,
                mode: type,
            });
            
            // The id value can also be used to query the status of the payment intent manually
            console.log('Created intent', id);

            await this.createPayment({
                type: type,
                amount: amount.toString(),
                currency,
                narration,
                deposit_address: destination,
                clientSecret: clientSecret.toString(),
                userId: userId,
                mode: "tip"
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

    public confirmTip = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const { userId, clientSecret, destination, locale, mode, type } = req.body;
   
            const user = await this.userRepo.getUnique({ where: { id: userId } }) as User | null;
            
            const transaction: any = await this.paymentRepo.get({
                where: { 
                    // unique_id: id, 
                    userId: user?.id,
                    key: clientSecret,
                    deposit_address: destination
                },
            });
            console.log({transaction});
            
            if (!transaction) throw new Error("Could not update transaction");

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

    public deleteTip = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const { id } = req.params;
        const { clientSecret } = req.body;
        
        try {
            const transaction: any = await this.paymentRepo.get({
                where: { key: id },
            });
            if(!transaction){
                throw new Error("Invalid transaction")
            }

            const deleted = await this.paymentRepo.delete({ where: { key: id } });
            if(!deleted){
                throw new Error("Could not remove transaction")
            }

            res.status(200).json({ 
                data: deleted,
                error: false, 
                message: "success" 
            });

        } catch (error) {
            console.error(error);   
            this.errorService.handleErrorResponse(error)(res);   
        }
    }

    createPayment = async (transaction: any) => {

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
    
}   
