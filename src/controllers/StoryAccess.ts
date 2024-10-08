import express, { Router } from "express";
import { storyAccessService } from "../factories/StoryServiceFactory";
import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";

const StoryAccessController: Router = express.Router();

StoryAccessController.get(
    "/read/:id", 
    middlewareServiceFactory.verifyToken,
    storyAccessService.readStory
);

StoryAccessController.put(
    "/move-story/:id", 
    middlewareServiceFactory.verifyToken,
    storyAccessService.moveStoryChapter
);

export default StoryAccessController;