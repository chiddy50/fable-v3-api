import express, { Router, Request, Response } from "express";
import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";
import { chapterServiceFactory } from "../factories/ChapterServiceFactory";

const ChapterController: Router = express.Router();

ChapterController.put(
    "/chapter-one/:id", 
    middlewareServiceFactory.verifyToken,
    chapterServiceFactory.createChapterOne
);

ChapterController.put(
    "/chapter-two/:id", 
    middlewareServiceFactory.verifyToken,
    chapterServiceFactory.createChapterTwo
);

ChapterController.put(
    "/chapter-three/:id", 
    middlewareServiceFactory.verifyToken,
    chapterServiceFactory.createChapterThree
);

ChapterController.put(
    "/chapter-four/:id", 
    middlewareServiceFactory.verifyToken,
    chapterServiceFactory.createChapterFour
);

ChapterController.put(
    "/chapter-five/:id", 
    middlewareServiceFactory.verifyToken,
    chapterServiceFactory.createChapterFive
);

ChapterController.put(
    "/chapter-six/:id", 
    middlewareServiceFactory.verifyToken,
    chapterServiceFactory.createChapterSix
);

ChapterController.put(
    "/chapter-seven/:id", 
    middlewareServiceFactory.verifyToken,
    chapterServiceFactory.createChapterSeven
);

export default ChapterController;
