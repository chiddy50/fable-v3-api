import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { Response, Request } from "express";
import { Character, CustomRequest, IJwtPayload, Image, Page, Scene, Story } from "../shared/Interface";
import { slugify } from "../shared/helpers";
import { SceneInterface } from "../interfaces/Requests/SceneInterface";

const _ = require('lodash');

export interface IChapterService {
    createChapterOne(req: Request, res: Response): Promise<void>;
    createChapterTwo(req: Request, res: Response): Promise<void>;
}

export class ChapterService implements IChapterService {
    constructor(
        private chapterRepo: IBase,
        private storyRepo: IBase,
        private characterRepo: IBase,
        private sceneRepo: IBase,
        private storyStructureRepo: IBase,        
        private authService: IAuth,
        private errorService: IErrorService
    ) {}

    // Common handler for both chapter creation methods
    private async handleChapterCreation(
        req: CustomRequest,
        res: Response,
        chapterNumber: number,
        chapterContent: string,
        chapterCharacters: any[],
        storyUpdateData: any,
        storyStructureUpdateData: any
    ): Promise<void> {
        try {
            const { id } = req.params;
            const {
                readersHasAccess,
                chapterPublishedAt,
                chapterReleaseDate,
                chapterIsFree,
                scenes,
            } = req.body;

            console.log({scenes});            

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

            // Update story with specific data
            await this.storyRepo.update({
                where: { 
                    id: id,
                    userId: user?.id,   
                },
                data: storyUpdateData
            });

            // Update story structure with specific data
            await this.storyStructureRepo.update({
                where: { storyId: id },
                data: storyStructureUpdateData
            });

            // Handle chapter creation/update
            const existingChapter: any = await this.getChapterByIndex(id, chapterNumber);

            const chapterData = {
                ...(readersHasAccess && { readersHasAccess }),
                ...(chapterContent && { content: chapterContent }),
                ...(chapterPublishedAt && { publishedAt: chapterPublishedAt }),
                ...(chapterReleaseDate && { releaseDate: chapterReleaseDate }),
                ...(chapterCharacters && { characters: chapterCharacters }),
                ...(chapterIsFree && { isFree: chapterIsFree }),
            };

            if (existingChapter) {
                await this.chapterRepo.update({
                    where: { id: existingChapter.id },
                    data: chapterData
                });
            } else {
                await this.chapterRepo.create({
                    data: { 
                        storyId: id,
                        index: chapterNumber,
                        isFree: true,
                        ...chapterData                                                           
                    },
                });
            }

            const chapter: any = await this.getChapterByIndex(id, chapterNumber);

            // SAVE SCENES
            if (scenes) {
                this.createScenes(scenes, id, chapter.id);
            }

            // Handle character creation if needed
            if (chapterCharacters && chapterCharacters.length > 0) {
                await this.characterRepo.deleteMany({
                    where: { storyId: id }
                });
                
                if (chapterNumber === 1 && req.body.protagonistSuggestions?.length > 0) {
                    await this.createCharacters(req.body.protagonistSuggestions, id, user.id, true);
                }
                
                await this.createCharacters(chapterCharacters, id, user.id);
            }
            
            // Get updated story with all includes
            const updatedStory: any = await this.storyRepo.get({
                where: { id: id, userId: user?.id },
                include: { 
                    // plotSuggestions: true, 
                    characters: true, 
                    // storyStructure: true, 
                    chapters: true 
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
            console.error(error);
            this.errorService.handleErrorResponse(error)(res);   
        }
    }

    public createChapterOne = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const {
            chapter,
            genres,
            introduceProtagonistAndOrdinaryWorld,
            introductionSummary,
            introductionSetting,
            introductionTone,
            protagonistSuggestions,
            suggestedCharacters,
        } = req.body;

        // Combine protagonist and suggested characters
        let chapterOneCharacters = [];
        if (protagonistSuggestions) {
            chapterOneCharacters.push(...protagonistSuggestions);
        }
        if (suggestedCharacters) {
            chapterOneCharacters.push(...suggestedCharacters);
        }

        // Prepare story update data
        const storyUpdateData = {
            ...(introductionSetting && { introductionSetting }),
            ...(introductionTone && { introductionTone }),
            ...(protagonistSuggestions && { protagonistSuggestions }),
            ...(suggestedCharacters && { suggestedCharacters }),                
            ...(genres && { genres }),
        };

        // Prepare story structure update data
        const storyStructureUpdateData = {
            ...(introduceProtagonistAndOrdinaryWorld && { introduceProtagonistAndOrdinaryWorld }),
            ...(introductionSummary && { introductionSummary }),
        };

        // Handle chapter creation with extracted common logic
        await this.handleChapterCreation(
            req,
            res,
            chapter || 1,
            introduceProtagonistAndOrdinaryWorld,
            chapterOneCharacters,
            storyUpdateData,
            storyStructureUpdateData
        );
    }

    public createChapterTwo = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const {
            chapter,
            incitingIncident,
            incitingIncidentLocked,
            incitingIncidentSummary,
            suggestedCharacters,
            incitingIncidentTone,
            typeOfEvent,                    
            causeOfTheEvent,                    
            stakesAndConsequences,                    
            incitingIncidentSetting,                
            incitingIncidentExtraDetails,
        } = req.body;

        // Prepare story update data
        const storyUpdateData = {
            ...(incitingIncidentLocked && { incitingIncidentLocked }),                   
            ...(suggestedCharacters && { suggestedCharacters }),                     
            ...(incitingIncidentTone && { incitingIncidentTone }),
            ...(typeOfEvent && { typeOfEvent }),                    
            ...(causeOfTheEvent && { causeOfTheEvent }),                    
            ...(stakesAndConsequences && { stakesAndConsequences }),                    
            ...(incitingIncidentSetting && { incitingIncidentSetting }),
            ...(incitingIncidentExtraDetails && { incitingIncidentExtraDetails }),  
        };

        // Prepare story structure update data
        const storyStructureUpdateData = {
            ...(incitingIncident && { incitingIncident }),
            ...(incitingIncidentSummary && { incitingIncidentSummary }),
        };

        // Handle chapter creation with extracted common logic
        await this.handleChapterCreation(
            req,
            res,
            chapter || 2,
            incitingIncident,
            suggestedCharacters || [],
            storyUpdateData,
            storyStructureUpdateData
        );
    }

    public createChapterThree = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const {
            chapter,
            firstPlotPoint,
            firstPlotPointLocked,
            storyId,
            protagonistGoal,                    
            protagonistTriggerToAction,                    
            obstaclesProtagonistWillFace,                    
            firstPlotPointCharacters,                                                   
            firstPlotPointSetting,                    
            firstPlotPointTone,
            firstPlotPointSummary,
            suggestedCharacters,
            firstPlotPointExtraDetails,                           
        } = req.body;



        // Prepare story update data
        const storyUpdateData = {
            ...(firstPlotPointLocked && { firstPlotPointLocked }),                   
            ...(suggestedCharacters && { suggestedCharacters }),                     
            ...(firstPlotPointTone && { firstPlotPointTone }),
            ...(protagonistGoal && { protagonistGoal }),                    
            ...(protagonistTriggerToAction && { protagonistTriggerToAction }),                    
            ...(obstaclesProtagonistWillFace && { obstaclesProtagonistWillFace: obstaclesProtagonistWillFace } ),
            ...(firstPlotPointSetting && { firstPlotPointSetting }),
            ...(firstPlotPointExtraDetails && { firstPlotPointExtraDetails }),  
        };

        // Prepare story structure update data
        const storyStructureUpdateData = {
            ...(firstPlotPoint && { firstPlotPoint }),
            ...(firstPlotPointSummary && { firstPlotPointSummary }),
        };

        // Handle chapter creation with extracted common logic
        await this.handleChapterCreation(
            req,
            res,
            chapter || 3,
            firstPlotPoint,
            firstPlotPointCharacters || [],
            storyUpdateData,
            storyStructureUpdateData
        );
    }

    public createChapterFour = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const {
            chapter,
            risingActionAndMidpoint,
            challengesProtagonistFaces,
            protagonistPerspectiveChange,
            majorEventPropellingClimax,
            risingActionAndMidpointCharacters,
            risingActionAndMidpointSetting,
            risingActionAndMidpointTone,
            risingActionAndMidpointExtraDetails,
            risingActionAndMidpointLocked,
            risingActionAndMidpointSummary,                           
            suggestedCharacters,
        } = req.body;

          // Prepare story update data
          const storyUpdateData = {
            ...(challengesProtagonistFaces && { challengesProtagonistFaces }),                   
            ...(suggestedCharacters && { suggestedCharacters }),                     
            ...(protagonistPerspectiveChange && { protagonistPerspectiveChange }),
            ...(majorEventPropellingClimax && { majorEventPropellingClimax }),                    
            ...(risingActionAndMidpointCharacters && { risingActionAndMidpointCharacters }),                    
            ...(risingActionAndMidpointSetting && { risingActionAndMidpointSetting } ),
            ...(risingActionAndMidpointTone && { risingActionAndMidpointTone }),
            ...(risingActionAndMidpointExtraDetails && { risingActionAndMidpointExtraDetails }),  
            ...(risingActionAndMidpointLocked && { risingActionAndMidpointLocked }),  
        };

        // Prepare story structure update data
        const storyStructureUpdateData = {
            ...(risingActionAndMidpoint && { risingActionAndMidpoint }),
            ...(risingActionAndMidpointSummary && { risingActionAndMidpointSummary }),
        };

        // Handle chapter creation with extracted common logic
        await this.handleChapterCreation(
            req,
            res,
            chapter || 4,
            risingActionAndMidpoint,
            risingActionAndMidpointCharacters || [],
            storyUpdateData,
            storyStructureUpdateData
        );
    }

    public createChapterFive = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const {
            chapter,
            newObstacles,
            discoveryChanges,
            howStakesEscalate,
            pinchPointsAndSecondPlotPoint,
            pinchPointsAndSecondPlotPointCharacters,
            pinchPointsAndSecondPlotPointSetting,
            pinchPointsAndSecondPlotPointTone,
            pinchPointsAndSecondPlotPointExtraDetails,
            pinchPointsAndSecondPlotPointLocked,
            pinchPointsAndSecondPlotPointSummary,                        
            suggestedCharacters,
        } = req.body;

          // Prepare story update data
          const storyUpdateData = {
            ...(newObstacles && { newObstacles }),                   
            ...(suggestedCharacters && { suggestedCharacters }),                     
            ...(discoveryChanges && { discoveryChanges }),
            ...(howStakesEscalate && { howStakesEscalate }),                    
            ...(pinchPointsAndSecondPlotPointCharacters && { pinchPointsAndSecondPlotPointCharacters }),                    
            ...(pinchPointsAndSecondPlotPointSetting && { pinchPointsAndSecondPlotPointSetting } ),
            ...(pinchPointsAndSecondPlotPointTone && { pinchPointsAndSecondPlotPointTone }),
            ...(pinchPointsAndSecondPlotPointExtraDetails && { pinchPointsAndSecondPlotPointExtraDetails }),  
            ...(pinchPointsAndSecondPlotPointLocked && { pinchPointsAndSecondPlotPointLocked }),  
        };

        // Prepare story structure update data
        const storyStructureUpdateData = {
            ...(pinchPointsAndSecondPlotPoint && { pinchPointsAndSecondPlotPoint }),
            ...(pinchPointsAndSecondPlotPointSummary && { pinchPointsAndSecondPlotPointSummary }),
        };

        // Handle chapter creation with extracted common logic
        await this.handleChapterCreation(
            req,
            res,
            chapter || 5,
            pinchPointsAndSecondPlotPoint,
            pinchPointsAndSecondPlotPointCharacters || [],
            storyUpdateData,
            storyStructureUpdateData
        );
    }


    public createChapterSix = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const {
            chapter,
            finalChallenge,  
            challengeOutcome, 
            storyResolution, 
            climaxAndFallingAction,
            climaxAndFallingActionSetting,
            climaxAndFallingActionTone,
            climaxAndFallingActionExtraDetails,
            climaxAndFallingActionLocked,
            climaxAndFallingActionSummary,      
            climaxAndFallingActionCharacters,                
            suggestedCharacters,
        } = req.body;

          // Prepare story update data
          const storyUpdateData = {
            ...(suggestedCharacters && { suggestedCharacters }),                     
            ...(finalChallenge && { finalChallenge }),                   
            ...(challengeOutcome && { challengeOutcome }),
            ...(storyResolution && { storyResolution }),                    
            ...(climaxAndFallingActionSetting && { climaxAndFallingActionSetting }),                    
            ...(climaxAndFallingActionTone && { climaxAndFallingActionTone } ),
            ...(climaxAndFallingActionExtraDetails && { climaxAndFallingActionExtraDetails }),
            ...(climaxAndFallingActionLocked && { climaxAndFallingActionLocked }),  
            ...(climaxAndFallingActionCharacters && { climaxAndFallingActionCharacters }),              
        };

        // Prepare story structure update data
        const storyStructureUpdateData = {
            ...(climaxAndFallingAction && { climaxAndFallingAction }),
            ...(climaxAndFallingActionSummary && { climaxAndFallingActionSummary }),
        };

        // Handle chapter creation with extracted common logic
        await this.handleChapterCreation(
            req,
            res,
            chapter || 6,
            climaxAndFallingAction,
            climaxAndFallingActionCharacters || [],
            storyUpdateData,
            storyStructureUpdateData
        );
    }
    
    public createChapterSeven = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const {
            chapter,
            resolution,
            climaxConsequences,
            howCharactersEvolve,
            resolutionOfConflict,
            resolutionSetting,
            resolutionTone,
            resolutionExtraDetails,
            resolutionLocked,
            resolutionSummary,           
            suggestedCharacters,
            resolutionCharacters
        } = req.body;

        // Prepare story update data
        const storyUpdateData = {
            ...(suggestedCharacters && { suggestedCharacters }),                     
            ...(climaxConsequences && { climaxConsequences }),                   
            ...(howCharactersEvolve && { howCharactersEvolve }),
            ...(resolutionOfConflict && { resolutionOfConflict }),                    
            ...(resolutionSetting && { resolutionSetting }),                    
            ...(resolutionTone && { resolutionTone } ),
            ...(resolutionExtraDetails && { resolutionExtraDetails }),
            ...(resolutionLocked && { resolutionLocked }),  
            ...(resolutionCharacters && { resolutionCharacters }),              
        };

        // Prepare story structure update data
        const storyStructureUpdateData = {
            ...(resolution && { resolution }),
            ...(resolutionSummary && { resolutionSummary }),
        };

        // Handle chapter creation with extracted common logic
        await this.handleChapterCreation(
            req,
            res,
            chapter || 7,
            resolution,
            resolutionCharacters || [],
            storyUpdateData,
            storyStructureUpdateData
        );
    }
    
    
    

    private createCharacters = async (characterSuggestions: any[], storyId: string, userId: string, protagonist = false) => {
        // Process each character suggestion and create it in the database
        for (const character of characterSuggestions) {
            await this.characterRepo.create({ 
                data: {
                    storyId,   
                    name: character?.name,    
                    age: character?.age,    
                    skinTone: character?.skinTone,    
                    role: character?.role,    
                    hair: character?.hair,    
                    facialFeatures: character?.facialFeatures, 
                    isProtagonist: character?.isProtagonist ?? protagonist,   
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
            });
        }
    }

    private createScenes = async (scenes: SceneInterface[], storyId: string, chapterId: string) => {

        if (scenes && scenes.length > 0) {
            // Delete existing scenes of a chapter
            await this.sceneRepo.deleteMany({
                where: { storyId, chapterId }
            });

            for (const scene of scenes) {
                await this.sceneRepo.create({ 
                    data: {
                        storyId,
                        chapterId,
                        title: scene.title,
                        content: scene.description,
                        order: scene.order,
                        charactersInvolved: scene.charactersInvolved,
                        setting: scene.setting,
                        prompt: scene.prompt,
                        // imageUrl      String?
                        // externalVideoUrl         String?
                        // videoUrl         String?            
                    }
                });
            }
        }
    }

    private getChapterByIndex = async (storyId: string, chapterNumber: number) => {
        return this.chapterRepo.get({
            where: { 
                storyId, 
                index: chapterNumber
            }
        });
    }
}