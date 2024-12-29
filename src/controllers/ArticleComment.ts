import express, { Router } from "express";

import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";
import { articleCommentServiceFactory } from "../factories/ArticleCommentServiceFactory";

const ArticleCommentController: Router = express.Router();
ArticleCommentController.post(
    "/", 
    middlewareServiceFactory.verifyToken,    
    articleCommentServiceFactory.createComment
);


export default ArticleCommentController;
