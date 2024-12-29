import express, { Router } from "express";

import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";
import { imageServiceFactory } from "../factories/ImageServiceFactory";

const ImageController: Router = express.Router();
ImageController.post(
    "/", 
    middlewareServiceFactory.verifyToken,    
    imageServiceFactory.addImage
);

export default ImageController;
