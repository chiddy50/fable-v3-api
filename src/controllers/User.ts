// userRouter.ts
import express, { Router, Request, Response } from "express";
import { userServiceFactory } from "../factories/UserServiceFactory";
import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";

const UserController: Router = express.Router();
UserController.post("/", userServiceFactory.register);
UserController.get(
    "/auth", 
    middlewareServiceFactory.verifyToken,
    userServiceFactory.getAuthUser
);
export default UserController;
