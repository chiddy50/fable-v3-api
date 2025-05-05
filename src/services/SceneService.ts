import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { Response, Request } from "express";
import { CustomRequest, IJwtPayload } from "../shared/Interface";

const _ = require('lodash');

export interface ISceneService {
    updateScene(req: Request, res: Response): Promise<void>;
}

export class SceneService implements ISceneService {
    constructor(
        private sceneRepo: IBase,
        private chapterRepo: IBase,
        private storyRepo: IBase,
        private characterRepo: IBase,
        private storyStructureRepo: IBase,        
        private authService: IAuth,
        private errorService: IErrorService
    ) {}

     public updateScene = async (
            req: CustomRequest,
            res: Response
        ): Promise<void> => {
            const { id } = req.params;

            const { imageStatus, videoStatus, imageRequestId, videoRequestId, metaData, imageUrl, videoUrl, resetVideo, resetImage } = req.body;

            try {
                const sceneUpdated = await this.sceneRepo.update({
                    where: { id },
                    data: {
                        ...(imageStatus && { imageStatus: imageStatus }),
                        ...(imageRequestId && { imageId: imageRequestId }),
                        ...(metaData && { meta: metaData }), 
                        ...(imageUrl && { imageUrl: imageUrl }),             
                        ...(videoUrl && { videoUrl: videoUrl }),                                                                        
                        ...(videoStatus && { videoStatus: videoStatus }),                                                
                        ...(videoRequestId && { videoId: videoRequestId }),  
                        ...(resetVideo && { videoStatus: null }),                                                                                                                      
                        ...(resetVideo && { videoId: null }), 
                        ...(resetImage && { imageStatus: null }),                                                                                                                      
                        ...(resetImage && { imageId: null }),                                                                                                                      
                    }
                });

                res.status(200).json({ 
                    scene: sceneUpdated,
                    error: false, 
                    message: "success" 
                });

            } catch (error) {
                console.log(error);            
                this.errorService.handleErrorResponse(error)(res);
            }
        }
}