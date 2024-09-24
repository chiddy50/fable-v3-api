import express, { Router, Request, Response } from "express";
import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";
import { transactionServiceFactory } from "../factories/TransactionServiceFactory";

const TransactionController: Router = express.Router();

TransactionController.post(
    "/create-intent/:id", 
    middlewareServiceFactory.verifyToken,
    transactionServiceFactory.createIntent
);

TransactionController.post(
    "/verify/:id", 
    middlewareServiceFactory.verifyToken,
    transactionServiceFactory.verifyIntent
);

TransactionController.post(
    "/confirm/:id", 
    middlewareServiceFactory.verifyToken,
    transactionServiceFactory.confirmTransaction
);

TransactionController.post(
    "/", 
    middlewareServiceFactory.verifyToken,
    transactionServiceFactory.confirmTransaction
);

TransactionController.delete(
    "/:id", 
    middlewareServiceFactory.verifyToken,
    transactionServiceFactory.deleteTransaction
);


TransactionController.post(
    "/webhook", 
    transactionServiceFactory.webhook
);



export default TransactionController;
