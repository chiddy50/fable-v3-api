import { Response, NextFunction } from "express";
import { IAuth } from "./AuthService";
import { CustomRequest, IJwtPayload } from "./Interface";
import { IErrorService } from "./ErrorService";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IBase } from "../repositories/BaseRepository";
import * as jose from "jose"


export interface IMiddlewareService {
  verifyToken(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}

export class MiddlewareService implements IMiddlewareService {
  constructor(
    private authService: IAuth,
    private errorService: IErrorService,
    private userRepo: IBase,
  ) {}

  public verifyToken = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
//     try {
//       let authorizationHeader = req.headers["authorization"];      
//       if (!authorizationHeader) {
//         throw new Error("Unauthorized");
//       }

//       const token: string|null = authorizationHeader.split(' ')[1];
//       if (!token || token === 'undefined' || token === undefined) {
//         throw new Error("No token found");
//       }

//       const publicKey = `-----BEGIN PUBLIC KEY-----
// MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAtzg4VFYxS4liX6/ZumLmcNi8m/RpGMKB/MaubI8/NkBCgQJE7CMOCqQmKMYzpb9FrOVqyuEpIqz/HFaTawsiTzB0+KlzOTIBaMeWHETY7oJc4XSu/KTtSx+d6uVMaZEvdFiRv6V2h4q+0gaVexzaoeek/SdnQBPRVxqYzkuSsvTIkQH6+aMecTGR0Pa1wm0QormnyhIzt0DjS6u/rFMqODy3RCXiwW5huuU2kjPKY6+mMxTFIpxhOBoO0DyRDWR3RRiBd9ocF+mt+U6+8ONtGIII49MpUyItZgjgIA8wf3MHsGGLCY2SuW5rIj2WaFE8olWBNPcrBVnuCtGYn3NgxXSMjsuqG5/bJN2CPK3PH/hse0v2IMkCDvRR5xrAPu+6+vaPeNCKg5tJ8zNgN7V398+Wb/+xQDC30PIlJE9UPubW01bCxqttFnZP0X+XzUJ6lEiHZjWkAlY4wNfdaNfFEFAWCy4KLyyODpwEt+54ZfcsiygUZtVOiUTjQwGaFSsm4v4dY2QbkmRKUs5ftj7OzcjeRKBQFsSKHNib1RulfuJ/ERRDky/Shn/9ACdQ7EyP5FMgnDc6yOJ4wMyK5pkrVoz8hYMn/OnmM+XgWkVoWckk9JjzfQ9WLiftpFQ1xiZ5dfF29t1otE7ERyv3JFes0POJOQiKikN3ZHNrGqnEemsCAwEAAQ==
// -----END PUBLIC KEY-----`;          

//       jwt.verify(token, publicKey, { algorithms: ['RS256'] }, async (err: any, decodedToken:  JwtPayload | string | undefined) => {
//         if (err || decodedToken === undefined) {
//           throw new Error("Invalid token");
//         }

//         if (typeof decodedToken === 'string') {
//           throw new Error("Invalid token format");
//         }                
        
//         const exp = decodedToken && decodedToken.exp ? decodedToken.exp : null;
//         if (!exp) {
//           throw new Error("Invalid token");          
//         }
//         const now = Math.floor(Date.now() / 1000); // Current time in seconds since epoch
//         if (exp < now) {
//           throw new Error("Token has expired");          
//         } 
        
//         // const isNew = (decodedToken.iat > now - 60); // Example logic: token is considered new if issued within the last minute
//         const isNew = decodedToken && decodedToken.iat ? (decodedToken.iat > now - 60) : false; // Check if decodedToken and decodedToken.iat are defined before comparing

//         const { email, new_user, username } = decodedToken
        

//         let auth_user: any = null
//         auth_user = await this.userRepo.getUnique({
//           where: { email },
//           select: {
//             id: true,
//             name: true,
//             email: true,            
//             publicId: true,            
//           },
//         });

//         if (auth_user) {
//           // console.log("EXISITNG USER FOUND....", {new_user});

//           req["user"] = auth_user;
//           next();          
//         }

//         if (!auth_user) {
//           let new_user: any = await this.userRepo.create({
//             data: {
//               name: username,
//               email
//             },
//             select: {
//               id: true,
//               name: true,
//               email: true,
//               publicId: true,
//             },
//           });
//           // console.log("USER NOT FOUND, CREATING....", {new_user});
          
//           req["user"] = new_user;
//           next();
//         }
        

//       });

//     } catch (error: any) {      
//       this.errorService.handleErrorResponse(error.message)(res);
//     }
  

    try {
      let authorizationHeader = req.headers["authorization"];
      let publicAddressHeader = req.headers["public-address"]; // WALLET LOGIN
      let publicKeyHeader = req.headers["public-key"]; // SOCIAL LOGIN
      console.log({publicAddressHeader, publicKeyHeader});
      if (!authorizationHeader) {
        throw new Error("Unauthorized");
      }

      if (!publicAddressHeader && !publicKeyHeader) {
        throw new Error("Unauthorized");
      }

      const token: string|null = authorizationHeader.split(' ')[1];
      if (!token || token === 'undefined' || token === undefined) {
        throw new Error("No jwt token found");
      }


      if (publicKeyHeader) {        
        const jwks = await jose.createRemoteJWKSet(new URL("https://api-auth.web3auth.io/jwks")); 
        const jwtDecoded = await jose.jwtVerify(token, jwks, { algorithms: ["ES256"] });        
        if (!jwtDecoded) {
          throw new Error("Invalid JWT");
        }

        let { iat, aud, iss, nonce, wallets, email, name, typeOfLogin, profileImage, verifierId, verifier, aggregateVerifier, exp } = jwtDecoded?.payload;
        // console.log(jwtDecoded);
        if ((jwtDecoded.payload as any).wallets.find((x: { type: string }) => x.type === "web3auth_app_key").public_key.toLowerCase() === (publicKeyHeader as string).toLowerCase()) {
          let auth_user: any = null
          auth_user = await this.userRepo.getUnique({
            where: { email: email },
            select: {
              id: true,
              name: true,
              email: true,            
              publicId: true,  
              primaryWalletAddress: true          
            },
          });
          if (auth_user) {
            console.log("EXISITNG USER FOUND....", {auth_user});
            req["user"] = auth_user;
            next();          
          }

          if (!auth_user) {
            let new_user: any = await this.userRepo.create({
              data: {
                email,
                primaryWalletAddress: publicKeyHeader,
                name
              },
              select: {
                id: true,
                name: true,
                email: true,
                publicId: true,
              },
            });
            console.log("USER NOT FOUND, CREATING....", {new_user});
            
            req["user"] = new_user;
            next();
          }
          
        } else {
          throw new Error("Verification Failed");
        }
      }

      if (publicAddressHeader) {
        const jwks = await jose.createRemoteJWKSet(new URL("https://authjs.web3auth.io/jwks")); // for external wallet
        const jwtDecoded = await jose.jwtVerify(token, jwks, { algorithms: ["ES256"] });
        if (!jwtDecoded) {
          throw new Error("Invalid JWT");
        }
        let { iat, aud, iss, wallets, exp } = jwtDecoded?.payload;
        
        if((jwtDecoded.payload as any).wallets.find((x: { type: string }) => x.type === "solana").address.toLowerCase() === (publicAddressHeader as string).toLowerCase()) {
          let auth_user: any = null
          auth_user = await this.userRepo.getUnique({
            where: { publicId: publicAddressHeader },
            select: {
              id: true,
              name: true,
              email: true,            
              publicId: true,  
              primaryWalletAddress: true          
            },
          });
          if (auth_user) {
            console.log("EXISITNG USER FOUND....", {auth_user});
            req["user"] = auth_user;
            next();          
          }          
          // console.log(jwtDecoded);

          if (!auth_user) {
            let new_user: any = await this.userRepo.create({
              data: {
                publicId: publicAddressHeader,
              },
              select: {
                id: true,
                name: true,
                email: true,
                publicId: true,
              },
            });
            console.log("USER NOT FOUND, CREATING....", {new_user});
            
            req["user"] = new_user;
            next();
          }

        } else {
          throw new Error("Verification Failed");
        }
      }
      
    } catch (error: any) {
      this.errorService.handleErrorResponse(error?.message)(res);      
    }
  };
  


  public verfyToken2 = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let token = req.headers["authorization"];
      if (token && typeof token === "string") {
        token = token.replace("Bearer ", "");
        let user: IJwtPayload = await this.authService.decrypt(token.trim());
        req["user"] = user;
        next();
      } else {
        throw new Error("Unauthorized");
      }
    } catch (error: any) {
      this.errorService.handleErrorResponse(error.message)(res);
    }
  };
}
