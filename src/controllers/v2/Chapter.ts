import express, { Router, Request, Response } from "express";
import { middlewareServiceFactory } from "../../factories/MiddleServiceFactory";
import { chapterServiceFactoryV2 } from "../../factories/ChapterServiceFactory";

const ChapterControllerV2: Router = express.Router();

ChapterControllerV2.post(
    "/", 
    middlewareServiceFactory.verifyToken,
    chapterServiceFactoryV2.createChapter
);

ChapterControllerV2.put(
    "/:id", 
    middlewareServiceFactory.verifyToken,
    chapterServiceFactoryV2.updateChapter
);

ChapterControllerV2.put(
    "/publish/:id", 
    middlewareServiceFactory.verifyToken,
    chapterServiceFactoryV2.publishChapter
);

ChapterControllerV2.put(
    "/update-many/:id", 
    middlewareServiceFactory.verifyToken,
    chapterServiceFactoryV2.updateManyChapters
);




export default ChapterControllerV2;
