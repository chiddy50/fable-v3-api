// userRouter.ts
import express, { Router } from "express";

import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";
import { helperServiceFactory } from "../factories/HelperServiceFactory";

const HelperController: Router = express.Router();
HelperController.get("/genres", helperServiceFactory.getGenres);

export default HelperController;
