import { IBase } from "../../repositories/BaseRepository";
import { IAuth } from "../../shared/AuthService";
import { IErrorService } from "../../shared/ErrorService";
import { Response, Request } from "express";
import { Character, CustomRequest, IJwtPayload, Image, Page, Scene, Story } from "../../shared/Interface";
import { slugify } from "../../shared/helpers";
import { SceneInterface } from "../../interfaces/Requests/SceneInterface";

const _ = require('lodash');

export interface IChapterService {
    createChapter(req: CustomRequest, res: Response): Promise<void>;
    updateChapter(req: CustomRequest, res: Response): Promise<void>;
}

export class ChapterServiceV2 implements IChapterService {
    constructor(
        private chapterRepo: IBase,
        private storyRepo: IBase,
        private characterRepo: IBase,
        private sceneRepo: IBase,
        private storyStructureRepo: IBase,        
        private authService: IAuth,
        private errorService: IErrorService
    ) {}

    public createChapter = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const {
            index,
            storyId,
        } = req.body;

        const user: IJwtPayload = req.user as IJwtPayload;    
        if (!user?.id) throw new Error("User Not Found");
                   
        try {
            const story: any = await this.storyRepo.get({
                where: {
                    id: storyId,
                    userId: user?.id,   
                }
            });        
            if (!story) throw new Error("Story Not Found");
    
            const chapter = await this.chapterRepo.create({
                data: { 
                    storyId,
                    index,
                    isFree: false,    
                    content: ""                                                     
                },
            });
            res.status(201).json({ chapter, error: false, message: "success" });

        } catch (error) {
            console.error(error);       
            this.errorService.handleErrorResponse(error)(res);            
        }

    }

    public updateChapter = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const { id } = req.params;

        const {
            content, readersHasAccess,
            title, description, duration,
            isFree, price, image, releaseDate,
            actPosition, summary, banner, coverImage, videoUrl,
            publishedAt
        } = req.body;

        try {
            const chapterExists: any = await this.chapterRepo.get({
                where: { id }
            });        
            if (!chapterExists) throw new Error("Chapter Not Found");

            let makeFree 
            if (isFree) {
                makeFree = isFree === "true" ? true : false;
            } 
            
            const chapterUpdated = await this.chapterRepo.update({ 
                where: { 
                    id,  
                },
                data: {
                    ...(content && { content: content }),
                    ...(title && { title: title }),
                    ...(description && { description: description }),
                    ...(duration && { duration: duration }),
                    ...(price && { price: price }),
                    ...(banner && { image: banner }),
                    ...(coverImage && { coverImage: coverImage }),
                    ...(videoUrl && { videoUrl: videoUrl }),
                    ...(releaseDate && { releaseDate: releaseDate }),
                    ...(actPosition && { actPosition: actPosition }),
                    ...(isFree && { isFree: makeFree }),
                    // ...(isFree && { readersHasAccess: makeFree }),                    
                    ...(summary && { summary: summary }),
                }
            })

            res.status(200).json({ chapter: chapterUpdated, error: false, message: "success" });

        } catch (error) {
            console.error(error);       
            this.errorService.handleErrorResponse(error)(res);   
        }
    }

    public publishChapter = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const { id } = req.params;

        const {
            publishedAt,
            readersHasAccess,
            status
        } = req.body;

        try {
            const user: IJwtPayload = req.user as IJwtPayload;    

            const chapterExists: any = await this.chapterRepo.get({
                where: { id }
            });        
            if (!chapterExists) throw new Error("Chapter Not Found");

            // Check if chapter one is published

            const chapter = await this.chapterRepo.update({ 
                where: { 
                    id,  
                },
                data: {
                    ...(readersHasAccess && { readersHasAccess: readersHasAccess === "true" ? true : false }),
                    ...(publishedAt && { publishedAt: readersHasAccess === "true" ? publishedAt : null }),                
                }
            });

            if (chapterExists?.index === 1) {                
                const story: any = await this.storyRepo.update({
                    where: { 
                        id: chapterExists.storyId,
                        userId: user?.id,   
                    },
                    data: {                                        
                        ...(publishedAt && { publishedAt: readersHasAccess === "true" ? publishedAt : null }),                
                        ...(status && { status: status }),
                    }
                });
            }

            res.status(200).json({ chapter, error: false, message: "success" });

        } catch (error) {
            console.error(error);       
            this.errorService.handleErrorResponse(error)(res);   
        }
    }

    

    public updateManyChapters = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        try {
            const { id } = req.params;

            const { chapters } = req.body;
            const user: IJwtPayload = req.user as IJwtPayload;    
            if (!user?.id) throw new Error("User Not Found");

            chapters.forEach(async (chapter: any) => {

                const chapterUpdated = await this.chapterRepo.update({ 
                    where: { 
                        id: chapter.id,
                        storyId: id, 
                    },
                    data: {
                        content: chapter.content
                    }
                });
            });

            res.status(200).json({ chapters, error: false, message: "success" });

        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                        
        }
    }

}