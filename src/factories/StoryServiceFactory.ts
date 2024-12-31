import { StoryService } from "../services/StoryService";
import { StoryStructureService } from "../services/StoryStructureService";
import { StoryAccessService } from "../services/StoryAccessService";
import { authService } from "./AuthServiceFactory";
import { errorService } from "./ErrorServiceFactory";
import {
  storyRepository,
  pageRepository,
  imageRepository,
  characterRepository,
  sceneRepository,
  plotSuggestionRepository,
  storyStructureRepository,
  transactionRepository,
  storyAccessRepository, 
  userRepository,
  genresOnStoriesRepository,
  storyGenreRepository,
  assetRepository,
  assetTransactionRepository,

} from "./RepositoryFactory";

export const storyServiceFactory = new StoryService(
  storyRepository,
  storyAccessRepository,
  userRepository,
  pageRepository,
  imageRepository,
  characterRepository,
  sceneRepository,
  plotSuggestionRepository,
  storyStructureRepository,
  transactionRepository,
  genresOnStoriesRepository,
  storyGenreRepository,
  assetRepository,
  assetTransactionRepository,
  authService,
  errorService
);

export const storyStructureService = new StoryStructureService(
  storyRepository,
  storyStructureRepository,
  authService,
  errorService
)

export const storyAccessService = new StoryAccessService(
  storyAccessRepository,
  userRepository,
  storyRepository,
  storyStructureRepository,
  transactionRepository,
  authService,
  errorService
)
