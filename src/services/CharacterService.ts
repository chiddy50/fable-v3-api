import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { Response, Request } from "express";
import { Character, CustomRequest, IJwtPayload, Image, Page, Scene, Story } from "../shared/Interface";
import { slugify } from "../shared/helpers";

const _ = require('lodash');

export interface ICharacterService {
    update(req: Request, res: Response): Promise<void>; 
}

export class CharacterService implements ICharacterService {

    constructor(
        private storyRepo: IBase,
        private characterRepo: IBase,
        private storyStructureRepo: IBase,        
        private authService: IAuth,
        private errorService: IErrorService
    ) {}

    public create = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {

        try {
            const {
                confrontationStep,
                storyId,
                strengths,
                weaknesses,
                skills,
                motivations,
                personalityTraits,
                isProtagonist,
                protagonistGoalMotivationSuggestions,
                name,
                age,
                skinTone,
                role,
                hair,
                facialFeatures,
                gender,
                angst,
                backstory,
                coreValues,
                relationships,
                relationshipsWithOtherCharacters,
                relationshipToProtagonist,
                description,
                speechPattern,
                motivationSuggestions,
                summary,
            } = req.body;

            const user: IJwtPayload = req.user as IJwtPayload;    
            if (!user?.id) throw new Error("User Not Found");
            if (!storyId) throw new Error("No story ID found");
            
            const character = await this.characterRepo.create({ 
                data: {
                    isProtagonist: isProtagonist === false ? false : true,
                    ...(storyId && { storyId }),
                    // ...(strengths && { strengths }),
                    // ...(weaknesses && { weaknesses }),
                    ...(skills && { skills }),
                    // ...(motivations && { motivations }),
                    ...(motivationSuggestions && { motivationSuggestions }), 
                    ...(relationshipToProtagonist && { relationshipToProtagonist }),                                        
                    ...(personalityTraits && { personalityTraits }),
                    ...(protagonistGoalMotivationSuggestions && { protagonistGoalMotivationSuggestions }),
                    ...(name && { name }),
                    ...(age && { age }),
                    ...(skinTone && { skinTone }),
                    ...(role && { role }),
                    ...(hair && { hair }),
                    ...(facialFeatures && { facialFeatures }),
                    ...(gender && { gender }),
                    ...(angst && { angst }),
                    ...(backstory && { backstory }),
                    // ...(coreValues && { coreValues }),
                    // ...(motivations && { motivations }),
                    ...(relationships && { relationships }),
                    ...(relationshipsWithOtherCharacters && { relationshipsWithOtherCharacters }),
                    ...(description && { description }),
                    ...(speechPattern && { speechPattern }),
                    ...(summary && { summary }),
                                                
                }
            }) as Character;

            res.status(200).json({ 
                data: { 
                    character 
                }, 
                error: false, 
                message: "success" 
            });

        } catch (error) {
            console.error(error);
            this.errorService.handleErrorResponse(error)(res);   
        }
    }

    public update = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {

        try {
            const { id } = req.params;
            const user: IJwtPayload = req.user as IJwtPayload;    
            if (!user?.id) throw new Error("User Not Found");

            const {
                storyId,

                suggestedCharacters,

                introductionStep,
                confrontationStep,
                resolutionStep,

                coreValues,

                whatTheyWant,
                whoHasIt,
                protagonistGoalSuggestions,
                whoDoesNotHaveProtagonistGoalSuggestions,
                whoDoesNotHaveProtagonistGoal,

                protagonistGoalObstacle,
                protagonistGoalObstacleSuggestions,

                motivationsSuggestions,            
                personalityTraitsSuggestions,      
                skillsSuggestions,                 
                strengthsSuggestions,              
                weaknessesSuggestions,  
                coreValueSuggestions,
                conflictAndAngstSuggestions,

                height,                            
                weight,                            
              
                hairTexture,                      
                hairLength,                       
                hairQuirk,                        
                facialHair,
                extraDescription,

                strengths,
                weaknesses,
                skills,
                motivations,
                personalityTraits,


                isProtagonist,
                protagonistGoalMotivationSuggestions,
                relationshipToProtagonist,
                imageUrl,
                emotionTriggerEventsSuggestions,
                emotionTriggerEvent,
                howCharacterOvercomeObstacleSuggestions,
                howCharacterOvercomeObstacles,
                howCharacterGoalChangeRelationshipSuggestions,
                howCharacterGoalChangeRelationship,
                howCharacterHasGrownSuggestions,
                howCharacterHasGrown,
                howCharactersGoalsAndPrioritiesChangedSuggestions,
                howCharactersGoalsAndPrioritiesChanged,
                unresolvedIssuesFromDepartureSuggestions,
                unresolvedIssuesFromDeparture
            } = req.body;

            const characterUpdated: any = await this.characterRepo.update({
                where: { id },
                data: {
                    ...(imageUrl && { imageUrl }),        
                    
                    ...(whatTheyWant && { whatTheyWant }),        
                    ...(whoHasIt && { whoHasIt }),        
                    ...(protagonistGoalSuggestions && { protagonistGoalSuggestions }),        
                    ...(whoDoesNotHaveProtagonistGoalSuggestions && { whoDoesNotHaveProtagonistGoalSuggestions }),        
                    ...(whoDoesNotHaveProtagonistGoal && { whoDoesNotHaveProtagonistGoal }),        
                    ...(protagonistGoalObstacleSuggestions && { protagonistGoalObstacleSuggestions }),        
                    ...(protagonistGoalObstacle && { protagonistGoalObstacle }),        
                    
                    ...(coreValues && { coreValues }),        
                    
                    ...(motivationsSuggestions && { motivationsSuggestions }),            
                    ...(personalityTraitsSuggestions && { personalityTraitsSuggestions }),      
                    ...(skillsSuggestions && { skillsSuggestions }),                 
                    ...(strengthsSuggestions && { strengthsSuggestions }),              
                    ...(weaknessesSuggestions && { weaknessesSuggestions }),
                    ...(coreValueSuggestions && { coreValueSuggestions }),
                    ...(conflictAndAngstSuggestions && { conflictAndAngstSuggestions }),

                    ...(height && { height }),                            
                    ...(weight && { weight }),                            
                  
                    ...(hairTexture && { hairTexture }),                      
                    ...(hairLength && { hairLength }),                       
                    ...(hairQuirk && { hairQuirk }),
                    ...(facialHair && { facialHair }),   
                    ...(extraDescription && { extraDescription }),                                        

                    ...(strengths && { strengths }),
                    ...(weaknesses && { weaknesses }),
                    ...(skills && { skills }),
                    ...(isProtagonist && { isProtagonist }),
                    ...(motivations && { motivations }),
                    ...(personalityTraits && { personalityTraits }),      
                    ...(relationshipToProtagonist && { relationshipToProtagonist }),                          
                    ...(protagonistGoalMotivationSuggestions && { motivationSuggestions: protagonistGoalMotivationSuggestions }),                          
                    ...(emotionTriggerEventsSuggestions && { emotionTriggerEventsSuggestions }),                                              
                    ...(emotionTriggerEvent && { emotionTriggerEvent }),                                                                  
                    ...(howCharacterOvercomeObstacleSuggestions && { howCharacterOvercomeObstacleSuggestions }),                                              
                    ...(howCharacterOvercomeObstacles && { howCharacterOvercomeObstacles }),                                              
                    ...(howCharacterGoalChangeRelationshipSuggestions && { howCharacterGoalChangeRelationshipSuggestions }),                                              
                    ...(howCharacterGoalChangeRelationship && { howCharacterGoalChangeRelationship }),                                              
                    ...(howCharacterHasGrownSuggestions && { howCharacterHasGrownSuggestions }),                                              
                    ...(howCharacterHasGrown && { howCharacterHasGrown }),           
                    ...(howCharactersGoalsAndPrioritiesChangedSuggestions && { howCharactersGoalsAndPrioritiesChangedSuggestions }),           
                    ...(howCharactersGoalsAndPrioritiesChanged && { howCharactersGoalsAndPrioritiesChanged }),           
                    ...(unresolvedIssuesFromDepartureSuggestions && { unresolvedIssuesFromDepartureSuggestions }),           
                    ...(unresolvedIssuesFromDeparture && { unresolvedIssuesFromDeparture }),           
                                                       
                }
            });

            if (introductionStep || confrontationStep || resolutionStep || suggestedCharacters) {                
                const updateStory: any = await this.storyRepo.update({
                    where: { 
                        id: storyId,
                        userId: user?.id,   
                    },
                    data: {
                        ...(introductionStep && { introductionStep }),
                        ...(confrontationStep && { confrontationStep }),
                        ...(resolutionStep && { resolutionStep }),      
                        ...(suggestedCharacters && { suggestedCharacters }),                                               
                    }
                });
                console.log({updateStory});
                
            }

            // console.log({characterUpdated});
            

            // if (protagonistGoalMotivationSuggestions) {
            //     const storyStructure: any = await this.storyStructureRepo.update({
            //         where: { storyId: characterUpdated.storyId },
            //         data: {
            //             ...(protagonistGoalMotivationSuggestions && { protagonistGoalMotivationSuggestions }),
            //         }
            //     });                
            // }

    
            res.status(200).json({ 
                data: { 
                    character: characterUpdated 
                }, 
                error: false, 
                message: "success" 
            });
            
        } catch (error) {
            console.error(error);
            this.errorService.handleErrorResponse(error)(res);     
        }
    }

    private createCharacters = async (characterSuggestions: [], storyId: string) => {

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
}