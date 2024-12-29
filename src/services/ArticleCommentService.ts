import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { Response, Request } from "express";
import { CustomRequest, IJwtPayload } from "../shared/Interface";
import { User } from "../shared/Interface";

export interface IArticleCommentService {
    createComment(req: CustomRequest, res: Response): Promise<void>; 
}


export class ArticleCommentService implements IArticleCommentService {
    constructor(    
        private articleRepo: IBase,
        private articleCommentRepo: IBase,
        private userRepo: IBase,
        private errorService: IErrorService,
    ) {}

    public createComment = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        try {
            const { content, articleId } = req.body;

            const user: IJwtPayload = req.user as IJwtPayload;  
            
            // Create a top-level comment
            const comment = await this.articleCommentRepo.create({
                data: {
                    content,
                    articleId,
                    userId: user?.id
                }
            });            

            res.status(201).json({ 
                comment,
                error: false, 
                message: "success" 
            });
        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                        
        }
    }

    public replyComment = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        try {
            const { content, articleId, parentId } = req.body;

            const user: IJwtPayload = req.user as IJwtPayload;  
            
            const parentComment: any = await this.articleCommentRepo.get({
                where: {
                    articleId,
                    parentId,
                }
            });
            if(!parentComment) throw new Error("Unidentified comment");

            // Create a reply to that comment
            const reply: any = await this.articleCommentRepo.create({
                data: {
                    content,
                    articleId,
                    userId: user?.id,
                    parentId: parentComment?.id
                }
            });
            
            console.log({
                reply,
                replyCount: reply?.replyCount
            });
            
            if (reply) {
                let replyCount = reply?.replyCount;
                let newReplyCount = replyCount += 1;

                console.log({
                    replyCount,
                    newReplyCount,
                });
                await this.articleCommentRepo.update({
                    where: {
                        id: reply.id
                    },
                    data: {
                        replyCount: newReplyCount
                    }
                });
            }

            res.status(201).json({ 
                reply,
                error: false, 
                message: "success" 
            });
        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                        
        }
    }

}