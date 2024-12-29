import express, { Router, Request, Response } from "express";
import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";
import { articleTransactionServiceFactory } from "../factories/ArticleTransactionServiceFactory";

const ArticleTransactionController: Router = express.Router();

ArticleTransactionController.post(
    "/create-intent/:id", 
    middlewareServiceFactory.verifyToken,
    articleTransactionServiceFactory.createIntent
);

ArticleTransactionController.get(
    "/user", 
    middlewareServiceFactory.verifyToken,
    articleTransactionServiceFactory.getTransactions
);


ArticleTransactionController.post(
    "/verify/:id", 
    middlewareServiceFactory.verifyToken,
    articleTransactionServiceFactory.verifyIntent
);

ArticleTransactionController.post(
    "/confirm/:id", 
    middlewareServiceFactory.verifyToken,
    articleTransactionServiceFactory.confirmTransaction
);

ArticleTransactionController.post(
    "/", 
    middlewareServiceFactory.verifyToken,
    articleTransactionServiceFactory.confirmTransaction
);

ArticleTransactionController.delete(
    "/:id", 
    middlewareServiceFactory.verifyToken,
    articleTransactionServiceFactory.deleteTransaction
);


ArticleTransactionController.post(
    "/webhook", 
    articleTransactionServiceFactory.webhook
);



export default ArticleTransactionController;
