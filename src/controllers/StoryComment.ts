import express, { Router, Request, Response } from "express";
import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";
import { storyCommentServiceFactory } from "../factories/StoryCommentServiceFactory";

const StoryCommentController: Router = express.Router();


StoryCommentController.get(
    "/", 
    storyCommentServiceFactory.getComments
);

StoryCommentController.post(
    "/", 
    middlewareServiceFactory.verifyToken,
    storyCommentServiceFactory.createComment
);

StoryCommentController.get(
    "/:id", 
    middlewareServiceFactory.verifyToken,
    storyCommentServiceFactory.getComment
);






export default StoryCommentController;
