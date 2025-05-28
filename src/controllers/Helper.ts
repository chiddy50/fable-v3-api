// userRouter.ts
import express, { Router } from "express";

import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";
import { helperServiceFactory } from "../factories/HelperServiceFactory";

const HelperController: Router = express.Router();
HelperController.get("/genres", helperServiceFactory.getGenres);
HelperController.get("/target-audiences", helperServiceFactory.getTargetAudiences);
HelperController.post("/create-user", helperServiceFactory.createUser);
HelperController.post("/update-user", helperServiceFactory.updateUser);
HelperController.post("/update-story-data", helperServiceFactory.updateStoryData);
HelperController.post("/update-story-publishing", helperServiceFactory.updateStoryPublishing);
HelperController.post("/delete-user", helperServiceFactory.deleteUser);
HelperController.get("/get-users", helperServiceFactory.getUsers);
HelperController.put("/update-chapter/:id", helperServiceFactory.updateChapter);

HelperController.post("/delete-story", helperServiceFactory.deleteStory);


export default HelperController;
