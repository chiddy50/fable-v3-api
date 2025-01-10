import express, { Router } from "express";

import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";
import { articleServiceFactory } from "../factories/ArticleServiceFactory";

const ArticleController: Router = express.Router();
ArticleController.post(
    "/", 
    middlewareServiceFactory.verifyToken,    
    articleServiceFactory.createArticle
);

ArticleController.get(
    "/user", 
    middlewareServiceFactory.verifyToken,    
    articleServiceFactory.getUserArticles
);

ArticleController.get(
    "/users/:id", 
    articleServiceFactory.getUnauthenticatedUserArticles
);

ArticleController.get(
    "/", 
    articleServiceFactory.getArticles
);

ArticleController.get(
    "/:id", 
    middlewareServiceFactory.verifyToken,    
    articleServiceFactory.getArticle
);

ArticleController.delete(
    "/:id", 
    middlewareServiceFactory.verifyToken,    
    articleServiceFactory.deleteArticle
);

ArticleController.put(
    "/:id", 
    middlewareServiceFactory.verifyToken,    
    articleServiceFactory.updateArticle
);

ArticleController.get(
    "/read/:id", 
    middlewareServiceFactory.verifyToken,    
    articleServiceFactory.readArticle
);

ArticleController.put(
    "/:id/like", 
    middlewareServiceFactory.verifyToken,    
    articleServiceFactory.likeArticle
);

ArticleController.put(
    "/:id/rate", 
    middlewareServiceFactory.verifyToken,    
    articleServiceFactory.rateArticle
);

ArticleController.put(
    "/tags", 
    middlewareServiceFactory.verifyToken,    
    articleServiceFactory.getArticleTags
);



export default ArticleController;
