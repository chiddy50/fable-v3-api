import { IBase } from "../../repositories/BaseRepository";
import { IAuth } from "../../shared/AuthService";
import { IErrorService } from "../../shared/ErrorService";
import { SynopsisInterface } from "../../interfaces/SynopsisInterface";
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
        private synopsisRepo: IBase,              
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
                    ...(autoDetectStructure && { autoDetectStructure: autoDetectStructure === "true" ? true : false }),
                    ...(storyStructure && { structure: storyStructure }),
                    status: "draft",
                    synopsisList: []
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
        const { projectTitle, projectDescription, selectedTargetAudience, currentStep, selectedTones, currentStepUrl, 
            type, contentType, selectedGenres, genres } = req.body;
        
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
                    ...(currentStepUrl && { currentStepUrl: currentStepUrl }),                                        
                }
            }) as Story;

            if(selectedGenres) await this.addSelectedGenres(selectedGenres, newStory.id);
            if(selectedTargetAudience) await this.addSelectedTargetAudience(selectedTargetAudience, newStory.id);

            res.status(200).json({ newStory, user, error: false, message: "success" });

        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);            
        }
    }

    public updateStory = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const { id } = req.params;
        const { generalChapterFee, applyFeeToAllChapters, projectTitle, projectDescription, selectedTones,
            currentChapterId, genres, currentStep, storyStructureReason, structure, synopsis, synopsisList, refinedProjectDescription,
            narrativeConceptSuggestions, narrativeConcept, currentStepUrl, selectedTargetAudience, selectedGenres, contentType 
        } = req.body;
        
        try {
            const user: IJwtPayload = req.user as IJwtPayload;


            let applyFeeToAllChaptersData 
            if (applyFeeToAllChapters) {
                applyFeeToAllChaptersData = applyFeeToAllChapters === "true" ? true : false;
            } 

      

            const updatedStory = await this.storyRepo.update({ 
                where: { 
                    id: id,
                    userId: user?.id,   
                },
                data: {
                    ...(generalChapterFee && { generalChapterFee: generalChapterFee }),
                    ...(storyStructureReason && { storyStructureReason: storyStructureReason }),
                    ...(structure && { structure: structure }),
                    ...(synopsis && { synopsis: synopsis?.content }),
                    // ...(synopsis && { synopsisList: synopsisListArray }),
                    // ...(synopsisList && { synopsisList: synopsisList }),
                    ...(currentChapterId && { currentChapterId: currentChapterId }),                    
                    ...(applyFeeToAllChapters && { applyFeeToAllChapters: applyFeeToAllChaptersData }),
                    ...(projectTitle && { projectTitle: projectTitle }),
                    ...(projectDescription && { projectDescription: projectDescription }),
                    ...(contentType && { contentType: contentType }),                    
                    ...(projectTitle && { slug: _.kebabCase(projectTitle) }),
                    ...(genres && { genres: genres }),
                    ...(currentStep && { currentStep: currentStep }),       
                    ...(selectedTones && { tone: selectedTones }),                                       
                    ...(currentStepUrl && { currentStepUrl: currentStepUrl }),   
                    ...(refinedProjectDescription && { refinedProjectDescription: refinedProjectDescription }),                       
                    ...(narrativeConceptSuggestions && { narrativeConceptSuggestions: narrativeConceptSuggestions }),   
                    ...(narrativeConcept && { narrativeConcept: narrativeConcept }),   
                },
            }) as Story;

            if(selectedTargetAudience) await this.addSelectedTargetAudience(selectedTargetAudience, updatedStory.id);
            if(selectedGenres) await this.addSelectedGenres(selectedGenres, updatedStory.id);
            

            const story = await this.fetchStoryById(id);

            if (synopsis) {
                // let synopsisListArray: SynopsisInterface[] = [];
                // const existingStory = await this.fetchStoryById(id);

                let payload = { ...synopsis, narrativeConcept } // Deactivate all existing synopses and add new one

                const result = await this.synopsisRepo.transaction(async (tx: any) => {
                  
                    await this.deactivateSynopses(story);
                    let created = await this.createSynopsis(payload, story);
                    
                    return created;
                });
                console.log(result);
                


                // const existingSynopses = existingStory?.synopsisList || [];
                
                // // Deactivate all existing synopses and add new one
                // synopsisListArray = [
                //     ...existingSynopses.map((item: SynopsisInterface, index: number) => ({
                //         ...item,
                //         active: false,
                //         index: index + 1,                     
                //     })),
                //     { 
                //         ...synopsis, 
                //         index: existingSynopses.length + 1,  
                //         genres: existingStory.storyGenres,
                //         tone: existingStory.tone,
                //         storyAudiences: existingStory?.storyAudiences,
                //         contentType: existingStory?.contentType,
                //         narrativeConcept
                //     }
                // ];
            }
            

            res.status(200).json({ 
                story: await this.fetchStoryById(id), 
                user, 
                error: false, 
                message: "success" 
            });

        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);            
        }
    }

    public updateSynopsisList = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        try {
            const { id } = req.params                                        
            const { synopsis } = req.body;

            const user: IJwtPayload = req.user as IJwtPayload;

            const existingStory = await this.fetchStoryById(id);
            const existingSynopses = existingStory?.synopsisList;

            let synopsisListArray: SynopsisInterface[] = existingSynopses.map((item: SynopsisInterface) => {
                if (item.id === synopsis.id) {
                    return {...item, active: true}
                }

                return {...item, active: false}
            });
            
            await this.storyRepo.update({ 
                where: { 
                    id: id,
                    userId: user?.id,   
                },
                data: {
                    ...(synopsis?.content && { synopsis: synopsis?.content }),
                    ...(synopsisListArray && { synopsisList: synopsisListArray }),
                    ...(synopsis?.tone && { tone: synopsis?.tone }),
                    ...(synopsis?.contentType && { contentType: synopsis?.contentType }),                    
                    ...(synopsis?.narrativeConcept && { narrativeConcept: synopsis?.narrativeConcept }),          
                    // ...(projectDescription && { projectDescription: projectDescription }),
                },
            }) as Story;

            let genreIds = synopsis?.genres?.map((item: any) => item?.storyGenre?.id);
            let storyAudienceIds = synopsis?.storyAudiences?.map((item: any) => item?.targetAudience?.id);

            if(storyAudienceIds) await this.addSelectedTargetAudience(storyAudienceIds, id);
            if(genreIds) await this.addSelectedGenres(genreIds, id);

            const story = await this.fetchStoryById(id);

            res.status(200).json({ story, error: false, message: "success" });

        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                        
        }
    }

    public updateSynopsisCharacter = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        try {
            const { id } = req.params                                        
            const { synopsisId, characterId, name, alias, age, 
                role, gender, backstory, race, strengths, weaknesses, 
                internalConflict, externalConflict, voice, perspective, 
                relationshipToOtherCharacters, relationshipToProtagonists  
            } = req.body;

            const user: IJwtPayload = req.user as IJwtPayload;

            const existingStory = await this.fetchStoryById(id);
            if (!existingStory) throw new Error("Story not found");

            const existingSynopses = existingStory?.synopsisList; // GET ALL SYNOPSIS IN A STORY
            const synopsis = existingSynopses.find((item: any) => item.id === synopsisId ); // FIND THE SPECIFIC SYNOPSIS
            if (!synopsis) throw new Error("Synopsis not found");

            const character = synopsis?.characters.find((item: any) => item.id === characterId ); // FIND THE SPECIFIC CHARACTER
            if (!character) throw new Error("Character not found");

            let updatedCharacter = {
                id: characterId,
                name: name ?? character.name,
                alias: alias ?? character.alias,
                age: age ?? character.age,
                role: role ?? character.role,
                gender: gender ?? character.gender,
                backstory: backstory ?? character.backstory,
                race: race ?? character.race,
                strengths: strengths ?? character.strengths,
                weaknesses: weaknesses ?? character.weaknesses,
                internalConflict: internalConflict ?? character.internalConflict,
                externalConflict: externalConflict ?? character.externalConflict,
                voice: voice ?? character.voice,
                perspective: perspective ?? character.perspective,
                relationshipToOtherCharacters: relationshipToOtherCharacters ?? character.relationshipToOtherCharacters,
                relationshipToProtagonists: relationshipToProtagonists ?? character.relationshipToProtagonists,
            }

            // GET THE CHARACTER TO BE UPDATED BY ID AND SET THE NEW DATA
            let newSynopsisCharacterUpdate = synopsis?.characters.map((item: any) => {
                if (item.id === characterId) {
                    return updatedCharacter;
                }
                return item;
            });

            synopsis.characters = newSynopsisCharacterUpdate; // RESET ALL CHARACTERS IN THE SYNOPSIS

            // UPDATE THE SYNOPSIS AND RESET THE SYNOPSIS LIST
            let newSynopsisListUpdate = existingStory?.synopsisList.map?.((item: any) => {
                if (item.id === synopsisId) {
                    return synopsis;
                }
                return item;
            });            

            // UPDATE STORY'S SYNOPSIS
            await this.storyRepo.update({ 
                where: { 
                    id: id,
                    userId: user?.id,   
                },
                data: {
                    ...(newSynopsisListUpdate && { synopsisList: newSynopsisListUpdate }),
                },
            }) as Story;

            res.status(200).json({ newSynopsisListUpdate, synopsis, error: false, message: "success" });

        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                                    
        }
    }

    public updateSynopsisCharacterSuggestions = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const { id } = req.params                                        
        const { synopsisId, characterSuggestions } = req.body;
        try {
            const user: IJwtPayload = req.user as IJwtPayload;
            
            const existingStory = await this.fetchStoryById(id);

            if (!existingStory) throw new Error("Story not found");


            let synopsisCharacterSuggestionsExists = existingStory?.characterSuggestions && existingStory?.characterSuggestions?.length > 0 ? true : false;

            const synopsisCharacterSuggestions = synopsisCharacterSuggestionsExists ? existingStory?.characterSuggestions : [];
            
            
            synopsisCharacterSuggestions.push(characterSuggestions);

            await this.storyRepo.update({ 
                where: { 
                    id: id,
                    userId: user?.id,   
                },
                data: {
                    ...(characterSuggestions && { characterSuggestions: characterSuggestions }),
                },
            }) as Story;

            res.status(200).json({ existingStory, error: false, message: "success" });

        } catch (error) {
            console.error(error);            
            this.errorService.handleErrorResponse(error)(res);                        
        }
    }

    public getStory = async (req: CustomRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            
            if (!id) throw new Error("Invalid id");
            const user: IJwtPayload = req.user as IJwtPayload; 

            // const authUser = await this.userRepo.getUnique({ where: { id: user?.id } }) as User | null;

            const story: any = await this.storyRepo.get({
                where: {
                    id: id,
                    userId: user?.id
                },
                include: {
                    characters: true,
                    user: true,
                    synopses: {
                        include: {
                            characters: true,  // This correctly includes scenes for each chapter
                            synopsisCharacters: true  
                        }
                    },
                    assetTransactions: true,
                    chapters: {
                        include: {
                            scenes: true  // This correctly includes scenes for each chapter
                        }
                    },
                    storyAudiences: {
                        select: {
                            targetAudience: true
                        }
                    },
                    storyGenres: {
                        select: {
                            storyGenre: true
                        }
                    },
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

    public updateAllSynopsis = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {

        const { id } = req.params;
        const { synopses } = req.body;
                
        try {
            synopses?.forEach(async (synopsis: any) => {
                await this.synopsisRepo.update({ 
                    where: { 
                        id: synopsis.id, 
                        storyId: id
                    },
                    data: {
                        ...(synopsis?.content && { content: synopsis?.content }),
                    },
                }) 
            });
            
            const story = await this.fetchStoryById(id);

            res.status(200).json({ 
                story,
                error: false, 
                message: "success" 
            });
        } catch (error) {
            console.error(error);
            this.errorService.handleErrorResponse(error)(res);                 
        }
    }




    private addSelectedGenres = async (selectedGenres: number[], storyId: string) => {
        const genreList = selectedGenres;
        
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

    private fetchStoryById = async (storyId: string) => {
        try {
            const story: any = await this.storyRepo.get({
                where: {
                    id: storyId,
                },
                include: {
                    characters: true,
                    user: true,
                    assetTransactions: true,
                    synopses: {
                        include: {
                            characters: true,
                            synopsisCharacters: true  
                        }
                    },
                    chapters: {
                        include: {
                            scenes: true
                        }
                    },
                    storyAudiences: {
                        select: {
                            targetAudience: true
                        }
                    },
                    storyGenres: {
                        select: {
                            storyGenre: true
                        }
                    },
                }
            });
            return story;
        } catch (error) {
            return false;   
        }
    }

    private deactivateSynopses = async (story: any) => {
        return await this.synopsisRepo.updateMany({ 
            where: { 
                storyId: story?.id,   
            },
            data: {
                active: true
            },
        });
    }

    private createSynopsis = async (payload: any, story: any) => {
        let storySynopsisCount = await this.synopsisRepo.count({
            storyId: story.id
        });

        let nextSynopsisIndex = storySynopsisCount + 1;
        let synopsis = await this.synopsisRepo.create({
            data: {
                index: nextSynopsisIndex,
                storyId: story?.id,
                narrativeConcept: payload.narrativeConcept,
                content: payload.content,
                active: payload.active,
                publicId: payload.id,

                genres: story?.storyGenres,
                storyAudiences: story?.storyAudiences,
                tone: story?.tone,
                contentType: story?.contentType,
                title: story.title,
                storyStructure: story.structure,
                reason: story.storyStructureReason,
                projectDescription: story.refinedProjectDescription,
            }
        });

        // create synopsis characters
        await this.createSynopsisCharacters(payload.characters, story, synopsis);
    }

    private createSynopsisCharacters = async (characters: any, story: any, synopsis: any) => {

        characters.forEach(async (character: any) => {

            await this.characterRepo.create({
                data:{
                    storyId: story.id,
                    synopsisId: synopsis.id,
                    public_id: character.id,
                    ...(character.name && { name: character.name }),                    
                    ...(character.alias && { alias: character.alias }),                    
                    ...(character.gender && { gender: character.gender }),                    
                    ...(character.age && { age: character.age }),                    
                    ...(character.role && { role: character.role }),                    
                    ...(character.race && { race: character.race }),                    
                    ...(character.backstory && { backstory: character.backstory }),                    
                    ...(character.internalConflict && { internalConflict: character.internalConflict }),                    
                    ...(character.externalConflict && { externalConflict: character.externalConflict }),                    
                    ...(character.relationshipToProtagonists && { relationshipToProtagonists: character.relationshipToProtagonists }),                    
                    ...(character.relationshipToOtherCharacters && { relationshipToOtherCharacters: character.relationshipToOtherCharacters }),                    
                    ...(character.weaknesses && { weaknesses: character.weaknesses }),                    
                    ...(character.strengths && { strengths: character.strengths }),                    
                    ...(character.voice && { voice: character.voice }),                    
                    ...(character.perspective && { perspective: character.perspective }),                    
                }
            });
        })

    }

    
}