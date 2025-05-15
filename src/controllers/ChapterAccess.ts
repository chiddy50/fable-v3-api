import express, { Router } from "express";
import { storyAccessService } from "../factories/StoryServiceFactory";
import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";

const ChapterAccessController: Router = express.Router();

// ChapterAccessController.get(
//     "/view/:id", 
//     storyAccessService.viewStory
// );

ChapterAccessController.get(
    "/read/:id", 
    middlewareServiceFactory.verifyToken,
    storyAccessService.readStory
);

// ChapterAccessController.put(
//     "/move-story/:id", 
//     middlewareServiceFactory.verifyToken,
//     storyAccessService.moveStoryChapter
// );

// ChapterAccessController.get(
//     "/continue", 
//     middlewareServiceFactory.verifyToken,
//     storyAccessService.continueStory
// );



export default ChapterAccessController;