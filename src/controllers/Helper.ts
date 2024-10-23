// userRouter.ts
import express, { Router } from "express";

import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";
import { helperServiceFactory } from "../factories/HelperServiceFactory";

const HelperController: Router = express.Router();
HelperController.get("/genres", helperServiceFactory.getGenres);
HelperController.post("/create-user", helperServiceFactory.createUser);
HelperController.post("/update-story-data", helperServiceFactory.updateStoryData);

export default HelperController;
