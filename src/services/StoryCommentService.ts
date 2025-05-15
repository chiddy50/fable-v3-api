import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { Response, Request } from "express";
import { CustomRequest, IJwtPayload } from "../shared/Interface";

export interface IStoryCommentService {
    createComment(req: CustomRequest, res: Response): Promise<void>;
}

export class StoryCommentService implements IStoryCommentService {
    constructor(
        private storyCommentRepo: IBase,
        private storyRepo: IBase,
        private chapterRepo: IBase,
        private authService: IAuth,
        private errorService: IErrorService
    ) {}

    public createComment = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const { storyId, chapterId, comment } = req.body;

        try {
            const user: IJwtPayload = req.user as IJwtPayload;
            console.log(user);
            
            const storyComment = await this.storyCommentRepo.create({
                data: {
                    userId: user?.id,
                    chapterId: chapterId,
                    storyId,
                    content: comment
                },
            })

            res.status(200).json({ 
                // scene: sceneUpdated,
                error: false, 
                message: "success" 
            });

        } catch (error) {
            console.log(error);            
            this.errorService.handleErrorResponse(error)(res);
        }
    }

    public getComments = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const { storyId, chapterId, userId, page = 1, limit } = req.query;

        try {

            // Convert page and limit to numbers with defaults
            const pageNumber = parseInt(page as string, 10) || 1;
            const limitNumber = parseInt(limit as string, 10) || 10;
            
            // Build the filter object dynamically
            const filter: Record<string, any> = {};
            
            if (userId) filter.userId = userId;
            if (chapterId) filter.chapterId = chapterId;
            if (storyId) filter.storyId = storyId;

            // Get total count of matching records
            const totalCount = await this.storyCommentRepo.count(filter);
            
            // Calculate total pages
            const totalPages = Math.ceil(totalCount / limitNumber);
            
            // Include pagination in the query
            const storyComments = await this.storyCommentRepo.getAll({
                where: filter,
                include: {
                    user: true
                },
                skip: (pageNumber - 1) * limitNumber,
                take: limitNumber,
            });

            res.status(200).json({ 
                comments: storyComments,
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
            console.log(error);            
            this.errorService.handleErrorResponse(error)(res);
        }
    }

    public getComment = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const { id } = req.params;

        try {
            const user: IJwtPayload = req.user as IJwtPayload;

            // Include pagination in the query
            const storyComment = await this.storyCommentRepo.get({
                where: { id }
            });

            res.status(200).json({ 
                comment: storyComment,
                error: false, 
                message: "success" 
            });

        } catch (error) {
            console.log(error);            
            this.errorService.handleErrorResponse(error)(res);
        }
    }

    
}