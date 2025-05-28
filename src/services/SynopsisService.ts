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
                            characters: true  
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
    
}   
