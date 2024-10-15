// userRouter.ts
import express, { Router, Request, Response } from "express";
import { authenticationServiceFactory } from "../factories/UserServiceFactory";
import { middlewareServiceFactory } from "../factories/MiddleServiceFactory";

const AuthenticationController: Router = express.Router();

AuthenticationController.get("/get-verifier", authenticationServiceFactory.getVerifier);
AuthenticationController.post("/create-intent", authenticationServiceFactory.createIntent);
AuthenticationController.get("/login/:id", authenticationServiceFactory.loginSuccessful);


export default AuthenticationController;
