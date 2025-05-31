import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { Response, Request } from "express";
import { Character, CustomRequest, IJwtPayload, Image, Page, Scene, Story, User } from "../shared/Interface";
import { slugify } from "../shared/helpers";
import { AssetService } from "./AssetService";
import { v4 as uuidv4 } from 'uuid';

const _ = require('lodash');

export interface IStoryService {
    create(req: Request, res: Response): Promise<void>;
    getStoryScene(req: Request, res: Response): Promise<void>;
    getStoryScenes(req: Request, res: Response): Promise<void>;
    getPublicStories(req: Request, res: Response): Promise<void>;
}

export class StoryService implements IStoryService {

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
        private authService: IAuth,
        private errorService: IErrorService
    ) { }

    public getPublicStories = async (req: Request, res: Response): Promise<void> => {
        try {
            const { page = 1, limit, genre, genres, status = "published" } = req.query;

            // Convert page and limit to numbers with defaults
            const pageNumber = parseInt(page as string, 10) || 1;
            const limitNumber = parseInt(limit as string, 10) || 15;

            // Build the filter object dynamically
            const filter: Record<string, any> = {};

            // Safely convert single genre to a number, if it exists
            const genreId: number | undefined = genre ? parseInt(genre as string, 10) : undefined;

            // Parse genres array if it exists
            let genreIds: number[] = [];
            if (genres) {
                try {
                    // Handle JSON string format like "[1,2,3]"
                    if (typeof genres === 'string' && genres.startsWith('[') && genres.endsWith(']')) {
                        genreIds = JSON.parse(genres as string);
                    }
                    // Handle comma-separated format like "1,2,3"
                    else if (typeof genres === 'string') {
                        genreIds = genres.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
                    }
                    // Handle array format (for when the middleware has parsed it)
                    else if (Array.isArray(genres)) {
                        genreIds = (genres as string[]).map(id => parseInt(id, 10)).filter(id => !isNaN(id));
                    }
                } catch (e) {
                    console.error('Error parsing genres parameter:', e);
                }
            }

            // Add single genre ID to the array if valid and not already included
            if (genreId && !isNaN(genreId) && !genreIds.includes(genreId)) {
                genreIds.push(genreId);
            }

            const whereClause: any = {
                status: status,
            };

            // Add genre filter if we have any valid genre IDs
            if (genreIds.length > 0) {
                whereClause.storyGenres = {
                    some: {
                        storyGenreId: { in: genreIds }
                    }
                };
            }

            // Get total count of matching records
            const totalCount = await this.storyRepo.count(whereClause);

            // Calculate total pages
            const totalPages = Math.ceil(totalCount / limitNumber);

            const stories = await this.storyRepo.getAll({
                where: whereClause,
                include: {
                    storyGenres: {
                        select: {
                            storyGenre: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            imageUrl: true,
                            _count: {
                                select: {
                                    stories: {
                                        where: {
                                            status: "published"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    chapters: {
                        where: {
                            readersHasAccess: true
                        },
                        select: {
                            id: true,
                            index: true,
                            readersHasAccess: true,
                            isFree: true,
                            coverImage: true,
                            image: true,
                            status: true,
                            publishedAt: true,
                        }
                    },
                    _count: {
                        select: {
                            comments: true 
                        }
                    }
                },
                skip: (pageNumber - 1) * limitNumber,
                take: limitNumber,
                orderBy: { projectTitle: 'desc' },
            });

            const allGenres = await this.storyGenreRepo.getAll();

            res.status(200).json({
                stories,
                genres: allGenres,
                appliedFilters: {
                    genreIds: genreIds.length > 0 ? genreIds : undefined
                },
                pagination: {
                    currentPage: pageNumber,
                    itemsPerPage: limitNumber,
                    totalItems: totalCount,
                    totalPages: totalPages,
                    hasNextPage: pageNumber < totalPages,
                    hasPreviousPage: pageNumber > 1
                },
                error: false,
                message: "success"
            });

        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);
        }
    }

    public create = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const { stories } = req.body;
        console.log(stories);

        try {
            const user: IJwtPayload = req.user as IJwtPayload;

            stories.forEach(async (story: any) => {

                const newStory = await this.storyRepo.create({
                    data: {
                        userId: user?.id,
                        title: story?.story,
                        overview: story?.overview?.txt,
                        genre: story?.genre?.name,
                        slug: _.kebabCase(story.story),
                        type: 'story-board',
                        imageUrl: story?.overview?.imageUrl ? story?.overview?.imageUrl : null
                    }
                }) as Story;

                story.characters.forEach(async (character: any) => {
                    const newCharacter = await this.characterRepo.create({
                        data: {
                            storyId: newStory?.id,
                            imageUrl: character?.imageUrl ? character?.imageUrl : null,
                            name: character?.txt?.name,
                            description: character?.txt?.description,
                            age: character?.txt?.age.toString(),
                            role: character?.txt?.role
                        }
                    }) as Character;
                });

                story.scenes.forEach(async (scene: any, index: number) => {
                    const newScene = await this.sceneRepo.create({
                        data: {
                            storyId: newStory?.id,
                            imageUrl: scene?.imageUrl ? scene?.imageUrl : null,
                            content: scene?.txt,
                            order: (index + 1)
                        }
                    }) as Scene;
                });
            });

            res.status(201).json({ data: { stories, user }, error: false, message: "success" });

        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);
        }
    }

    public updateStoryOverview = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const { id } = req.params;

        const { overview, isFree, price } = req.body;
        console.log({ overview, isFree, price });

        try {
            const user: IJwtPayload = req.user as IJwtPayload;

            if (!user?.id) throw new Error("User Not Found");
            if (!id) throw new Error("Kindly provide a story ID");

            const story: any = await this.storyRepo.get({
                where: {
                    id: id,
                    userId: user?.id,
                }
            });

            if (!story) throw new Error("Story Not Found");

            const updateStory: any = await this.storyRepo.update({
                where: {
                    id: id,
                    userId: user?.id,
                },
                data: {
                    ...(overview && { overview: overview }),
                    ...(isFree && { isFree: isFree }),
                    ...(price && { price: price }),
                }
            });

            res.status(200).json({
                data: {
                    story: updateStory
                },
                error: false,
                message: "success"
            });

        } catch (error) {
            console.log(error);
            this.errorService.handleErrorResponse(error)(res);
        }

    }
    public updateStoryFromScratch = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const { id } = req.params;

        const {
            storyId,
            currentStep,
            currentStepUrl,
            currentPlotStep,
            introductionStep,
            writingStep,
            projectTitle,
            projectDescription,
            status,
            publishedAt,
            overview,
            isFree,
            price,
            creatorName,

            // INTRODUCTION
            introductionTone,
            genres,
            introductionSetting,
            protagonistSuggestions,
            suggestedCharacters,
            introductionLocked,
            introductionSummary,

            // INCITING EVENT
            typeOfEvent,
            causeOfTheEvent,
            stakesAndConsequences,
            incitingIncidentSetting,
            incitingIncidentTone,
            incitingIncidentExtraDetails,
            incitingIncidentLocked,
            incitingIncidentSummary,

            // FIRST PLOT POINT
            protagonistGoal,
            protagonistTriggerToAction,
            obstaclesProtagonistWillFace,
            firstPlotPointCharacters,
            firstPlotPointSetting,
            firstPlotPointTone,
            firstPlotLocked,
            firstPlotPointExtraDetails,
            firstPlotPointSummary,

            // RISING ACTION & MIDPOINT            
            challengesProtagonistFaces,
            protagonistPerspectiveChange,
            majorEventPropellingClimax,
            risingActionAndMidpointCharacters,
            risingActionAndMidpointSetting,
            risingActionAndMidpointTone,
            risingActionAndMidpointExtraDetails,
            risingActionAndMidpointLocked,
            risingActionAndMidpointSummary,

            // PINCH POINTS AND SECOND PLOT POINT
            newObstacles,
            discoveryChanges,
            howStakesEscalate,
            pinchPointsAndSecondPlotPointCharacters,
            pinchPointsAndSecondPlotPointSetting,
            pinchPointsAndSecondPlotPointTone,
            pinchPointsAndSecondPlotPointExtraDetails,
            pinchPointsAndSecondPlotPointLocked,
            pinchPointsAndSecondPlotPointSummary,

            // CLIMAX & FALLING ACTION
            finalChallenge,
            challengeOutcome,
            storyResolution,
            climaxAndFallingActionSetting,
            climaxAndFallingActionTone,
            climaxAndFallingActionExtraDetails,
            climaxAndFallingActionLocked,
            climaxAndFallingActionSummary,

            // RESOLUTION
            climaxConsequences,
            howCharactersEvolve,
            resolutionOfConflict,
            resolutionSetting,
            resolutionTone,
            resolutionExtraDetails,
            resolutionLocked,
            resolutionSummary,

            // IMAGES
            imageUrl,
            imageStatus,
            imageId,
            introductionImage,
            incitingIncidentImage,
            firstPlotPointImage,
            risingActionAndMidpointImage,
            pinchPointsAndSecondPlotPointImage,
            climaxAndFallingActionImage,
            resolutionImage,

            setting,
            storyStarter,
            writeFromScratch,
            introductionSuggestions,
            expositionSetting, // ACT 1 
            storyPlot,
            hookSetting,
            toneSetting,
            stakeSetting,
            incitingEventSetting,
            updateIncitingEvent,
            protagonistOrdinaryWorld,
            updateProtagonistOrdinaryWorld,

            updateFirstPlotPoint,
            progressiveComplication, // ACT 2
            updateProgressiveComplication,

            addProtagonist,
            addProtagonistGoal,
            addWhoDoesNotHaveProtagonistGoal,
            addProtagonistGoalObstacle,

            introduceProtagonistAndOrdinaryWorld,
            incitingIncident,
            risingActionAndMidpoint,
            firstPlotPoint,
            pinchPointsAndSecondPlotPoint,
            climaxAndFallingAction,
            resolution,

            updatedAt
        } = req.body;

        try {
            const user: IJwtPayload = req.user as IJwtPayload;

            if (!user?.id) throw new Error("User Not Found");
            if (!id) throw new Error("Kindly provide a story ID");

            const story: any = await this.storyRepo.get({
                where: {
                    id: id,
                    userId: user?.id,
                }
            });

            if (!story) throw new Error("Story Not Found");

            const updateStory: any = await this.storyRepo.update({
                where: {
                    id: id,
                    userId: user?.id,
                },
                data: {
                    ...(projectTitle && { projectTitle: projectTitle }),
                    ...(projectDescription && { projectDescription: projectDescription }),

                    ...(currentStep && {
                        currentStep: currentStep
                    }),
                    ...(currentStepUrl && {
                        currentStepUrl: currentStepUrl
                    }),
                    ...(currentPlotStep && {
                        currentPlotStep: currentPlotStep
                    }),
                    ...(introductionStep && {
                        introductionStep: introductionStep
                    }),

                    ...(status && { status: status }),
                    ...(overview && { overview: overview }),
                    ...(isFree && { isFree: isFree }),
                    ...(price && { price: price }),

                    ...(publishedAt && { publishedAt: publishedAt }),

                    ...(writingStep && { writingStep: writingStep }),

                    // IMAGES
                    ...(introductionImage && { introductionImage: introductionImage }),
                    ...(imageUrl && { imageUrl: imageUrl }),
                    ...(imageStatus && { imageStatus: imageStatus }),
                    ...(imageId && { imageId: imageId?.toString() }),

                    ...(incitingIncidentImage && { incitingIncidentImage: incitingIncidentImage }),
                    ...(firstPlotPointImage && { firstPlotPointImage: firstPlotPointImage }),
                    ...(risingActionAndMidpointImage && { risingActionAndMidpointImage: risingActionAndMidpointImage }),
                    ...(pinchPointsAndSecondPlotPointImage && { pinchPointsAndSecondPlotPointImage: pinchPointsAndSecondPlotPointImage }),
                    ...(climaxAndFallingActionImage && { climaxAndFallingActionImage: climaxAndFallingActionImage }),
                    ...(resolutionImage && { resolutionImage: resolutionImage }),

                    // INTRODUCTION
                    ...(introductionLocked && { introductionLocked: introductionLocked }),
                    ...(introductionTone && { introductionTone: introductionTone }),
                    ...(genres && { genres: genres }),
                    ...(introductionSetting && { introductionSetting: introductionSetting }),
                    ...(protagonistSuggestions && { protagonistSuggestions: protagonistSuggestions }),
                    ...(suggestedCharacters && { suggestedCharacters: suggestedCharacters }),
                    ...(setting && { setting: setting }),

                    // INCITING INCIDENT
                    ...(typeOfEvent && { typeOfEvent: typeOfEvent }),
                    ...(causeOfTheEvent && { causeOfTheEvent: causeOfTheEvent }),
                    ...(stakesAndConsequences && { stakesAndConsequences: stakesAndConsequences }),
                    ...(incitingIncidentSetting && { incitingIncidentSetting: incitingIncidentSetting }),
                    ...(incitingIncidentTone && { incitingIncidentTone: incitingIncidentTone }),
                    ...(incitingIncidentExtraDetails && { incitingIncidentExtraDetails: incitingIncidentExtraDetails }),
                    ...(incitingIncidentLocked && { incitingIncidentLocked: incitingIncidentLocked }),

                    // FIRST PLOT POINT
                    ...(protagonistGoal && { protagonistGoal: protagonistGoal }),
                    ...(protagonistTriggerToAction && { protagonistTriggerToAction: protagonistTriggerToAction }),
                    ...(obstaclesProtagonistWillFace && { obstaclesProtagonistWillFace: obstaclesProtagonistWillFace }),
                    ...(firstPlotPointCharacters && { firstPlotPointCharacters: firstPlotPointCharacters }),
                    ...(firstPlotPointSetting && { firstPlotPointSetting: firstPlotPointSetting }),
                    ...(firstPlotPointTone && { firstPlotPointTone: firstPlotPointTone }),
                    ...(firstPlotLocked && { firstPlotLocked: firstPlotLocked }),
                    ...(firstPlotPointExtraDetails && { firstPlotPointExtraDetails: firstPlotPointExtraDetails }),

                    // RISING ACTION & MIDPOINT
                    ...(challengesProtagonistFaces && { challengesProtagonistFaces: challengesProtagonistFaces }),
                    ...(protagonistPerspectiveChange && { protagonistPerspectiveChange: protagonistPerspectiveChange }),
                    ...(majorEventPropellingClimax && { majorEventPropellingClimax: majorEventPropellingClimax }),
                    ...(risingActionAndMidpointCharacters && { risingActionAndMidpointCharacters: risingActionAndMidpointCharacters }),
                    ...(risingActionAndMidpointSetting && { risingActionAndMidpointSetting: risingActionAndMidpointSetting }),
                    ...(risingActionAndMidpointTone && { risingActionAndMidpointTone: risingActionAndMidpointTone }),
                    ...(risingActionAndMidpointExtraDetails && { risingActionAndMidpointExtraDetails: risingActionAndMidpointExtraDetails }),
                    ...(risingActionAndMidpointLocked && { risingActionAndMidpointLocked: risingActionAndMidpointLocked }),

                    // PINCH POINT & SECOND PLOT POINT
                    ...(newObstacles && { newObstacles: newObstacles }),
                    ...(discoveryChanges && { discoveryChanges: discoveryChanges }),
                    ...(howStakesEscalate && { howStakesEscalate: howStakesEscalate }),
                    ...(pinchPointsAndSecondPlotPointCharacters && { pinchPointsAndSecondPlotPointCharacters: pinchPointsAndSecondPlotPointCharacters }),
                    ...(pinchPointsAndSecondPlotPointSetting && { pinchPointsAndSecondPlotPointSetting: pinchPointsAndSecondPlotPointSetting }),
                    ...(pinchPointsAndSecondPlotPointTone && { pinchPointsAndSecondPlotPointTone: pinchPointsAndSecondPlotPointTone }),
                    ...(pinchPointsAndSecondPlotPointExtraDetails && { pinchPointsAndSecondPlotPointExtraDetails: pinchPointsAndSecondPlotPointExtraDetails }),
                    ...(pinchPointsAndSecondPlotPointLocked && { pinchPointsAndSecondPlotPointLocked: pinchPointsAndSecondPlotPointLocked }),

                    // CLIMAX & FALLING ACTION
                    ...(finalChallenge && { finalChallenge: finalChallenge }),
                    ...(challengeOutcome && { challengeOutcome: challengeOutcome }),
                    ...(storyResolution && { storyResolution: storyResolution }),
                    ...(climaxAndFallingActionSetting && { climaxAndFallingActionSetting: climaxAndFallingActionSetting }),
                    ...(climaxAndFallingActionTone && { climaxAndFallingActionTone: climaxAndFallingActionTone }),
                    ...(climaxAndFallingActionExtraDetails && { climaxAndFallingActionExtraDetails: climaxAndFallingActionExtraDetails }),
                    ...(climaxAndFallingActionLocked && { climaxAndFallingActionLocked: climaxAndFallingActionLocked }),

                    // RESOLUTION
                    ...(climaxConsequences && { climaxConsequences: climaxConsequences }),
                    ...(howCharactersEvolve && { howCharactersEvolve: howCharactersEvolve }),
                    ...(resolutionOfConflict && { resolutionOfConflict: resolutionOfConflict }),
                    ...(resolutionSetting && { resolutionSetting: resolutionSetting }),
                    ...(resolutionTone && { resolutionTone: resolutionTone }),
                    ...(resolutionExtraDetails && { resolutionExtraDetails: resolutionExtraDetails }),
                    ...(resolutionLocked && { resolutionLocked: resolutionLocked }),


                    ...(writeFromScratch && {
                        genre: writeFromScratch.genre,
                        genres: writeFromScratch.genres,
                        thematicElements: writeFromScratch.thematicElements,
                        thematicOptions: writeFromScratch.thematicOptions,
                        suspenseTechnique: writeFromScratch.suspenseTechnique,
                        suspenseTechniqueDescription: writeFromScratch.suspenseTechniqueDescription,
                    }),
                    ...(storyStarter && {
                        genre: storyStarter.genre,
                        genres: storyStarter.genres,
                        thematicElements: storyStarter.thematicElements,
                        thematicOptions: storyStarter.thematicOptions,
                        suspenseTechnique: storyStarter.suspenseTechnique,
                        suspenseTechniqueDescription: storyStarter.suspenseTechniqueDescription,
                    }),
                    ...(storyPlot && {
                        title: storyPlot.title,
                        slug: _.kebabCase(storyPlot.title),
                        overview: storyPlot.plot
                    }),
                    ...(introductionSuggestions && {
                        setting: introductionSuggestions?.setting,
                        title: introductionSuggestions.title,
                        slug: _.kebabCase(introductionSuggestions.title),
                        overview: introductionSuggestions.plot,
                    }),
                    ...(incitingEventSetting && {
                        overview: incitingEventSetting?.newPlot,
                    }),
                    ...(suggestedCharacters && {
                        suggestedCharacters: suggestedCharacters
                    }),
                }
            });

            const storyStructure: any = await this.storyStructureRepo.update({
                where: { storyId: id },
                data: {
                    ...(introduceProtagonistAndOrdinaryWorld && { introduceProtagonistAndOrdinaryWorld: introduceProtagonistAndOrdinaryWorld }),
                    ...(incitingIncident && { incitingIncident: incitingIncident }),
                    ...(firstPlotPoint && { firstPlotPoint: firstPlotPoint }),
                    ...(risingActionAndMidpoint && { risingActionAndMidpoint: risingActionAndMidpoint }),
                    ...(pinchPointsAndSecondPlotPoint && { pinchPointsAndSecondPlotPoint: pinchPointsAndSecondPlotPoint }),
                    ...(climaxAndFallingAction && { climaxAndFallingAction: climaxAndFallingAction }),
                    ...(resolution && { resolution: resolution }),

                    ...(introductionSummary && { introductionSummary: introductionSummary }),
                    ...(incitingIncidentSummary && { incitingIncidentSummary: incitingIncidentSummary }),
                    ...(firstPlotPointSummary && { firstPlotPointSummary: firstPlotPointSummary }),
                    ...(risingActionAndMidpointSummary && { risingActionAndMidpointSummary: risingActionAndMidpointSummary }),
                    ...(pinchPointsAndSecondPlotPointSummary && { pinchPointsAndSecondPlotPointSummary: pinchPointsAndSecondPlotPointSummary }),
                    ...(climaxAndFallingActionSummary && { climaxAndFallingActionSummary: climaxAndFallingActionSummary }),
                    ...(resolutionSummary && { resolutionSummary: resolutionSummary }),
                }
            });

            if (genres) {
                const incomingGenreIds = genres.map((genre: any) => genre.id);

                // res.status(200).json({ 
                //     genres, 
                //     incomingGenreIds, 
                //     error: false, 
                //     message: "success" 
                // });

                // Step 1: Delete existing genres not in the incoming array
                await this.genresOnStoriesRepo.deleteMany({
                    where: {
                        storyId: storyId,
                        storyGenreId: {
                            notIn: incomingGenreIds, // Delete genres not in the incoming genre array
                        },
                    },
                });

                // genres.forEach(async (genre: any) => {

                //     const existingGenreOnStory = await this.genresOnStoriesRepo.delete({
                //         where: {
                //           storyId: story?.id,
                //           storyGenreId: genre.id,
                //         },
                //     });

                //     const genreOnStory = await this.genresOnStoriesRepo.create({
                //         data: {
                //             storyId: story?.id,
                //             storyGenreId: genre.id
                //         },
                //     });
                // });

                // Step 2: Add the incoming genres to the story
                for (const genre of genres) {
                    // Check if the genre is already connected to the story to avoid duplicates
                    const existingGenreOnStory = await this.genresOnStoriesRepo.get({
                        where: {
                            storyId: story?.id,
                            storyGenreId: genre?.id,
                        },
                    });

                    // If not already connected, create the connection
                    if (!existingGenreOnStory) {
                        await this.genresOnStoriesRepo.create({
                            data: {
                                storyId: story?.id,
                                storyGenreId: genre.id,
                            },
                        });
                    }
                }
            }

            if (addProtagonist?.protagonists) {
                await this.createCharacters(addProtagonist?.protagonists, id, user?.id);
            }

            if (suggestedCharacters > 0) {
                await this.createCharacters(suggestedCharacters, id, user?.id);
            }

            // if (storyStarter?.plotSuggestions?.length > 0) {
            //     await this.addPlotSuggestions(storyStarter?.plotSuggestions, id);                    
            // }

            const updatedStory: any = await this.storyRepo.get({
                where: { id: id, userId: user?.id },
                include: { 
                    // plotSuggestions: true, 
                    characters: true, 
                    // storyStructure: true 
                }
            });

            res.status(200).json({
                data: {
                    storyId: id,
                    story: updatedStory
                },
                error: false,
                message: "success"
            });

        } catch (error) {
            console.log(error);
            this.errorService.handleErrorResponse(error)(res);
        }
    }

    /**
     * CREATE NEW STORY PROJECT
     */
    public createNewStoryProject = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const { projectTitle, projectDescription, creatorName } = req.body;

        try {
            const user: IJwtPayload = req.user as IJwtPayload;

            if (!user?.id) throw new Error("User Not Found");

            const authUser = await this.userRepo.getUnique({ where: { id: user?.id } }) as User | null;
            if (!authUser?.id) throw new Error("User Not Found");

            const newStory = await this.storyRepo.create({
                data: {
                    userId: user?.id,
                    status: 'draft',
                    type: 'from-scratch',
                    projectTitle,
                    projectDescription,
                    currentPlotStep: 1,
                    // imageStatus: "pending"                                               
                }
            }) as Story;

            if (!newStory) throw new Error("Could not create new story project");

            const userUpdated = await this.userRepo.update({
                where: { id: authUser?.id },
                data: {
                    name: creatorName
                }
            });

            const storyStructure = await this.storyStructureRepo.create({
                data: {
                    storyId: newStory?.id
                }
            }) as Story;

            if (!storyStructure) {
                await this.storyRepo.delete({ where: { id: newStory?.id } });
                throw new Error("Could not create new project")
            };

            let storyId: string = newStory?.id;
            let userId: string = authUser?.id;

            // ADD FREE ASSETS
            this.createFreeAssets(storyId, userId)

            const story = await this.storyRepo.get({
                where: {
                    id: newStory?.id
                },
                include: {
                    characters: true,
                    // plotSuggestions: true,
                    // storyStructure: true,
                },
            }) as Story;

            res.status(201).json({
                story,
                error: false,
                message: "success"
            });

        } catch (error) {
            console.error(error);
            this.errorService.handleErrorResponse(error)(res);
        }
    }

    public publishAndUnpublishStory = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const { id } = req.params;

        const { status, publishedAt, depositAddress, tipLink, price, isFree, overview } = req.body;
        try {
            const user: IJwtPayload = req.user as IJwtPayload;
            if (!user?.id) throw new Error("User Not Found");
            if (!id) throw new Error("Kindly provide a story ID");

            const story: any = await this.storyRepo.update({
                where: {
                    id: id,
                    userId: user?.id,
                },
                data: {
                    ...(overview && { overview: overview }),
                    ...(publishedAt && { publishedAt: publishedAt }),
                    ...(status && { status: status }),
                    ...(price && { price: price }),
                    ...(isFree && { isFree: isFree }),
                }
            });

            if (status === "published") {
                const userUpdated = await this.userRepo.update({
                    where: { id: user?.id },
                    data: {
                        ...(depositAddress && { depositAddress: depositAddress }),
                        ...(tipLink && { tipLink: tipLink }),
                    }
                });
            }

            res.status(201).json({
                story,
                error: false,
                message: "success"
            });

        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);
        }
    }

    public deleteStory = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const { id } = req.params;
        try {
            const user: IJwtPayload = req.user as IJwtPayload;

            const story: any = await this.storyRepo.get({
                where: {
                    id: id,
                    userId: user?.id
                },
                include: {
                    transactions: true
                }
            });

            if (!story) throw new Error("Story Not Found");
            if (story.status === "published") throw new Error("Story has been published");

            const transaction: any = await this.transactionRepo.get({
                where: {
                    storyId: id,
                    type: "read-story",
                    status: "completed"
                },
            });

            if (transaction) throw new Error("Cannot delete a story that has been paid for");

            // await this.transaction([
            //     // // Delete genre relations
            //     // prisma.genresOnStories.deleteMany({
            //     //   where: {
            //     //     storyId: storyIdToDelete
            //     //   }
            //     // }),
            //     // // Delete story accesses (from previous error)
            //     // prisma.storyAccess.deleteMany({
            //     //   where: {
            //     //     storyId: storyIdToDelete
            //     //   }
            //     // }),
            //     // // Finally delete the story
            //     // prisma.story.delete({
            //     //   where: {
            //     //     id: storyIdToDelete
            //     //   }
            //     // })
            // ]);


            await this.genresOnStoriesRepo.deleteMany({
                where: {
                    storyId: id,
                }
            });

            await this.storyAccessRepo.deleteMany({
                where: {
                    storyId: id,
                }
            });

            await this.storyRepo.delete({
                where: {
                    id: id,
                    userId: user?.id
                }
            });

            res.status(200).json({ error: false, message: "success" });

        } catch (error) {
            console.log(error);
            this.errorService.handleErrorResponse(error)(res);
        }
    }

    public editCharacterImage = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        try {
            const { characterId, storyId, imageUrl } = req.body;

            const character: any = await this.characterRepo.get({
                where: {
                    id: characterId,
                    storyId,
                }
            });

            if (!character) throw new Error("Character Not Found");

            const updatedCharacter: any = await this.characterRepo.update({
                where: {
                    id: characterId,
                    storyId
                },
                data: {
                    imageUrl
                },
            });

            res.status(200).json({
                data: { updatedCharacter },
                error: false,
                message: "success"
            });
        } catch (error) {
            console.log(error);
            this.errorService.handleErrorResponse(error)(res);
        }
    }

    public createStoryBook = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const { stories } = req.body;

        try {
            const user: IJwtPayload = req.user as IJwtPayload;

            stories.forEach(async (story: any) => {

                const newStory = await this.storyRepo.create({
                    data: {
                        userId: user?.id,
                        title: story?.storyTitle,
                        genre: story?.genre,
                        type: 'book',
                        slug: _.kebabCase(story.storyTitle),
                    }
                }) as Story;


                story.pages.forEach(async (page: any, index: number) => {
                    const newPage = await this.pageRepo.create({
                        data: {
                            storyId: newStory?.id,
                            imageUrl: page?.imageUrl ? page?.imageUrl : null,
                            content: page?.content,
                            number: parseInt(page?.number)
                        }
                    }) as Page;
                });

            });

            res.status(201).json({ data: { stories, user }, error: false, message: "success" });

        } catch (error) {
            console.log(error);
            this.errorService.handleErrorResponse(error)(res);
        }
    }

    public getStoryScene = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            if (!id) throw new Error("Invalid id");

            const story: any = await this.storyRepo.get({
                where: {
                    id: id
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            primaryWalletAddress: true,
                        },
                    },
                    characters: true,
                    scenes: true,
                    // pages: true,
                },
            });

            if (!story) throw new Error("Story not found");

            res.status(200).json({ story, error: false, message: "success" });
        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);
        }
    };

    public getStoryScenes = async (req: CustomRequest, res: Response): Promise<void> => {
        try {
            const { page = 1, limit, type = 'book' } = req.query;

            // const parsedLimit: number = parseInt(String(limit), 10);
            // const parsedPage: number = parseInt(String(page), 10);

            const user: IJwtPayload = req.user as IJwtPayload;

            let filterOptions: object = { userId: user.id, type };

            // const totalCount: number = await this.storyRepo.count(filterOptions); // Assuming you have a method to count total challenges
            // const offset = (parsedPage - 1) * parsedLimit;

            const stories = await this.storyRepo.getAll({
                where: filterOptions,
                include: {
                    characters: true,
                    scenes: true,
                    // pages: true,
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

    public getStoriesFromScratch = async (req: CustomRequest, res: Response): Promise<void> => {
        try {
            const { page = 1, limit, type = 'original' } = req.query;

            // const parsedLimit: number = parseInt(String(limit), 10);
            // const parsedPage: number = parseInt(String(page), 10);

            const user: IJwtPayload = req.user as IJwtPayload;

            let filterOptions: object = { userId: user.id, type };

            // const totalCount: number = await this.storyRepo.count(filterOptions); // Assuming you have a method to count total challenges
            // const offset = (parsedPage - 1) * parsedLimit;

            const stories = await this.storyRepo.getAll({
                where: filterOptions,
                include: {
                    characters: true,
                    // plotSuggestions: true
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

    public getUnauthenticatedUserStories = async (req: Request, res: Response): Promise<void> => {
        try {
            const { page = 1, limit, } = req.query;
            const { id: userId } = req.params;

            const parsedPage: number = parseInt(page as string, 10);
            const parsedLimit: number = parseInt(limit as string, 10);
            let filter: object = { userId: userId };
            const totalCount: number = await this.storyRepo.count(filter);
            const offset = (parsedPage - 1) * parsedLimit;

            let filterOptions: object = { userId: userId, status: "published" };

            const stories = await this.storyRepo.getAll({
                where: filterOptions,
                include: {
                    characters: true,
                    // plotSuggestions: true,
                    chapters: {
                        where: {
                            readersHasAccess: true
                        },
                    },
                    user: true,
                    _count: {
                        select: {
                            comments: true 
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip: Number(offset),
                take: Number(limit),
            });

            const totalPages: number = Math.ceil(totalCount / parsedLimit);
            const hasNextPage: boolean = parsedPage < totalPages;
            const hasPrevPage: boolean = parsedPage > 1;

            res.status(200).json({
                stories,
                totalPages,
                hasNextPage,
                hasPrevPage,
                error: false,
                message: "Stories successfully retrieved"
            });


        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);
        }
    }



    public getStoryFromScratch = async (req: CustomRequest, res: Response): Promise<void> => {
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
                    // plotSuggestions: true,
                    // storyStructure: true,
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

    public readStory = async (req: CustomRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            if (!id) throw new Error("Invalid id");
            const user: IJwtPayload = req.user as IJwtPayload;

            const transaction: any = await this.transactionRepo.get({
                where: {
                    storyId: id,
                    userId: user?.id,
                    type: "read-story"
                },
            });

            if (!transaction) {
                const story: any = await this.storyRepo.get({
                    where: {
                        id: id
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
                        // storyStructure: {
                        //     select: { id: true, introduceProtagonistAndOrdinaryWorld: true },
                        // },
                    }
                });

                res.status(200).json({ story, error: false, message: "success" });
                return;
            }

            if (transaction?.status === "completed") {
                const story: any = await this.storyRepo.get({
                    where: {
                        id: id
                    },
                    include: {
                        // storyStructure: true,
                        user: true
                    }
                });

                res.status(200).json({ story, error: false, message: "success" });
                return;
            } else {
                const story: any = await this.storyRepo.get({
                    where: {
                        id: id
                    },
                    include: {
                        // storyStructure: {
                        //     select: { id: true, introduceProtagonistAndOrdinaryWorld: true },
                        // },
                        user: true
                    }
                });

                res.status(200).json({ story, error: false, message: "success" });
                return;
            }

        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);
        }
    }



    private createCharacters = async (characterSuggestions: [], storyId: string, userId: string) => {
        console.log({ characterSuggestions });

        characterSuggestions.forEach(item => {
            console.log({ item });
        });

        // GET ALL CHARACTERS
        const allCharacters = await this.characterRepo.getAll({
            where: { storyId: storyId }
        });

        // DELETE ALL EXISTING CHARACTERS
        allCharacters?.forEach(async (character: any) => {
            const characterDeleted: any = await this.characterRepo.delete({
                where: { id: character?.id, storyId: storyId }
            });
        });

        characterSuggestions.forEach(async (character: any) => {
            const newCharacter = await this.characterRepo.create({
                data: {
                    storyId: storyId,
                    name: character?.name,
                    age: character?.age,
                    skinTone: character?.skinTone,
                    role: character?.role,
                    hair: character?.hair,
                    facialFeatures: character?.facialFeatures,
                    isProtagonist: character?.isProtagonist ?? false,
                    gender: character?.gender,
                    angst: character?.angst,
                    backstory: character?.backstory,
                    coreValues: character?.coreValues,
                    personalityTraits: character?.personalityTraits,
                    motivations: character?.motivations,
                    relationships: character?.relationships,
                    relationshipsWithOtherCharacters: character?.relationshipsWithOtherCharacters,
                    skills: character?.skills,
                    weaknesses: character?.weaknesses,
                    strengths: character?.strengths,
                    speechPattern: character?.speechPattern,
                    description: character?.description,
                    summary: character?.summary,

                }
            }) as Character;

        });

    }

    private addPlotSuggestions = async (plotSuggestions: any, storyId: string) => {
        // GET ALL PLOT SUGGESTIONS
        const allSuggestions = await this.plotSuggestionRepo.getAll({
            where: { storyId: storyId }
        });

        // DELETE ALL EXISTING PLOT SUGGESTIONS
        allSuggestions?.forEach(async (plotSuggestion: any) => {
            const plotSuggestionDeleted: any = await this.plotSuggestionRepo.delete({
                where: { id: plotSuggestion?.id, storyId: storyId }
            });
        });

        // SAVE INCOMING PLOT SUGGESTIONS
        plotSuggestions?.forEach(async (plotSuggestion: any) => {
            const newPlotSuggestion = await this.plotSuggestionRepo.create({
                data: {
                    storyId: storyId,
                    title: plotSuggestion?.title,
                    slug: _.kebabCase(plotSuggestion?.title),
                    plot: plotSuggestion?.plot
                }
            }) as Story;
        });

        return;
    }

    private createFreeAssets = async (storyId: string, userId: string) => {
        const assetList = [
            {
                title: "story-banner",
                count: 1,
            },
            {
                title: "story-chapter",
                count: 7,
            },
            {
                title: "story-overview",
                count: 1,
            }
        ];

        assetList.forEach(async (asset: { title: string, count: number }) => {

            const assetItem: any = await this.assetRepo.getUnique({
                where: { name: asset.title }
            });

            if (assetItem) {
                for (let i = 0; i < asset.count; i++) {

                    this.assetTransactionRepo.create({
                        data: {
                            description: asset.title === "story-chapter" ? `Chapter-${i + 1}` : assetItem.description,
                            assetId: assetItem?.id,
                            userId,
                            storyId,
                            reference: uuidv4(),
                            isFree: true,
                            usageCount: 0,
                            totalPaid: 0
                        }
                    });
                }
            }
        });
    }

    // private getStoryResponse = async (story: Story) => {
    //     return {
    //         id: story.id,
    //         publicId: story.publicId,
    //         createdAt: story.createdAt,
    //         currentStepUrl: story.currentStepUrl,
    //         currentStep: story.currentStep,
    //         storyStarter: {
    //             genres: story.genres,
    //             suspenseTechnique: story.suspenseTechnique,
    //             suspenseTechniqueDescription: story.suspenseTechniqueDescription,
    //             thematicElements: story.thematicElements,
    //             thematicOptions: story.thematicOptions,
    //         },
    //         plot: {
    //             plot: story.overview,
    //             slug: story.slug,
    //             title: story.title,
    //             plotSuggestions: story.plotSuggestions,
    //         }
    //     }
    // }

}