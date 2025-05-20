import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { Response, Request } from "express";
const _ = require('lodash');

export interface IStoryGenreService {
    getDistinctGenres(req: Request, res: Response): Promise<void>;
}

export class StoryGenreService implements IStoryGenreService {

    constructor(
        private storyGenreRepo: IBase,
        private genresOnStoriesRepo: IBase,
        private storyRepo: IBase,
        private authService: IAuth,
        private errorService: IErrorService
    ) { }

    public getDistinctGenres = async (
        req: Request,
        res: Response
    ): Promise<void> => {

        try {
            const distinctGenres = await this.storyGenreRepo.getAll({
                where: {
                    stories: {
                        some: {} // This ensures we only get genres that have at least one story
                    }
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    _count: {
                        select: {
                            stories: true // This gives us the count of stories for each genre
                        }
                    }
                },
                orderBy: {
                    name: 'asc' // Optional: Alphabetical ordering
                }
            });
            res.status(200).json({
                distinctGenres,
                error: false,
                message: "success"
            });

        } catch (error) {
            console.log(error);
            this.errorService.handleErrorResponse(error)(res);
        }
    }

}