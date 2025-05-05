import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { Response, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as jose from "jose"
import * as code from "@code-wallet/client";
import { Keypair } from "@code-wallet/keys";

export interface IAuthenticationService {
//   register(req: Request, res: Response): Promise<void>; 
}

// JWT Secret from environment
const JWT_SECRET = process.env.JWT_SECRET ?? "d8186f2284334f71dcf3acc3b4218784e77df56c9e1ef7332c16590511dd72caf135dc21531c0287a789878b76b422d4f71b1d9032a1f47015fad73119ae40ab28b836bb4ee5723bf2f86f6898970c9766cab0f06c54209b0a43a6973dfbadf70d0c3dcf6cbd7bc242431433e492f1179885d684de0a0f17b1ae741ea38e077b4575ade965cc0331bdc40025c6600a46e3767baf5aff91cf7b41bce725dbeb340249719ec1425704cc2092ced64bf655a238570df65b6bd06b2714426fe589ac2c76cfc0a773ea41c084729f72bc4645711f29608c03162173d04172c7ed7069f470776e80a050a9e2f09c4660ce5432dd21f041e671723ac5cd90676eaf6124";

const hostname = process.env.HOSTNAME || 'usefable.xyz';
// const loginDomain = process.env.TEST_MODE ? "example-getcode.com" : "usefable.xyz";
const loginDomain = "usefable.xyz";

const exampleGetCodePrivate = new Uint8Array([
  83, 255, 243, 143, 25, 147, 129, 161, 100, 93, 242, 14, 163, 113, 169, 47,
  214, 219, 32, 165, 210, 0, 137, 115, 42, 212, 37, 205, 193, 3, 249, 158,
]);

const verifier = Keypair.fromSecretKey(exampleGetCodePrivate)
// const verifier = process.env.TEST_MODE ? Keypair.fromSecretKey(exampleGetCodePrivate) : Keypair.generate();

export class AuthenticationService implements IAuthenticationService {
    constructor(
        private userRepo: IBase,
        private authTokenRepo: IBase,        
        private authService: IAuth,
        private errorService: IErrorService
    ) {}

    public getVerifier = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {

            res.status(200).json({ 
                domain: loginDomain,
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
                    domain: loginDomain,
                },
                mode: "login",
                signers: [ verifier ],
            });
        
            console.log('Created intent', id);
        
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

        if(!JWT_SECRET) throw new Error("Jwt error");

        let authTokenUsed = await this.authTokenRepo.getUnique({
            where: { token: intent },
        });

        // if(authTokenUsed) throw new Error("Login has already occured");

        try {
            // Get the status of the login intent
            const status = await code.getStatus({ intent });
            const user   = await code.getUserId({ intent, verifier });
            
            if (status.status !== "confirmed") throw new Error("Login was not confirmed");

            const userId = user?.userId;
            if (!userId) throw new Error("Unable to login");

            const token = jwt.sign({ userId, intent }, JWT_SECRET, { expiresIn: '5h' });
            if (!token) throw new Error("Login error");
            let auth_user: any;
            auth_user = await this.userRepo.getUnique({
                where: { publicId: userId },
                select: {
                    id: true,
                    name: true,
                    publicId: true,    
                    firstTimeLogin: true,
                    userType: true,
                    imageUrl: true
                },
            });

            if (!auth_user) {
                auth_user = await this.userRepo.create({
                    data: {
                        publicId: userId,   
                        socialMedia: {
                            create: {
                                x: null
                            } // This will create a social media record with all nullable fields set to null
                        },
                        info: {
                            create: {
                                favoriteGenre: null
                            }
                        }                                     
                    },
                    select: {
                        id: true,
                        name: true,
                        publicId: true,
                        firstTimeLogin: true,
                        userType: true,
                        imageUrl: true
                    },
                });
            }

            // await this.authTokenRepo.create({
            //     data: {
            //         userId: auth_user?.id,
            //         token: intent,
            //         isUsed: true
            //     }
            // });

            res.status(200).json({ 
                token,
                user: auth_user,
                status,
                error: false, 
                message: "success" 
            });
        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                        
        }
    }

}