import express, { Router, Request, Response } from "express";
import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";
import { creditTransactionServiceFactory } from "../factories/CreditTransactionServiceFactory";

const CreditTransactionController: Router = express.Router();

CreditTransactionController.post(
    "/", 
    middlewareServiceFactory.verifyToken,
    creditTransactionServiceFactory.createCreditTransaction
);


CreditTransactionController.put(
    "/confirm/:id", 
    middlewareServiceFactory.verifyToken,
    creditTransactionServiceFactory.confirmCreditPurchase
);



export default CreditTransactionController;
