import express, { Router, Request, Response } from "express";
import { storyServiceFactoryV2 } from "../../factories/StoryServiceFactory";
import { middlewareServiceFactory } from "../../factories/MiddleServiceFactory";

const StoryControllerV2: Router = express.Router();



StoryControllerV2.get(
    "/count", 
    storyServiceFactoryV2.getStoriesCount
);

StoryControllerV2.get(
    "/", 
    middlewareServiceFactory.verifyToken,
    storyServiceFactoryV2.getStories
);

StoryControllerV2.post(
    "/", 
    middlewareServiceFactory.verifyToken,
    storyServiceFactoryV2.createStory
);

StoryControllerV2.post(
    "/getting-started", 
    middlewareServiceFactory.verifyToken,
    storyServiceFactoryV2.createGettingStarted
);

StoryControllerV2.put(
    "/getting-started/:id", 
    middlewareServiceFactory.verifyToken,
    storyServiceFactoryV2.updateGettingStarted
);

StoryControllerV2.put(
    "/:id", 
    middlewareServiceFactory.verifyToken,
    storyServiceFactoryV2.updateStory
);


StoryControllerV2.put(
    "/:id/synopsis-list", 
    middlewareServiceFactory.verifyToken,
    storyServiceFactoryV2.updateSynopsisList
);

StoryControllerV2.put(
    "/:id/synopsis-character", 
    middlewareServiceFactory.verifyToken,
    storyServiceFactoryV2.updateSynopsisCharacter
);


StoryControllerV2.put(
    "/:id/all-synopsis", 
    middlewareServiceFactory.verifyToken,
    storyServiceFactoryV2.updateAllSynopsis
);




StoryControllerV2.get(
    "/:id", 
    middlewareServiceFactory.verifyToken,
    storyServiceFactoryV2.getStory
);


StoryControllerV2.get(
    "/unauthenticated/:id", 
    storyServiceFactoryV2.getUnauthenticatedStory
);








export default StoryControllerV2;
