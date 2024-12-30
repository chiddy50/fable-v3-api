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
UserController.get("/:id", userServiceFactory.getUser);



UserController.post("/verify-jwt", userServiceFactory.verifyJwt);

export default UserController;
