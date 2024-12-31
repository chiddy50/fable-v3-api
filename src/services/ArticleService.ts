import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { Response, Request } from "express";
import { CustomRequest, IJwtPayload } from "../shared/Interface";
import { User } from "../shared/Interface";

export interface IArticleService {
    createArticle(req: CustomRequest, res: Response): Promise<void>; 
}


export class ArticleService implements IArticleService {
    constructor(    
        private articleRepo: IBase,
        private articleTransactionRepo: IBase,
        private articleAccessRepo: IBase,        
        private articleLikeRepo: IBase,                
        private articleRatingRepo: IBase,                
        private assetRepo: IBase,
        private assetTransactionRepo: IBase,
        private tagRepo: IBase,        
        private tagsOnArticleRepo: IBase,                
        private userRepo: IBase,
        private errorService: IErrorService,
    ) {}

    public createArticle = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        try {
            const { title, slug, creatorName, type } = req.body;

            const user: IJwtPayload = req.user as IJwtPayload;  
              
            if (!user?.id) throw new Error("User Not Found");

            const article = await this.articleRepo.create({
                data: {
                    userId: user?.id,
                    ...(title && { title: title }),
                    ...(slug && { slug: slug }),
                    ...(type && { type: type }),                    
                    price: 0
                }
            });

            const userUpdated = await this.userRepo.update({
                where: { id: user?.id },
                data: {
                    name: creatorName
                } 
            });

            res.status(201).json({ 
                article,
                error: false, 
                message: "success" 
            });
        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                        
        }
    }

    public updateArticle = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        try {
            const { id } = req.params;

            const { title, content, excerpt, coverImageId, slug, isFree, price, tags, publishedAt, tipLink, depositAddress } = req.body;
            console.log({
                tipLink, 
                depositAddress
            });
            
            const user: IJwtPayload = req.user as IJwtPayload;                
            if (!user?.id) throw new Error("User Not Found");

            const article: any = await this.articleRepo.get({
                where: {
                    id: id,
                    userId: user?.id
                }
            });        
            if (!article) throw new Error("Article not found");

            const articleUpdated = await this.articleRepo.update({
                where: {
                    id: id,
                    userId: user?.id
                },
                data: {
                    userId: user?.id,
                    ...(title && { title: title }),
                    ...(slug && { slug: slug }),
                    ...(content && { content: content }),
                    ...(excerpt && { excerpt: excerpt }),
                    ...(coverImageId && { coverImage: coverImageId }),
                    // ...(isFree && { isFree: isFree }),
                    ...(isFree && { isFree: isFree }),                    
                    ...(price && { price: price }),                    
                    ...(publishedAt && { publishedAt: publishedAt }),
                    // isPaid
                }
            });


            if (tags) {
                await this.setNewTagsOnArticle(tags, id);
            }
            

            if (tipLink || depositAddress) {                
                const userUpdated = await this.userRepo.update({
                    where: { id: user?.id },
                    data: {
                        ...(tipLink && { tipLink: tipLink }),
                        ...(depositAddress && { depositAddress: depositAddress }),
                    } 
                });
            }

            res.status(200).json({ 
                article: articleUpdated,
                error: false, 
                message: "success" 
            });
        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                        
        }
    }

    public getArticle = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const { id } = req.params;
        
        try {
            const user: IJwtPayload = req.user as IJwtPayload; 

            const article: any = await this.articleRepo.get({
                where: {
                    id: id,
                    userId: user?.id
                },
                include: {
                    articleTags: {
                        select: {
                            articleTag: true
                        }
                    },
                }
            });        
            if (!article) throw new Error("Article not found"); 

            const tags = await this.tagRepo.getAll();

            res.status(200).json({ 
                article,
                tags,
                user,
                error: false, 
                message: "success" 
            });
        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                                    
        }
    }
    
    public deleteArticle = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {
        const { id } = req.params;

        try {
            const user: IJwtPayload = req.user as IJwtPayload; 

            const article: any = await this.articleRepo.get({
                where: {
                    id: id,
                    userId: user?.id
                }
            });                    
            if (!article) throw new Error("Article not found"); 

            await this.tagsOnArticleRepo.deleteMany({
                where: {
                    articleId: id, 
                }
            });

            await this.articleAccessRepo.deleteMany({
                where: {
                    articleId: id, 
                }
            });

            await this.articleRepo.delete({
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
    public getUserArticles = async (
        req: CustomRequest,
        res: Response
    ): Promise<void> => {        
        try {
            const { page = 1, limit } = req.query;

            const user: IJwtPayload = req.user as IJwtPayload; 

            const articles: any = await this.articleRepo.getAll({
                where: {
                    userId: user?.id
                },
                include: {
                    user: true,
                    articleTags: {
                        select: {
                            articleTag: true
                        }
                    },
                }
            });

            res.status(200).json({ 
                articles,
                error: false, 
                message: "success" 
            });
        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                                    
        }
    }

    public getArticles = async (
        req: Request,
        res: Response
    ): Promise<void> => {        
        try {
            const { page = 1, limit, tag, rating } = req.query;
            
            // const tagId: number | undefined = tag ? parseInt(tag as string, 10) : undefined;
            const tagId: string | undefined = tag ? tag as string : undefined;
            const whereClause: any = {
                publishedAt: {
                    not: null
                }
            };

            // Add tag filter if tagId is valid (not NaN)
            if (tagId) {
                whereClause.articleTags = {
                    some: {
                        tagId: tagId 
                    }
                };
            }

            if (rating) {
                const numRating = parseFloat(rating as string);
                if (!isNaN(numRating)) {
                    whereClause.averageRating = numRating;
                }
            }
            
            const articles: any = await this.articleRepo.getAll({
                where: whereClause,

                include: {
                    user: true,
                    articleTags: {
                        select: {
                            articleTag: true
                        }
                    },
                    // ratings: {
                    //   select: {
                    //     rating: true
                    //   }
                    // },
                    // _count: {
                    //   select: { ratings: true }
                    // }
                },
                
            });

            const tags = await this.tagRepo.getAll({
                orderBy: {
                    title: 'asc'
                },
            });

            res.status(200).json({ 
                articles,
                tags,
                error: false, 
                message: "success" 
            });
        } catch (error) {
            console.log(error);            
            this.errorService.handleErrorResponse(error)(res);                                    
        }
    }

    public readArticle = async (req: CustomRequest, res: Response): Promise<void> => {
        try {            
            const { id } = req.params;
            if (!id) throw new Error("Invalid id");
            
            const user: IJwtPayload = req.user as IJwtPayload; 
            if (!user?.id) throw new Error("User not found");

            const article: any = await this.articleRepo.get({
                where: {
                    id
                },
                include: {
                    user: true
                }
            });
            if (!article) throw new Error("Article not found");

            const depositAddress = article?.user?.depositAddress;            

            const reader = await this.userRepo.getUnique({ where: { id: user?.id } }) as User | null;
            if (!reader) throw new Error("Unidentified User");

            const accessRecord: any = await this.articleAccessRepo.getUnique({
                where: {
                    userId_articleId: {
                        userId: reader?.id,
                        articleId: article?.id
                    }
                }
            });

            const transaction: any = await this.articleTransactionRepo.get({
                where: { 
                    userId: reader?.id,
                    articleId: article?.id,
                    type: "read-article"
                },
            });        
            
            // const grantAccess = reader.id === article?.userId ? true : false;
            const grantAccess = false;

            const userArticleRating = await this.articleRatingRepo.getUnique({
                where: { 
                    userId_articleId: {
                        userId: user?.id, 
                        articleId: id 
                    }
                }
            });  

            const userArticleLike = await this.articleLikeRepo.getUnique({ 
                where: { 
                    articleId_userId: {
                        userId: user?.id, 
                        articleId: id 
                    }
                } 
            });

            if (!accessRecord) {                
                const articleAccess = await this.articleAccessRepo.create({ 
                    data: {
                        userId: reader?.id,
                        articleId: article?.id,
                        hasAccess: grantAccess,
                        updatedAt: new Date()
                    }
                });

                if (!articleAccess) {
                    res.status(400).json({ 
                        articleAccess,      
                        error: false, 
                        message: "Unable to create article access record" 
                    });
                }

                let response = await this.getUnpaidArticleVersion(article?.id);

                res.status(200).json({ 
                    accessRecord: articleAccess,
                    userArticleRating,      
                    userLike: userArticleLike,            
                    depositAddress,
                    article: response, 
                    error: false, 
                    message: "success" 
                });
                return;

            }else{

                if (grantAccess) {                    
                    const updateArticleAccess = await this.articleAccessRepo.update({
                        where: {
                            userId_articleId: {
                                userId: reader?.id,
                                articleId: article?.id
                            }
                        },
                        data: {
                            hasAccess: true,
                            updatedAt: new Date()
                        }
                    })
                }         
                
                const accessRecordAgain: any = await this.articleAccessRepo.getUnique({
                    where: {
                        userId_articleId: {
                            userId: reader?.id,
                            articleId: article?.id
                        }
                    }
                });

                if (accessRecordAgain?.hasAccess === false) {

                    let response = await this.getUnpaidArticleVersion(article?.id);
                    res.status(200).json({ 
                        accessRecord,
                        userLike: userArticleLike,            
                        userArticleRating,                  
                        article: response, 
                        depositAddress,
                        error: false, 
                        message: "success" 
                    });
                    return;
                }
                if (accessRecordAgain?.hasAccess === true) {

                    let response = await this.getPaidArticleVersion(article?.id);
                    res.status(200).json({ 
                        accessRecord,
                        userArticleRating,   
                        userLike: userArticleLike,            
                        article: response, 
                        depositAddress,
                        error: false, 
                        message: "success" 
                    });
                }
            } 

                  
        } catch (error) {
            console.error(error);       
            this.errorService.handleErrorResponse(error)(res);            
        }
    }
    
    public likeArticle = async (req: CustomRequest, res: Response): Promise<void> => {
        try {
            const { id: articleId } = req.params;
            const user: IJwtPayload = req.user as IJwtPayload;
    
            // Check if the article exists
            const article: any = await this.articleRepo.get({ where: { id: articleId } });
            if (!article) throw new Error("Article not found");
    
            // Check if the user has already liked the article
            const existingLikeRecord = await this.articleLikeRepo.get({
                where: { userId: user?.id, articleId }
            });
    
            let updatedLikeCount: number;
            if (existingLikeRecord) {
                // User has already liked the article, so we remove the like
                await this.articleLikeRepo.delete({ 
                    where: { 
                        articleId_userId: {
                            userId: user?.id, 
                            articleId 
                        }
                    } 
                });
                updatedLikeCount = Math.max(0, article.likeCount - 1); // Ensure like count never goes below 0
            } else {
                // User has not liked the article, so we add a like
                await this.articleLikeRepo.create({ 
                    data: { userId: user?.id, articleId } 
                });
                updatedLikeCount = article.likeCount + 1;
            }
    
            // Update the article with the new like count
            const updatedArticle = await this.articleRepo.update({
                where: { id: articleId },
                data: { likeCount: updatedLikeCount }
            });
    
            res.status(200).json({ 
                article: updatedArticle,
                error: false, 
                message: "success" 
            });
    
        } catch (error) {
            console.error('Error liking article:', error);       
            this.errorService.handleErrorResponse(error)(res);  
        }
    }
    
    public rateArticle = async (req: CustomRequest, res: Response): Promise<void> => {
        try {
            const { id: articleId } = req.params;
            const { review, rating } = req.body;

            const user: IJwtPayload = req.user as IJwtPayload;
                
            const article: any = await this.articleRepo.get({ where: { id: articleId } });
            if (!article) throw new Error("Article not found");

            const existingRatingRecord = await this.articleRatingRepo.get({
                where: { userId: user?.id, articleId }
            });

            if (existingRatingRecord) {
                const userArticleRating = await this.articleRatingRepo.update({
                    where: { 
                        userId_articleId: {
                            userId: user?.id, 
                            articleId 
                        }
                    },
                    data: {
                        ...(review && { review: review }),
                        ...(rating && { rating: rating }),
                    }
                });          
                
                await this.getArticleAverageRating(articleId);
                await this.calculateUserRating(article.userId);                

                res.status(200).json({ 
                    article: userArticleRating,
                    error: false, 
                    message: "success" 
                });                
            }else{
                const userArticleRating = await this.articleRatingRepo.create({
                    data: {
                        userId: user?.id, 
                        articleId,
                        rating,                    
                        ...(review && { review: review }),
                    }
                });

                await this.getArticleAverageRating(articleId);
                await this.calculateUserRating(article.userId);                

                res.status(200).json({ 
                    article: userArticleRating,
                    error: false, 
                    message: "success" 
                });
            }

        } catch (error) {
            console.error('Error rating article:', error);       
            this.errorService.handleErrorResponse(error)(res);  
        }
    }

    public getArticleTags = async (req: CustomRequest, res: Response): Promise<void> => {
        try {
            const tags = await this.tagRepo.getAll();
            
            res.status(200).json({ 
                tags,
                error: false, 
                message: "success" 
            });  
        } catch (error) {
            console.error(error);            
        }
    }
    

    private getUnpaidArticleVersion = async (articleId: string) => {
        const article: any = await this.articleRepo.get({
            where: {
                id: articleId
            },
            include: {             
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        bio: true,
                        imageUrl: true,
                        depositAddress: true
                    }
                }
            }
        });
        return article;
    }

    private getPaidArticleVersion = async (articleId: string) => {
        const article: any = await this.articleRepo.get({
            where: {
                id: articleId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        bio: true,
                        imageUrl: true,
                        depositAddress: true
                    }
                }
            }
        });
        return article;
    }

    private getArticleAverageRating = async (articleId: string) => {
        const articleRating: any = await this.articleRatingRepo.aggregate({
            where: {
                articleId: articleId
            },
            _avg: {
                rating: true
            },
            _sum: {
                rating: true
            }
        });

        let avg = articleRating._avg.rating ? Number(articleRating._avg.rating.toFixed(1)) : 0;
        let total = articleRating?._sum?.rating ? articleRating?._sum?.rating : 0;
        
        await this.articleRepo.update({
            where: {
                id: articleId
            },
            data: {
                averageRating: avg,
                totalRatings: total,
            }
        });

        return { avg, total }
    };

    private calculateUserRating = async (userId: string) => {
        // Get all articles by the user with their ratings
        const userArticles: any = await this.articleRepo.getAll({
            where: {
                userId: userId
            },
            include: {
                ratings: {
                    select: {
                        rating: true
                    }
                }
            }
        });
        
        
        // Collect all ratings across all articles
        const allRatings = userArticles.flatMap((article: any) => article.totalRatings)
        // .reduce((red: number, next: number) => red + next);
        console.log({
            allRatings
        });

        const totalRatings = allRatings.reduce((sum: number, rating: number) => sum + rating, 0);
      
        // Calculate average if there are any ratings
        const averageRating = allRatings.length > 0
          ? Number((totalRatings / allRatings.length).toFixed(1))
          : 0;
        console.log({
            averageRating
        });
      
        // Update user's rating in the database
        await this.userRepo.update({
            where: { id: userId },
            data: {
                averageRating,
                totalRatings
            }
        });
      
        // return {
        //   averageRating,
        //   totalRatings: allRatings.length,
        //   articleCount: userArticles.length
        // };
    };

    private setNewTagsOnArticle = async (tags: { id: string }[], articleId: string) => {
        const incomingTagIds = tags.map((tag: any) => tag.id);
 
        // Step 1: Delete existing tags not in the incoming array
        await this.tagsOnArticleRepo.deleteMany({
            where: {
            articleId: articleId,
                tagId: {
                    notIn: incomingTagIds, // Delete tags not in the incoming tags array
                },
            },
        });

        for (const tag of tags) {
            // Check if the tag is already connected to the article to avoid duplicates
            const existingTagOnArticle = await this.tagsOnArticleRepo.get({
                where: {
                    articleId: articleId,
                    tagId: tag?.id,
                },
            });

            // If not already connected, create the connection
            if (!existingTagOnArticle) {
                await this.tagsOnArticleRepo.create({
                    data: {
                        articleId,
                        tagId: tag?.id,
                    },
                });
            }
        }
    }
}