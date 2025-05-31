import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { Response, Request } from "express";
import { Character, CustomRequest, IJwtPayload, Image, Page, Scene, Story, User } from "../shared/Interface";
import { slugify } from "../shared/helpers";
import { PublicKey } from "@code-wallet/keys";
import * as code from "@code-wallet/client";
import { useConfig } from "../shared/config";
import { CreateTransactionInterface } from "../interfaces/TransactionInterface";
import { v4 as uuidv4 } from 'uuid';
const _ = require('lodash');

export interface ISynopsisService {
    updateSynopsisCharacter(req: CustomRequest, res: Response): Promise<void>;       
}

export class SynopsisService implements ISynopsisService {

    constructor(        
        private synopsisRepo: IBase,
        private storyRepo: IBase,
        private characterRepo: IBase,
        private userRepo: IBase,                
        private synopsisCharacterRepo: IBase,                                
        private errorService: IErrorService,
        private authService: IAuth,        
    ) {}

    public updateSynopsisCharacter = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {

        const { id } = req.params;
        const { synopses, storyId, synopsisId, 
                characterId, name, alias, age, 
                role, gender, backstory, race, strengths, weaknesses, 
                internalConflict, externalConflict, voice, perspective, 
                relationshipToOtherCharacters, relationshipToProtagonists  
        } = req.body;
            
        try {
            if(!storyId) return;
            if(!synopsisId) return;

            let character: any = await this.characterRepo.get({ where: { id } });            
            if (!character) throw new Error("Character not found");

            let updated = await this.characterRepo.update({ 
                where: { 
                    id, 
                },
                data: {
                    ...(name && { name: name }),                    
                    ...(alias && { alias: alias }),                    
                    ...(age && { age: age }),                    
                    ...(role && { role: role }),                    
                    ...(gender && { gender: gender }),                    
                    ...(backstory && { backstory: backstory }),                    
                    ...(race && { race: race }),                    
                    ...(strengths && { strengths: strengths }),                    
                    ...(weaknesses && { weaknesses: weaknesses }),                    
                    ...(internalConflict && { internalConflict: internalConflict }),                    
                    ...(externalConflict && { externalConflict: externalConflict }),                    
                    ...(voice && { voice: voice }),                    
                    ...(perspective && { perspective: perspective }),                    
                    ...(relationshipToOtherCharacters && { relationshipToOtherCharacters: relationshipToOtherCharacters }),                    
                    ...(relationshipToProtagonists && { relationshipToProtagonists: relationshipToProtagonists })                    
                },
            });
            
            const story = await this.fetchStoryById(storyId);            
            
            res.status(200).json({ 
                story,
                characters: await this.characterRepo.getAll({ where: { synopsisId } }),
                error: false, 
                message: "success" 
            });
        } catch (error) {
            console.error(error);
            this.errorService.handleErrorResponse(error)(res);                 
        }
    }

    public createManySynopsisCharacters = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const { characters, storyId, synopsisId } = req.body;

            await this.synopsisCharacterRepo.createMany({
                data: characters,
                skipDuplicates: true,
            });

            const story = await this.fetchStoryById(storyId);            

            res.status(200).json({ 
                story,
                characters: await this.characterRepo.getAll({ where: { synopsisId } }),
                error: false, 
                message: "success" 
            });
        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                             
        }
    }

    public addSynopsisCharacter = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        try {
            const characterId = req.params.id;
            const { character, storyId, synopsisId } = req.body;

            const { id, ...characterData } = character;

            await this.characterRepo.create({
                data: characterData
            });

            await this.synopsisCharacterRepo.delete({ 
                where: { 
                    id: characterId
                } 
            });

            const story = await this.fetchStoryById(storyId);            

            res.status(200).json({ 
                story,                
                error: false, 
                message: "success" 
            });
        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                                         
        }
    }

    public updateSynopsisCharacterRelationship = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        try {
            const characterId = req.params.id;
            const { relationshipToOtherCharacters, storyId, synopsisId, characterPublicId } = req.body;

            let response = await this.characterRepo.update({
                where: {
                    id: characterId
                },
                data: {
                    relationshipToOtherCharacters
                }
            }); 

            res.status(200).json({ 
                characters: await this.characterRepo.getAll({ where: { synopsisId } }),        
                error: false, 
                message: "success" 
            });
        } catch (error) {
            console.error(error);            
        }
    }

    public createSynopsisAndDisablePreviousOnes = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const { reasonSynopsisChanged, incomingCharacters, synopsisChanged, synopsis, storyId, synopsisId } = req.body;


            // DEACTIVATE PREVIOUS SYNOPSIS
            await this.synopsisRepo.updateMany({ 
                where: { 
                    storyId,   
                },
                data: {
                    active: false
                },
            }); 

            // CREATE NEW SYNOPSIS VERSION

            const story = await this.fetchStoryById(storyId);            

            let previousSynopsis: any = await this.synopsisRepo.get({
                where: {
                    id: synopsisId,
                    storyId: story.id
                },
                include: { characters: true }
            });

            const newSynopsis = await this.createSynopsis(
                {
                    synopsis: synopsis,
                    synopsisChanged: synopsisChanged,
                    reasonSynopsisChanged: reasonSynopsisChanged,
                    incomingCharacters
                },
                story,
                previousSynopsis
            );

            res.status(200).json({ 
                story: await this.fetchStoryById(storyId),
                characters: await this.characterRepo.getAll({ where: { synopsisId } }),        
                error: false, 
                message: "success" 
            });
        } catch (error) {
            console.error(error);            
        }
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
    
    private createSynopsis = async (payload: any, story: any, previousSynopsis: any) => {
        
        let storySynopsisCount = await this.synopsisRepo.count({
            storyId: story.id
        });

        let nextSynopsisIndex = storySynopsisCount + 1;
        let synopsis: any = await this.synopsisRepo.create({
            data: {
                index: nextSynopsisIndex,
                publicId: uuidv4(),
                storyId: story?.id,
                content: payload.synopsis,
                metaData: payload,
                active: true,
                
                title: story.projectTitle,
                narrativeConcept: story.narrativeConcept,
                genres: previousSynopsis?.genres,
                storyAudiences: previousSynopsis?.storyAudiences,
                tone: previousSynopsis?.tone,
                contentType: previousSynopsis?.contentType,
                storyStructure: previousSynopsis.storyStructure,
                reason: previousSynopsis.reason,
                projectDescription: previousSynopsis.projectDescription,
            }
        });
        
        // create synopsis characters
        // await this.createSynopsisCharacters(story, previousSynopsis, synopsis.id);
        await this.createCharacters(story, previousSynopsis, synopsis.id);
        
        
        return synopsis;
    }

    private createSynopsisCharacters = async (story: any, synopsis: any, synopsisId:string) => {
        let characters = synopsis.synopsisCharacters;
        characters.forEach(async (character: any) => {

            await this.synopsisCharacterRepo.create({
                data: {
                    storyId: story.id,
                    synopsisId: synopsisId,
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
                    ...(character.uniqueHook && { uniqueHook: character.uniqueHook }),                    
                    ...(character.roleJustification && { roleJustification: character.roleJustification }),                    
                }
            });
        });

        return true;
    }

     private createCharacters = async (story: any, synopsis: any, synopsisId:string) => {
        let characters = synopsis.characters;
        console.log({
            characters
        });

        if (characters?.length < 1) {
            return
        }
        characters?.forEach(async (character: any) => {
            await this.characterRepo.create({
                data: {
                    storyId: story.id,
                    synopsisId: synopsisId,
                    public_id: character.id,
                    ...(character.name && { name: character.name }),                    
                    ...(character.public_id && { public_id: character.public_id }),                    
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
                    ...(character.uniqueHook && { uniqueHook: character.uniqueHook }),                    
                    ...(character.roleJustification && { roleJustification: character.roleJustification }),                    
                }
            });
        });

        return true;
    }

}   
