import { Response, NextFunction } from "express";
import { IAuth } from "./AuthService";
import { CustomRequest, IJwtPayload } from "./Interface";
import { IErrorService } from "./ErrorService";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IBase } from "../repositories/BaseRepository";
import { PrivyClient } from "@privy-io/server-auth"

export interface IMiddlewareService {
	verifyToken(
		req: CustomRequest,
		res: Response,
		next: NextFunction
	): Promise<void>;
}

const JWT_SECRET = process.env.JWT_SECRET ?? "d8186f2284334f71dcf3acc3b4218784e77df56c9e1ef7332c16590511dd72caf135dc21531c0287a789878b76b422d4f71b1d9032a1f47015fad73119ae40ab28b836bb4ee5723bf2f86f6898970c9766cab0f06c54209b0a43a6973dfbadf70d0c3dcf6cbd7bc242431433e492f1179885d684de0a0f17b1ae741ea38e077b4575ade965cc0331bdc40025c6600a46e3767baf5aff91cf7b41bce725dbeb340249719ec1425704cc2092ced64bf655a238570df65b6bd06b2714426fe589ac2c76cfc0a773ea41c084729f72bc4645711f29608c03162173d04172c7ed7069f470776e80a050a9e2f09c4660ce5432dd21f041e671723ac5cd90676eaf6124";

export class MiddlewareService implements IMiddlewareService {
	constructor(
		private authService: IAuth,
		private errorService: IErrorService,
		private userRepo: IBase,
	) { }

	public verifyToken2 = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			let authorizationHeader = req.headers["authorization"];
			if (!authorizationHeader) {
				throw new Error("Unauthorized");
			}

			const token: string | null = authorizationHeader.split(' ')[1];
			if (!token || token === 'undefined' || token === undefined) {
				throw new Error("No token found");
			}

			jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }, async (err: any, decodedToken: JwtPayload | string | undefined) => {
				if (err) console.log({ err });
				if (err || decodedToken === undefined) return res.status(401).json({ message: 'Invalid token' });
				if (err) return res.status(401).json({ message: 'Token verification error' });
				if (!decodedToken) return res.status(401).json({ message: 'Could not decode token' });

				const userId = (decodedToken as JwtPayload).userId;

				let auth_user: any = null;

				auth_user = await this.userRepo.getUnique({
					where: { publicId: userId },
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

				if (!auth_user) return res.status(404).json({ message: 'Unidentified User' });

				req.user = auth_user;
				next();
			});

		} catch (error: any) {
			this.errorService.handleErrorResponse(error.message)(res);
		}
	};


	public verifyToken = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		
		try {
			let authorizationHeader = req.headers["authorization"];
			// const cookieAuthToken = req.cookies["privy-token"];
			if (!authorizationHeader) {
				throw new Error("Unauthorized");
			}

			const token: string | null = authorizationHeader.split(' ')[1];
			if (!token || token === 'undefined' || token === undefined) {
				throw new Error("No token found");
			}

			const privy = new PrivyClient(process.env.PRIVY_APP_ID!, process.env.PRIVY_APP_SECRET!);

			const verifiedUser = await privy.verifyAuthToken(token);
			
			if (!verifiedUser) res.status(401).json({ message: 'Token verification error' });

			console.log({verifiedUser});
			console.log(req.path);
			
			let auth_user: any;

			auth_user = await this.userRepo.getUnique({
				where: { publicId: verifiedUser?.userId },
				select: {
					id: true,
					name: true,
					publicId: true,    
					firstTimeLogin: true,
					userType: true,
					imageUrl: true
				},
			});			

			if (!auth_user) res.status(404).json({ message: 'Unidentified User' });

			req.user = auth_user;
			next();

		} catch (error: any) {
			this.errorService.handleErrorResponse(error.message)(res);			
		}
	}

}
