import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { Response, Request } from "express";
import { RoleTypes } from "../shared/enum";
import * as R from "ramda";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomRequest, IJwtPayload, User } from "../shared/Interface";
import { ZepClient } from "@getzep/zep-cloud";
import path from "path"
import fs from 'fs';
import * as jose from "jose"
import * as code from "@code-wallet/client";
import { Keypair } from "@code-wallet/keys";

export interface IUserService {
  register(req: Request, res: Response): Promise<void>; 
}

type ZepUserPayload = {
  email: string,
  username: string, 
  user_id: string|undefined, 
  publicAddress: string
}
const hostname = process.env.HOSTNAME || 'usefable.xyz';
const verifier = Keypair.generate();

export class UserService implements IUserService {
  constructor(
    private userRepo: IBase,
    private authService: IAuth,
    private errorService: IErrorService
  ) {}

  public register = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    
    try {
      const { publicAddress, username, email, id } = req.body;
    
      const existingUser = await this.userRepo.getUnique({ where: { email } }) as User | null;
    
      const userData = {
        email,
        primaryWalletAddress: publicAddress,
        name: username
      };
    
      const responseMessage: string = existingUser
        ? "User updated"
        : "New user created";
    
      const user = existingUser
        ? await this.userRepo.update({ where: { id: existingUser.id }, data: userData }) as User
        : await this.userRepo.create({ data: userData }) as User;
    
      const statusCode: number = existingUser ? 200 : 201;
      console.log({user});
      
      if (user && !user?.publicId) {
        await this.createExternalUser({
          email,
          username,
          user_id: user?.id, 
          publicAddress
        })
      }
    
      res.status(statusCode).json({ data: user, error: false, message: responseMessage });
    
    } catch (error) {
      this.errorService.handleErrorResponse(error)(res);
    }    
  }

  public getAuthUser = async (
    req: CustomRequest,
    res: Response
  ): Promise<void> => {
    try {
      const user: IJwtPayload = req.user as IJwtPayload; 
      const id = user?.id;

      const reader = await this.userRepo.get({ where: { id } }) as User | null;
      if (!reader) throw new Error("Unidentified User");

      res.status(200).json({ 
        user: reader, 
        error: false, 
        message: "success" 
      });
    } catch (error) {
      this.errorService.handleErrorResponse(error)(res);                  
    }
  }

  public verifyJwt = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      let authorizationHeader = req.headers["authorization"];
      if (!authorizationHeader) {
        throw new Error("Unauthorized");
      }

      const token: string|null = authorizationHeader.split(' ')[1];
      if (!token || token === 'undefined' || token === undefined) {
        throw new Error("No token found");
      }

      const { appPubKey, publicAddress } = req?.body; // social login

      console.log({
        appPubKey,
        publicAddress
      });
      
      if (appPubKey) {
        const jwks = await jose.createRemoteJWKSet(new URL("https://api-auth.web3auth.io/jwks")); // for social logins

        const jwtDecoded = await jose.jwtVerify(token, jwks, { algorithms: ["ES256"] });
        if (!jwtDecoded) {
          return;
        }
        console.log(jwtDecoded);
        if ((jwtDecoded.payload as any).wallets.find((x: { type: string }) => x.type === "web3auth_app_key").public_key.toLowerCase() === appPubKey.toLowerCase()) {
          // Verified
          res.status(200).json({name: 'Verification Successful'})
        } else {
          res.status(400).json({name: 'Verification Failed'})
        }
       
      }

      if (publicAddress) {
        const jwks = await jose.createRemoteJWKSet(new URL("https://authjs.web3auth.io/jwks")); // for external wallet

        const jwtDecoded = await jose.jwtVerify(token, jwks, { algorithms: ["ES256"] });
        if (!jwtDecoded) {
          return;
        }
        console.log(jwtDecoded);
        if((jwtDecoded.payload as any).wallets.find((x: { type: string }) => x.type === "solana").address.toLowerCase() === publicAddress.toLowerCase()) {
          // Verified
          res.status(200).json({name: 'Verification Successful'})
        } else {
          res.status(400).json({name: 'Verification Failed'})
        }

      }

      // res.status(200).json({ 
      //   jwtDecoded,
      //   error: false, 
      //   message: "success" 
      // });

    } catch (error) {
      this.errorService.handleErrorResponse(error)(res);      
    }
  }
  
  public getVerifier = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {

      res.status(200).json({ 
        domain: 'usefable.xyz',        
        verifier: verifier.getPublicKey().toBase58(),
        error: false, 
        message: "success" 
      });
    } catch (error) {
      this.errorService.handleErrorResponse(error)(res);                        
    }
  }

  public createIntent = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
            
      const { clientSecret, id } = await code.loginIntents.create({
        login: {
          verifier: verifier.getPublicKey().toBase58(),
    
          // Cannot be localhost or a subdomain. It must be a domain that you own
          // and have access to. Code will verify that this domain is owned by you
          // by looking for the .well-known/code-payments.json file.
          domain: 'usefable.xyz',
        },
        mode: "login",
        signers: [ verifier ],
      });
    
      console.log('Created intent', id);
    
      // The clientSecret value needs to be sent to the browser so that the browser
      // can use it to setup a login with this intent instance. The client will
      // use the login details along with this value to derive the same login
      // intent id on its end.
    
      res.status(200).json({ 
        clientSecret,      
        error: false, 
        message: "success" 
      });
    } catch (error) {
      this.errorService.handleErrorResponse(error)(res);                              
    }
  }
  
  public loginSuccessful = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    // Get the login intent id from the URL
    const intent = req.params.id;

    try {
      // Get the status of the login intent
      const status = await code.getStatus({ intent });
      const user   = await code.getUserId({ intent, verifier });

      // Render the success page with the intent id and status
      res.status(200).json({ 
        intent, status, user,      
        error: false, 
        message: "success" 
      });
    } catch (error) {
      this.errorService.handleErrorResponse(error)(res);                        
    }
  }

  

  private createExternalUser = async (data: ZepUserPayload) => {
    
    const { email, username, user_id, publicAddress } = data
    const API_KEY = process.env.ZEP_SECRET_KEY
    const zep = new ZepClient({ apiKey: API_KEY });

    const zepUserRecord = await zep.user.add({
      email, 
      firstName: username, 
      userId: user_id,
      metadata: {
        publicAddress
      }
    });
    
    const user = await this.userRepo.update({ 
      where: { id: user_id }, 
      data: { publicId: zepUserRecord.id?.toString() } 
    })
    return user ?? false;
  }
}
