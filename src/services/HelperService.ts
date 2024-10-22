import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { Response, Request } from "express";

export interface IHelperService {
  getGenres(req: Request, res: Response): Promise<void>; 
}


export class HelperService implements IHelperService {
    constructor(
        private storyRepo: IBase,
        private characterRepo: IBase,
        private storyStructureRepo: IBase,
        private genresOnStoriesRepo: IBase,
        private storyGenreRepo: IBase,
        private errorService: IErrorService,
    ) {}

    public getGenres = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const genres = await this.storyGenreRepo.getAll();

            res.status(200).json({ 
                genres,
                error: false, 
                message: "success" 
            });
        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                        
        }
    }

    public createUser = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const { depositAddress, name, tipLink } = req.body;

    }

}