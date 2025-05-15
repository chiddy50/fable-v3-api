import { IBase } from "../../repositories/BaseRepository";
import { IAuth } from "../../shared/AuthService";
import { IErrorService } from "../../shared/ErrorService";
import { Response, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as jose from "jose"
import { PrivyClient } from "@privy-io/server-auth"
import { CustomRequest, IJwtPayload } from "../../shared/Interface";


export interface IAuthenticationService {
    login(req: Request, res: Response): Promise<void>; 
}


export class AuthenticationService implements IAuthenticationService {
    constructor(
        private userRepo: IBase,
        private authTokenRepo: IBase,        
        private authService: IAuth,
        private errorService: IErrorService
    ) {}
  
    public login = async (
        req: Request,
        res: Response
    ): Promise<void> => {

        const { privyId, name, email } = req.body;
        try {

            const verifiedUser = await this.validateUser(req);
            
            if (!verifiedUser) res.status(401).json({ message: 'Token verification error' });

            let auth_user: any = null;  
            auth_user = await this.userRepo.getUnique({
                where: { publicId: verifiedUser?.userId, email },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    publicId: true,
                    imageUrl: true,
                    depositAddress: true,
                    tipLink: true,
                },
            });

            if (!auth_user) {
                auth_user = await this.createUser(privyId, name, email);                
            }

            res.status(200).json({ 
                user: auth_user,
                error: false, 
                message: "success" 
            });
        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                        
        }
    }

    public register = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const { privyId, name, email } = req.body;
        try {
            const verifiedUser: any = await this.validateUser(req);
         
            if (!verifiedUser) res.status(401).json({ message: 'Token verification error' });

            let auth_user = await this.createUser(privyId, name, email);

            res.status(201).json({ 
                user: auth_user,
                error: false, 
                message: "success" 
            });
        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                        
        }
    }

    private validateUser = async (req: CustomRequest) => {
        let authorizationHeader = req.headers["authorization"];
        if (!authorizationHeader) throw new Error("Unauthorized");

        const token: string | null = authorizationHeader.split(' ')[1];
        if (!token || token === 'undefined' || token === undefined) throw new Error("No token found");

 
        const privy_id: string = process.env.PRIVY_APP_ID ?? "cmalij5sn01y9le0m7quxehsa"
        const privy_secret: string = process.env.PRIVY_APP_SECRET ?? "5PFhCxnrM4uEeSStXo1u27zvmkTMak63qjrNWDRN7z5pudbskuszRBJcwa9wy5gd6UyTHvkrsM4HKKkte8RvafUu"
        const privy = new PrivyClient(privy_id!, privy_secret!);

        const verifiedUser = await privy.verifyAuthToken(token);
        return verifiedUser;
    }

    private createUser = async (privyId: string, name: string, email: string) => {
        let auth_user = await this.userRepo.create({
            data: {
                publicId: privyId,   
                name: name,   
                email: email,   
                userType: "reader",
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

        return auth_user;
    }

}