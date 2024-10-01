import { where } from "ramda";
import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { CustomRequest, IJwtPayload, Story } from "../shared/Interface";
import { Response, Request } from "express";
import { User } from "../shared/Interface";

export interface IStoryAccessService {
    readStory(req: CustomRequest, res: Response): Promise<void>; 
}

export class StoryAccessService implements IStoryAccessService {

    constructor(
        private storyAccessRepo: IBase,
        private userRepo: IBase,
        private storyRepo: IBase,
        private storyStructureRepo: IBase,
        private transactionRepo: IBase,
        private authService: IAuth,
        private errorService: IErrorService
    ) {}

    public readStory = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {

        try {            
            const { id } = req.params;
            if (!id) throw new Error("Invalid id");
            const user: IJwtPayload = req.user as IJwtPayload; 
            
            const story: any = await this.storyRepo.get({
                where: {
                    id
                }
            });
            if (!story) throw new Error("Story not found");
    
            const email = user?.email;
            const reader = await this.userRepo.getUnique({ where: { email } }) as User | null;
            if (!reader) throw new Error("Unidentified User");

            const accessRecord: any = await this.storyAccessRepo.getUnique({
                where: {
                    userId_storyId: {
                        userId: reader?.id,
                        storyId: story?.id
                    }
                }
            });

            const transaction: any = await this.transactionRepo.get({
                where: { 
                    userId: reader?.id,
                    storyId: story?.id,
                    type: "read-story"
                },
            });        
            
            if (!accessRecord) {
                console.log("--1--");
                
                const storyAccess = await this.storyAccessRepo.create({ 
                    data: {
                        userId: reader?.id,
                        storyId: story?.id,
                        currentChapter: "1",
                        hasAccess: false
                    }
                });

                if (!storyAccess) {
                    res.status(400).json({ 
                        storyAccess,                        
                        error: false, 
                        message: "Unable to create story access record" 
                    });
                }

                let response = await this.getUnpaidStoryVersion(story?.id);

                res.status(200).json({ 
                    accessRecord: storyAccess,
                    story: response, 
                    error: false, 
                    message: "success" 
                });
                return;

            }else{

                if (accessRecord?.hasAccess === false) {

                    let response = await this.getUnpaidStoryVersion(story?.id);
                    res.status(200).json({ 
                        accessRecord,
                        story: response, 
                        error: false, 
                        message: "success" 
                    });
                    return;
                }
                if (accessRecord?.hasAccess === true) {
                console.log("--4--");
                    let response = await this.getPaidStoryVersion(story?.id);
                    res.status(200).json({ 
                        accessRecord,
                        story: response, 
                        error: false, 
                        message: "success" 
                    });
                }
            } 

                  
        } catch (error) {
            console.error(error);       
            this.errorService.handleErrorResponse(error)(res);            
        }
    }

    public moveStoryChapter = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const { currentChapter } = req.body;
            if (!id) throw new Error("Invalid id");
            const user: IJwtPayload = req.user as IJwtPayload; 
            const email = user?.email;
            const reader = await this.userRepo.getUnique({ where: { email } }) as User | null;
            
            const story: any = await this.storyRepo.get({
                where: {
                    id
                }
            });
            if (!story) throw new Error("Story not found");

            const accessRecord: any = await this.storyAccessRepo.getUnique({
                where: {
                    userId_storyId: {
                        userId: reader?.id,
                        storyId: story?.id
                    }
                }
            });
            if (!accessRecord) throw new Error("No Access Record");


            const updateStory: any = await this.storyAccessRepo.update({
                where: { 
                    id: accessRecord?.id,  
                },
                data: {
                    currentChapter: currentChapter
                }
            });
            res.status(200).json({ 
                accessRecord,
                error: false, 
                message: "success" 
            });

        } catch (error) {
            console.error(error);       
            this.errorService.handleErrorResponse(error)(res);  
        }
    }

    

    private getUnpaidStoryVersion = async (storyId: string) => {
        const story: any = await this.storyRepo.get({
            where: {
                id: storyId
            },
            select: {
                id: true,
                userId: true,
                projectTitle: true,
                projectDescription: true,
                genres: true,
                publishedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                storyStructure: {
                    select: { 
                        id: true, 
                        introduceProtagonistAndOrdinaryWorld: true,
                        incitingIncident: true
                    },
                },
            }
        });
        return story;
    }

    private getPaidStoryVersion = async (storyId: string) => {
        const story: any = await this.storyRepo.get({
            where: {
                id: storyId
            },
            select: {
                id: true,
                userId: true,
                projectTitle: true,
                projectDescription: true,
                genres: true,
                publishedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                storyStructure: {
                    select: { 
                        id: true, 
                        introduceProtagonistAndOrdinaryWorld: true, 
                        incitingIncident: true,            
                        firstPlotPoint: true,  
                        risingActionAndMidpoint: true, 
                        pinchPointsAndSecondPlotPoint: true, 
                        climaxAndFallingAction: true,  
                        resolution: true,  
                    },
                },
            }
        });
        return story;
    }

    
}