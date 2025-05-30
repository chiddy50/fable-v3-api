import express, { Router, Request, Response } from "express";
import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";
import { synopsisServiceFactory } from "../factories/SynopsisServiceFactory";

const SynopsisController: Router = express.Router();

SynopsisController.put(
    "/:id/update-character", 
    middlewareServiceFactory.verifyToken,
    synopsisServiceFactory.updateSynopsisCharacter
);


SynopsisController.put(
    "/:id/create-characters", 
    middlewareServiceFactory.verifyToken,
    synopsisServiceFactory.createManySynopsisCharacters
);

SynopsisController.put(
    "/:id/add-character", 
    middlewareServiceFactory.verifyToken,
    synopsisServiceFactory.addSynopsisCharacter
);

SynopsisController.put(
    "/:id/update-character-relationship", 
    middlewareServiceFactory.verifyToken,
    synopsisServiceFactory.updateSynopsisCharacterRelationship
);

SynopsisController.put(
    "/:id/create-synopsis", 
    middlewareServiceFactory.verifyToken,
    synopsisServiceFactory.createSynopsisAndDisablePreviousOnes
);






export default SynopsisController;
