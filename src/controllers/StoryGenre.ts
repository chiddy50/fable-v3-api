import express, { Router } from "express";
import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";
import { storyGenreServiceFactory } from "../factories/StoryGenreServiceFactory";

const StoryGenreController: Router = express.Router();

StoryGenreController.get(
    "/", 
    storyGenreServiceFactory.getDistinctGenres
);



export default StoryGenreController;
