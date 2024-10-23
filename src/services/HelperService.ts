import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { Response, Request } from "express";

export interface IHelperService {
  getGenres(req: Request, res: Response): Promise<void>; 
}


export class HelperService implements IHelperService {
    constructor(        
        private userRepo: IBase,
        private storyRepo: IBase,
        private storyAccessRepo: IBase,        
        private characterRepo: IBase,
        private storyStructureRepo: IBase,
        private genresOnStoriesRepo: IBase,
        private storyGenreRepo: IBase,
        private errorService: IErrorService,
    ) {}

    public getGenres = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const genres = await this.storyGenreRepo.getAll();

            res.status(200).json({ 
                genres,
                error: false, 
                message: "success" 
            });
        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                        
        }
    }

    public createUser = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const { 
            name, publicId, depositAddress, tipLink
        } = req.body;

        const user_exists = await this.userRepo.getUnique({ publicId });
        if(user_exists) throw new Error("User exists already");
    
        try {
            const user = await this.userRepo.create({
                data: {
                    name,
                    publicId, 
                    depositAddress, 
                    tipLink           
                },
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

    public deleteUser = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const { 
                userId, 
            } = req.body;
            const user = await this.userRepo.delete({
                where: { id: userId }
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

    public getUsers = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const users = await this.userRepo.getAll();

            res.status(200).json({ 
                users,
                error: false, 
                message: "success" 
            });

        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                                    
        }
    }

    public updateStoryData = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const { 
            name, publicId, depositAddress, storyId, userId, imageUrl, 
            introduceProtagonistAndOrdinaryWorld,
            incitingIncident,
            risingActionAndMidpoint,
            firstPlotPoint,
            pinchPointsAndSecondPlotPoint,
            climaxAndFallingAction,
            resolution,
        } = req.body;
    
        try {
            const story = await this.storyRepo.update({
                where: {
                    id: storyId,
                },
                data: {
                    ...(userId && { userId: userId } ),
                    ...(imageUrl && { imageUrl: imageUrl } ),
                    ...(imageUrl && { introductionImage: imageUrl } ),                        
                },
            });

            const storyStructure = await this.storyStructureRepo.update({
                where: { storyId: storyId },
                data: {
                    ...(introduceProtagonistAndOrdinaryWorld && { introduceProtagonistAndOrdinaryWorld: introduceProtagonistAndOrdinaryWorld }),
                    ...(incitingIncident && { incitingIncident: incitingIncident }),
                    ...(firstPlotPoint && { firstPlotPoint: firstPlotPoint } ),
                    ...(risingActionAndMidpoint && { risingActionAndMidpoint: risingActionAndMidpoint } ),
                    ...(pinchPointsAndSecondPlotPoint && { pinchPointsAndSecondPlotPoint: pinchPointsAndSecondPlotPoint } ),
                    ...(climaxAndFallingAction && { climaxAndFallingAction: climaxAndFallingAction } ),
                    ...(resolution && { resolution: resolution } ),                       
                },
            });

            // const storyAccess = await this.storyAccessRepo.update({
            //     where: {
            //         id: storyId,
            //     },
            //     data: {
            //         ...(userId && { userId: userId } )                        
            //     },
            // });

            

            res.status(200).json({ 
                story,
                storyStructure,
                error: false, 
                message: "success" 
            });
          
        } catch (error) {
          this.errorService.handleErrorResponse(error)(res);            
        }
    }

}