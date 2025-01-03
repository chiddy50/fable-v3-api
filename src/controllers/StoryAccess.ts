import express, { Router } from "express";
import { storyAccessService } from "../factories/StoryServiceFactory";
import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";

const StoryAccessController: Router = express.Router();

StoryAccessController.get(
    "/view/:id", 
    storyAccessService.viewStory
);

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

StoryAccessController.get(
    "/continue", 
    middlewareServiceFactory.verifyToken,
    storyAccessService.continueStory
);



export default StoryAccessController;