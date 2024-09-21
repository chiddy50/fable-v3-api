import express, { Router, Request, Response } from "express";
import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";
import { characterServiceFactory } from "../factories/CharacterServiceFactory";

const CharacterController: Router = express.Router();

CharacterController.post(
    "/", 
    middlewareServiceFactory.verifyToken,
    characterServiceFactory.create
);

CharacterController.put(
    "/:id", 
    middlewareServiceFactory.verifyToken,
    characterServiceFactory.update
);

export default CharacterController;
