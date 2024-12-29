import { AssetService } from "../services/AssetService";
import { errorService } from "./ErrorServiceFactory";
import {
  assetRepository,
  assetTransactionRepository,
  storyRepository,
  characterRepository,
  storyStructureRepository,
  genresOnStoriesRepository,
  storyGenreRepository,
  userRepository,
  storyAccessRepository
} from "./RepositoryFactory";


export const assetServiceFactory = new AssetService(
    assetRepository,
    assetTransactionRepository,
    userRepository,
    storyRepository,
    storyAccessRepository,
    characterRepository,
    storyStructureRepository,
    genresOnStoriesRepository,
    storyGenreRepository,
    errorService,
);


