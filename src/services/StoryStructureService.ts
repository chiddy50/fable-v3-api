import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { CustomRequest, IJwtPayload } from "../shared/Interface";
import { Response, Request } from "express";

export interface IStoryStructureService {
    editStoryStructure(req: Request, res: Response): Promise<void>; 
}

export class StoryStructureService implements IStoryStructureService {

    constructor(
        private storyRepo: IBase,
        private storyStructureRepo: IBase,
        private authService: IAuth,
        private errorService: IErrorService
    ) {}

    public editStoryStructure = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const { id } = req.params;

        const {
            introductionTone,
            introductionToneSuggestions,
            introductionGenreSuggestions,
            genre,
            introductionSettingSuggestions,
            introductionSetting,
            protagonistSuggestions,
            protagonists,
            suggestedCharacters,

            introduceProtagonistAndOrdinaryWorld, 
            incitingIncident,            
            firstPlotPoint,  
            risingActionAndMidpoint, 
            pinchPointsAndSecondPlotPoint, 
            climaxAndFallingAction,  
            resolution,  
        } = req.body;
        try {
            const user: IJwtPayload = req.user as IJwtPayload;    
            if (!user?.id) throw new Error("User Not Found");

            const story: any = await this.storyRepo.get({
                where: {
                    id: id,
                    userId: user?.id,   
                }
            });
            
            if (!story) throw new Error("Story Not Found");

            const storyStructure: any = await this.storyStructureRepo.update({
                where: { storyId: id },
                data: {
                    ...(introduceProtagonistAndOrdinaryWorld && { introduceProtagonistAndOrdinaryWorld }),
                    ...(incitingIncident && { incitingIncident }),
                    ...(firstPlotPoint && { firstPlotPoint }),
                    ...(risingActionAndMidpoint && { risingActionAndMidpoint }),
                    ...(pinchPointsAndSecondPlotPoint && { pinchPointsAndSecondPlotPoint }),
                    ...(climaxAndFallingAction && { climaxAndFallingAction }),
                    ...(resolution && { resolution }),

                    ...(introductionToneSuggestions && {
                        introductionToneSuggestions: introductionToneSuggestions
                    }),
                    ...(introductionTone && {
                        introductionTone: introductionTone
                    }),
                    

                }
            });

            console.log({introduceProtagonistAndOrdinaryWorld});
            

            res.status(200).json({ 
                data: { 
                    storyStructure: storyStructure 
                }, 
                error: false, 
                message: "success" 
            });
        } catch (error) {
            console.log(error);            
            this.errorService.handleErrorResponse(error)(res);            
        }
    }

    
}