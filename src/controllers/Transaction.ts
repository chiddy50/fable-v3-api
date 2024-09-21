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

TransactionController.put(
    "/webhook", 
    transactionServiceFactory.webhook
);

export default TransactionController;
