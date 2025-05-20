import { IBase } from "../../repositories/BaseRepository";
import { IAuth } from "../../shared/AuthService";
import { IErrorService } from "../../shared/ErrorService";
import { Response, Request } from "express";
import { Character, CustomRequest, IJwtPayload, Image, Page, Scene, Story, User } from "../../shared/Interface";
import { slugify } from "../../shared/helpers";
import { AssetService } from "../AssetService";
import { v4 as uuidv4 } from 'uuid';

const _ = require('lodash');

export interface IStoryService {
    createGettingStarted(req: CustomRequest, res: Response): Promise<void>;    
    updateGettingStarted(req: CustomRequest, res: Response): Promise<void>;    
    getStories(req: CustomRequest, res: Response): Promise<void>;        
}

export class StoryServiceV2 implements IStoryService {

    constructor(
        private storyRepo: IBase,
        private storyAccessRepo: IBase,
        private userRepo: IBase,
        private pageRepo: IBase,
        private imageRepo: IBase,
        private characterRepo: IBase,
        private sceneRepo: IBase,
        private plotSuggestionRepo: IBase,
        private storyStructureRepo: IBase,     
        private transactionRepo: IBase,    
        private genresOnStoriesRepo: IBase,             
        private storyGenreRepo: IBase,        
        private assetRepo: IBase,        
        private assetTransactionRepo: IBase,        
        private targetAudienceRepo: IBase,        
        private audienceOnStoriesRepo: IBase,  
        private chapterRepo: IBase,              
        private authService: IAuth,        
        private errorService: IErrorService
    ) {}

    public createStory = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const {
            projectTitle,
            projectDescription,
            type,
            currentStep,
            autoDetectStructure,
            storyType,
            storyStructure,
        } = req.body;

        try {
            const user: IJwtPayload = req.user as IJwtPayload;

            let slug;
            if (projectTitle) {
                slug = await this.generateSlug(_.kebabCase(projectTitle));
            }
            console.log({slug});
            

            const newStory = await this.storyRepo.create({
                data: {
                    userId: user?.id,
                    type, // ai, original
                    ...(projectTitle && { projectTitle: projectTitle }),
                    ...(projectDescription && { projectDescription: projectDescription }),
                    // ...(slug && { slug }),
                    slug: slug || null,
                    ...(storyType && { storyType: storyType }), // novel or short-story
                    ...(currentStep && { currentStep: currentStep ?? 1 }),
                    ...(autoDetectStructure && { autoDetectStructure: autoDetectStructure }),
                    ...(storyStructure && { structure: storyStructure }),
                    status: "draft"
                },
            }) as Story;

            res.status(201).json({ data: { newStory }, error: false, message: "success" });
        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);
        }
    };

    public createGettingStarted = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const { 
            projectTitle, projectDescription, selectedTargetAudience, 
            type, selectedGenres, genres, storyType, contentType
        } = req.body;
        
        try {
            const user: IJwtPayload = req.user as IJwtPayload;

            let slug;
            if (projectTitle) {
                slug = await this.generateSlug(_.kebabCase(projectTitle));
            }
            console.log({slug});

            const newStory = await this.storyRepo.create({ 
                data: {
                    userId: user?.id,    
                    ...(projectTitle && { projectTitle: projectTitle }),
                    ...(projectDescription && { projectDescription: projectDescription }),
                    ...(contentType && { contentType: contentType }),                    
                    ...(genres && { genres: genres }),
                    ...(projectTitle && { slug: slug }),
                    ...(type && { type: type }),
                    ...(storyType && { storyType: storyType }),
                    status: "draft",
      
                    currentStep: 2
                }
            }) as Story;

            await this.chapterRepo.create({
                data: { 
                    storyId: newStory?.id,
                    index: 1,
                    isFree: true,    
                    content: "",                                                     
                },
            });

            if (selectedGenres) {                
                await this.addSelectedGenres(selectedGenres, newStory.id)
            }
            if (selectedTargetAudience) {                
                await this.addSelectedTargetAudience(selectedTargetAudience, newStory.id)
            }

            const story: any = await this.storyRepo.get({
                where: {
                    id: newStory.id,
                },
                include: {
                    chapters: true,
                    storyAudiences: true,
                    storyGenres: true
                }
            });

            res.status(201).json({ story, user, error: false, message: "success" });

        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);            
        }
    }
    
    public updateGettingStarted = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const { id } = req.params                                        
        const { projectTitle, projectDescription, selectedTargetAudience, currentStep, selectedTones, type, contentType, selectedGenres, genres } = req.body;
        
        try {
            const user: IJwtPayload = req.user as IJwtPayload;


            let slug;
            if (projectTitle) {
                slug = await this.generateSlug(_.kebabCase(projectTitle));
            }

            const newStory = await this.storyRepo.update({ 
                where: { 
                    id: id,
                    userId: user?.id,   
                },
                data: {
                    ...(projectTitle && { projectTitle: projectTitle }),
                    ...(projectDescription && { projectDescription: projectDescription }),
                    ...(projectDescription && { slug: slug }),
                    ...(selectedTones && { tone: selectedTones }),
                    ...(genres && { genres: genres }),
                    ...(contentType && { contentType: contentType }),                    
                    ...(projectTitle && { slug: _.kebabCase(projectTitle) }),
                    ...(currentStep && { currentStep: currentStep }),                                        
                }
            }) as Story;

            if(selectedGenres) await this.addSelectedGenres(selectedGenres, newStory.id);
            if(selectedTargetAudience) await this.addSelectedTargetAudience(selectedTargetAudience, newStory.id);

            

            res.status(201).json({ newStory, user, error: false, message: "success" });

        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);            
        }
    }

    public updateStory = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const { id } = req.params;
        const { generalChapterFee, applyFeeToAllChapters, projectTitle, projectDescription, currentChapterId, genres, currentStep } = req.body;
        
        try {
            const user: IJwtPayload = req.user as IJwtPayload;


            let applyFeeToAllChaptersData 
            if (applyFeeToAllChapters) {
                applyFeeToAllChaptersData = applyFeeToAllChapters === "true" ? true : false;
            } 

            const newStory = await this.storyRepo.update({ 
                where: { 
                    id: id,
                    userId: user?.id,   
                },
                data: {
                    ...(generalChapterFee && { generalChapterFee: generalChapterFee }),
                    ...(currentChapterId && { currentChapterId: currentChapterId }),                    
                    ...(applyFeeToAllChapters && { applyFeeToAllChapters: applyFeeToAllChaptersData }),
                    ...(projectTitle && { projectTitle: projectTitle }),
                    ...(projectDescription && { projectDescription: projectDescription }),
                    ...(projectTitle && { slug: _.kebabCase(projectTitle) }),
                    ...(genres && { genres: genres }),
                    ...(currentStep && { currentStep: currentStep }),                    
                }
            }) as Story;

     
            res.status(200).json({ data: { newStory, user }, error: false, message: "success" });

        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);            
        }
    }


    public getStory = async (req: CustomRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            
            if (!id) throw new Error("Invalid id");
            const user: IJwtPayload = req.user as IJwtPayload; 

            const authUser = await this.userRepo.getUnique({ where: { id: user?.id } }) as User | null;

            const story: any = await this.storyRepo.get({
                where: {
                    id: id,
                    userId: authUser?.id
                },
                include: {
                    characters: true,
                    plotSuggestions: true,
                    storyStructure: true,
                    user: true,
                    assetTransactions: true,
                    chapters: {
                        include: {
                            scenes: true  // This correctly includes scenes for each chapter
                        }
                    },
                    storyAudiences: true,
                    storyGenres: true
                }
            });
        
            if (!story) throw new Error("Story not found");

            const paidStoryTransaction = await this.transactionRepo.count({
                storyId: id,
                type: "read-story",
                status: "completed"                
            })

            // const response = this.getStoryResponse(story);
            // console.log(response);            
        
            res.status(200).json({ story, paidStoryTransaction, error: false, message: "success" });
        } catch (error) {
            console.log(error);            
            this.errorService.handleErrorResponse(error)(res);
        }
    };

    public getUnauthenticatedStory = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            
            if (!id) throw new Error("Invalid id");

            const story: any = await this.storyRepo.get({
                where: {
                    id: id,
                },
                include: {
                    user: true,
                    chapters: {
                        where: {
                            readersHasAccess: true
                        },
                        include: {
                            scenes: true  // This correctly includes scenes for each chapter
                        }
                    },
                    // storyAudiences: true,
                    storyAudiences: {
                        select: {
                            targetAudience: true
                        }
                    },
                    storyGenres: true,
                    comments: true,
                    _count: {
                        select: {
                            comments: true 
                        }
                    }
                }
            });
        
            if (!story) throw new Error("Story not found");

            const paidStoryTransaction = await this.transactionRepo.count({
                storyId: id,
                type: "read-story",
                status: "completed"                
            })

            // const response = this.getStoryResponse(story);
            // console.log(response);            
        
            res.status(200).json({ story, paidStoryTransaction, error: false, message: "success" });
        } catch (error) {
            console.log(error);            
            this.errorService.handleErrorResponse(error)(res);
        }
    }

    

    public getStories = async (req: CustomRequest, res: Response): Promise<void> => {
        try {     
            const { page = 1, limit, type = 'draft', status } = req.query;

            // const parsedLimit: number = parseInt(String(limit), 10);
            // const parsedPage: number = parseInt(String(page), 10);

            const user: IJwtPayload = req.user as IJwtPayload;
            

            let filterOptions: object = { 
                userId: user.id, 
                // type, 
            };
            
            if (status && status === "draft") {
                // filterOptions = { ...filterOptions, status: "draft" }
                filterOptions = { ...filterOptions, publishedAt: null }
            }
            if (status && status === "original") {
                filterOptions = { ...filterOptions, type: "original"  }
            }
            if (status && status === "ai") {
                filterOptions = { ...filterOptions, type: "ai"  }
            }

            // const totalCount: number = await this.storyRepo.count(filterOptions); // Assuming you have a method to count total challenges
            // const offset = (parsedPage - 1) * parsedLimit;

            const stories = await this.storyRepo.getAll({
                where: {
                    ...filterOptions
                },
                include: {
                    characters: true,
                },
                orderBy: { createdAt: 'desc' },
                // skip: Number(offset),
                // take: Number(limit),
            });

            // const totalPages: number = Math.ceil(totalCount / parsedLimit);
            // const hasNextPage: boolean = parsedPage < totalPages;
            // const hasPrevPage: boolean = parsedPage > 1;

            res.status(200).json({ 
                stories, 
                // totalPages, 
                // hasNextPage, 
                // hasPrevPage, 
                error: false, 
                message: "Stories successfully retrieved" 
            });        


        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                        
        }
    }

    public getStoriesCount = async (req: Request, res: Response): Promise<void> => {
        try {
            const storyCount = await this.storyRepo.count({
                status: "published"                
            })
            res.status(200).json({ storyCount, error: false, message: "success" });
            
        }catch (error) {
            console.log(error);            
            this.errorService.handleErrorResponse(error)(res);
        }
    }




    private addSelectedGenres = async (selectedGenres: number[], storyId: string) => {
        const genreList = selectedGenres;
        console.log(selectedGenres);
        
        await this.genresOnStoriesRepo.deleteMany({
            where: {
                storyId: storyId,
                storyGenreId: {
                    notIn: selectedGenres, // Delete genres not in the incoming genre array
                },
            },
        });

        for (const selectedGenre of selectedGenres) {
            // Check if the genre is already connected to the story to avoid duplicates
            const existingGenreOnStory = await this.genresOnStoriesRepo.get({
                where: {
                    storyId: storyId,
                    storyGenreId: selectedGenre,
                },
            });

            // If not already connected, create the connection
            if (!existingGenreOnStory) {
                await this.genresOnStoriesRepo.create({
                    data: {
                        storyId: storyId,
                        storyGenreId: selectedGenre,
                    },
                });
            }
        }
    }

    private addSelectedTargetAudience = async (selectedTargetAudiences: string[], storyId: string) => {
        console.log(selectedTargetAudiences);

        await this.audienceOnStoriesRepo.deleteMany({
            where: {
                storyId: storyId,
                targetAudienceId: {
                    notIn: selectedTargetAudiences, 
                },
            },
        });

        for (const selectedTargetAudience of selectedTargetAudiences) {
            // Check if the genre is already connected to the story to avoid duplicates
            const existingAudienceOnStory = await this.audienceOnStoriesRepo.get({
                where: {
                    storyId: storyId,
                    targetAudienceId: selectedTargetAudience,
                },
            });

            // If not already connected, create the connection
            if (!existingAudienceOnStory) {
                await this.audienceOnStoriesRepo.create({
                    data: {
                        storyId: storyId,
                        targetAudienceId: selectedTargetAudience,
                    },
                });
            }
        }
    }

    private generateSlug = async (slug: string) => {
        let freshSlug;
        let counter = 1;
        let slugExists: any = await this.storyRepo.get({
            where: {
                slug,
            },
        });

        while (slugExists) {
            const newSlug = `${slug}-${counter}`;
            slugExists = await this.storyRepo.get({
                where: {
                    slug: newSlug,
                },
            });
            if (!slugExists) {
                freshSlug = newSlug;
                break;
            }
            counter++;
        }
        return freshSlug; 
    }

    
}