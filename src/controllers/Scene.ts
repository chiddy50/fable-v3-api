import express, { Router, Request, Response } from "express";
import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";
import { sceneServiceFactory } from "../factories/SceneServiceFactory";

const SceneController: Router = express.Router();

SceneController.put(
    "/:id", 
    middlewareServiceFactory.verifyToken,
    sceneServiceFactory.updateScene
);

export default SceneController;
