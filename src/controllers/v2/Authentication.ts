// userRouter.ts
import express, { Router, Request, Response } from "express";
import { authenticationServiceFactoryV2 } from "../../factories/UserServiceFactory";
import { middlewareServiceFactory } from "../../factories/MiddleServiceFactory";

const AuthenticationControllerV2: Router = express.Router();


AuthenticationControllerV2.post("/login", authenticationServiceFactoryV2.login);

AuthenticationControllerV2.post("/register", authenticationServiceFactoryV2.register);


export default AuthenticationControllerV2;
