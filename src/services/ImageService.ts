import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { Response, Request } from "express";
import { CustomRequest, IJwtPayload } from "../shared/Interface";

export interface ImageServiceInterface {
  addImage(req: Request, res: Response): Promise<void>; 
}


export class ImageService implements ImageServiceInterface {
    constructor(    
        private imageRepo: IBase,
        private userRepo: IBase,
        private articleRepo: IBase,
        private errorService: IErrorService,
    ) {}

    public addImage = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        try {
            const { ownerId, ownerType, imageUrl, imageStatus, publicId, signature, description, meta, source } = req.body;
            // imageStatus                   String?
            // imageId                       String?
            const user: IJwtPayload = req.user as IJwtPayload;    
            if (!user?.id) throw new Error("User Not Found");

            const newImage = await this.imageRepo.create({
                data: {
                    origin: "cloudinary",
                    userId: user?.id,
                    ...(ownerId && { ownerId: ownerId }),
                    ...(ownerType && { ownerType: ownerType }), // Story, Article
                    ...(imageUrl && { url: imageUrl }),
                    ...(imageUrl && { image: imageUrl }),
                    ...(imageStatus && { imageStatus: imageStatus }),
                    ...(publicId && { publicId: publicId }),
                    ...(signature && { signature: signature }),
                    ...(description && { description: description }), // cover-image
                    ...(meta && { meta: meta }),
                    ...(source && { source: source }), // generated or uploaded
                }
            });

            if (ownerType === "Article") {
                const article: any = await this.articleRepo.update({
                    where: {
                        id: ownerId,
                        userId: user?.id,   
                    },
                    data: {
                        coverImage: imageUrl
                    }
                });
            }
            

            res.status(201).json({ 
                image: newImage,
                error: false, 
                message: "success" 
            });
        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                        
        }
    }

}