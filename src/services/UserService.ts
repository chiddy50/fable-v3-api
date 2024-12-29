import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { Response, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomRequest, IJwtPayload, User } from "../shared/Interface";
import * as jose from "jose"

export interface IUserService {
  register(req: Request, res: Response): Promise<void>; 
}

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
      // console.log({user});
      
      // if (user && !user?.publicId) {
      //   await this.createExternalUser({
      //     email,
      //     username,
      //     user_id: user?.id, 
      //     publicAddress
      //   })
      // }
    
      res.status(statusCode).json({ data: user, error: false, message: responseMessage });
    
    } catch (error) {
      this.errorService.handleErrorResponse(error)(res);
    }    
  }

  public update = async (
    req: CustomRequest,
    res: Response
  ): Promise<void> => {
      try {
        const { depositAddress, name, tipLink } = req.body;

        const user: IJwtPayload = req.user as IJwtPayload; 
        
        if (!user) throw new Error("Unidentified User");

        const userUpdated = await this.userRepo.update({ 
          where: { id: user?.id }, 
          data: {
            ...(depositAddress && { depositAddress: depositAddress }),
            ...(name && { name: name }),
            ...(tipLink && { tipLink: tipLink })
          } 
        }) as User;
        res.status(200).json({ user: userUpdated, error: false, message: "User record updated" });

      } catch (error) {
        this.errorService.handleErrorResponse(error)(res);                          
      }
  }

  public getUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {

      const { id: userId } = req.params;

      const user = await this.userRepo.get({ 
        where: {
          id: userId
        },
        include: {
          _count: {
            select: {
              articles: true,
              stories: true
            }
          },
          socialMedia: true
 
        }
      });

      res.status(200).json({ 
        user, 
        error: false, 
        message: "success" 
      });
    } catch (error) {
      this.errorService.handleErrorResponse(error)(res);                        
    }
  }

  public getUserData = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {

      const users = await this.userRepo.getAll({ 
        include: {
          stories: {
            include: {  // Use another 'include' here instead of direct properties
              storyStructure: true,
              // storyAccess: true
            }
          },
          transactions: true,
          socialMedia: true
        }
      });

      res.status(200).json({ 
        users, 
        error: false, 
        message: "success" 
      });
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

      const reader = await this.userRepo.get({ 
        where: { id }, 
        include: { socialMedia: true } 
      }) as User | null;
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
 
  
}
