// userRouter.ts
import express, { Router } from "express";

import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";
import { assetServiceFactory } from "../factories/AssetServiceFactory";

const AssetController: Router = express.Router();
AssetController.post("/", assetServiceFactory.createAsset);

export default AssetController;
