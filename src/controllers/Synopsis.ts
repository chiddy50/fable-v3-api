import express, { Router, Request, Response } from "express";
import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";
import { synopsisServiceFactory } from "../factories/SynopsisServiceFactory";

const SynopsisController: Router = express.Router();

SynopsisController.put(
    "/:id/update-character", 
    middlewareServiceFactory.verifyToken,
    synopsisServiceFactory.updateSynopsisCharacter
);


export default SynopsisController;
