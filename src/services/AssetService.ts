import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { Response, Request } from "express";

export interface IAssetService {
  createAsset(req: Request, res: Response): Promise<void>; 
}


export class AssetService implements IAssetService {
    constructor(        
        private assetRepo: IBase,
        private assetTransactionRepo: IBase,
        private userRepo: IBase,
        private storyRepo: IBase,
        private storyAccessRepo: IBase,        
        private characterRepo: IBase,
        private storyStructureRepo: IBase,
        private genresOnStoriesRepo: IBase,
        private storyGenreRepo: IBase,
        private errorService: IErrorService,
    ) {}

    public createAsset = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const { name, description, limit, price  } = req.body;

            const asset = await this.assetRepo.create({
                data: {
                    name, 
                    description, 
                    limit, 
                    price
                }
            });

            res.status(200).json({ 
                asset,
                error: false, 
                message: "success" 
            });
        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                        
        }
    }

    public createAssetTransaction = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const { name, description, limit, price  } = req.body;

            const asset = await this.assetRepo.create({
                data: {
                    name, 
                    description, 
                    limit, 
                    price
                }
            });

            res.status(200).json({ 
                asset,
                error: false, 
                message: "success" 
            });
        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                        
        }
    }

}