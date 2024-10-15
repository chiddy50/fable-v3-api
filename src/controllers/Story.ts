import express, { Router, Request, Response } from "express";
import { storyServiceFactory, storyStructureService } from "../factories/StoryServiceFactory";
import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";

const StoryController: Router = express.Router();


StoryController.get(
    "/all", 
    storyServiceFactory.getPublicStories
);

StoryController.post(
    "/", 
    middlewareServiceFactory.verifyToken,
    storyServiceFactory.create
);

StoryController.post(
    "/build-from-scratch", 
    middlewareServiceFactory.verifyToken,
    storyServiceFactory.createNewStoryProject
);

StoryController.put(
    "/structure/:id", 
    middlewareServiceFactory.verifyToken,
    storyStructureService.editStoryStructure
);



StoryController.put(
    "/build-from-scratch/:id", 
    middlewareServiceFactory.verifyToken,
    storyServiceFactory.updateStoryFromScratch
);

StoryController.get(
    "/from-scratch", 
    middlewareServiceFactory.verifyToken,
    storyServiceFactory.getStoriesFromScratch
);

StoryController.get(
    "/from-scratch/:id", 
    middlewareServiceFactory.verifyToken,
    storyServiceFactory.getStoryFromScratch
);

StoryController.put(
    "/publish/:id", 
    middlewareServiceFactory.verifyToken,
    storyServiceFactory.publishAndUnpublishStory
);


StoryController.post(
    "/books", 
    middlewareServiceFactory.verifyToken,
    storyServiceFactory.createStoryBook
);

StoryController.post(
    "/edit-character", 
    middlewareServiceFactory.verifyToken,
    storyServiceFactory.editCharacterImage
);

StoryController.get(
    "/", 
    middlewareServiceFactory.verifyToken,
    storyServiceFactory.getStoryScenes
);

StoryController.get(
    "/:id", 
    middlewareServiceFactory.verifyToken,
    storyServiceFactory.getStoryScene
);

StoryController.get(
    "/read/:id", 
    middlewareServiceFactory.verifyToken,
    storyServiceFactory.readStory
);




export default StoryController;
