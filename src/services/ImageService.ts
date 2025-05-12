import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { Response, Request } from "express";
import { CustomRequest, IJwtPayload, User } from "../shared/Interface";

export interface ImageServiceInterface {
  addImage(req: Request, res: Response): Promise<void>; 
}


export class ImageService implements ImageServiceInterface {
    constructor(    
        private imageRepo: IBase,
        private userRepo: IBase,
        private articleRepo: IBase,
        private chapterRepo: IBase,
        private characterRepo: IBase,
        private sceneRepo: IBase,   
        private storyRepo: IBase,                   
        private errorService: IErrorService,
    ) {}

    public addImage = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        try {
            const { ownerId, ownerType, imageUrl, imageStatus, publicId, 
                signature, description, metaData, source,
            } = req.body;

            const user: IJwtPayload = req.user as IJwtPayload;    
            if (!user?.id) throw new Error("User Not Found");

            let owner_id = ownerType === "User" ? user.id : ownerId; 

            const newImage = await this.imageRepo.create({
                data: {
                    origin: "cloudinary",
                    userId: user?.id,
                    ...(owner_id && { ownerId: owner_id }),
                    ...(ownerType && { ownerType: ownerType }), // Story, Article, User
                    ...(imageUrl && { url: imageUrl }),
                    ...(imageUrl && { image: imageUrl }),
                    ...(imageStatus && { imageStatus: imageStatus }),
                    ...(publicId && { publicId: publicId }),
                    ...(signature && { signature: signature }),
                    ...(description && { description: description }), // cover-image, profile-image, banner-image
                    ...(metaData && { meta: metaData }),
                    ...(source && { source: source }), // generated or uploaded
                }
            });

            
            if (ownerType === "Story") {
                await this.saveStoryImage(ownerId, description, imageUrl) 
            }
            
            if (ownerType === "Chapter") {
                await this.saveChapterImage(ownerId, description, imageUrl) 
            }

            if (ownerType === "Article") {
                await this.saveArticleImage(user, ownerId, imageUrl) 
            }
            
            if (ownerType === "User") {
                await this.saveUserImage(user, description, imageUrl);
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

    public saveUserImage = async (user: IJwtPayload, description: string, imageUrl: string) => {
        const profileImage = description === 'profile-image' ? imageUrl : null;
        const banner = description === 'banner-image' ? imageUrl : null;

        return await this.userRepo.update({
            where: {
                id: user?.id  
            },
            data: {
                imageUrl,
                ...(profileImage && { imageUrl: profileImage  }),
                ...(banner && { backgroundImage: banner }),
            }
        });
        
    }

    public saveArticleImage = async (user: IJwtPayload, ownerId: string, imageUrl:string) => {
        return await this.articleRepo.update({
            where: {
                id: ownerId,
                userId: user?.id,   
            },
            data: {
                coverImage: imageUrl
            }
        });
    }

    public saveChapterImage = async (ownerId: string, description: string, imageUrl: string ) => {
        const coverImage = description === 'cover-image' ? imageUrl : null;
        const banner = description === 'banner-image' ? imageUrl : null;
        
        return await this.chapterRepo.update({
            where: {
                id: ownerId,
            },
            data: {
                ...(coverImage && { coverImage: coverImage  }),
                ...(banner && { image: banner }),
            }
        });
    }


    public saveStoryImage = async (ownerId: string, description: string, imageUrl: string ) => {
        const coverImageUrl = description === 'cover-image' ? imageUrl : null;
        const bannerImageUrl = description === 'banner-image' ? imageUrl : null;
        
        return await this.storyRepo.update({
            where: {
                id: ownerId,
            },
            data: {
                ...(coverImageUrl && { coverImageUrl: coverImageUrl  }),
                ...(bannerImageUrl && { bannerImageUrl: bannerImageUrl }),
            }
        });
    }

}