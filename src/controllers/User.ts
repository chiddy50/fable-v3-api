// userRouter.ts
import express, { Router, Request, Response } from "express";
import { userServiceFactory } from "../factories/UserServiceFactory";
import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";

const UserController: Router = express.Router();

UserController.get(
    "/auth", 
    middlewareServiceFactory.verifyToken,
    userServiceFactory.getAuthUser
);
UserController.put("/", 
    middlewareServiceFactory.verifyToken,    
    userServiceFactory.update
);
UserController.post("/", userServiceFactory.register);
UserController.get("/get-data", userServiceFactory.getUserData);

// Testing endpoints
UserController.post("/add-story", userServiceFactory.addStory);
UserController.post("/add-story-genre", userServiceFactory.addStoryGenre);
UserController.post("/add-story-transaction", userServiceFactory.addStoryTransaction);
UserController.post("/add-story-structure", userServiceFactory.addStoryStructure);
UserController.post("/add-story-chapter", userServiceFactory.addStoryChapter);
UserController.post("/add-story-access", userServiceFactory.addStoryAccess);
UserController.post("/add-payments", userServiceFactory.addPayments);

UserController.get("/:id", userServiceFactory.getUser);



UserController.post("/verify-jwt", userServiceFactory.verifyJwt);

export default UserController;
