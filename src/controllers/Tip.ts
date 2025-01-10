import express, { Router, Request, Response } from "express";
import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";
import { tipServiceFactory } from "../factories/TipServiceFactory";

const TipController: Router = express.Router();

TipController.post(
    "/create-intent/:id", 
    tipServiceFactory.createIntent
);

TipController.post(
    "/confirm/:id", 
    tipServiceFactory.confirmTip
);

TipController.post(
    "/", 
    middlewareServiceFactory.verifyToken,
    tipServiceFactory.confirmTip
);

TipController.delete(
    "/:id", 
    tipServiceFactory.deleteTip
);


export default TipController;
