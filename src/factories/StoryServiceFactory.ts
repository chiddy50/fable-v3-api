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
  userRepository
} from "./RepositoryFactory";

export const storyServiceFactory = new StoryService(
  storyRepository,
  userRepository,
  pageRepository,
  imageRepository,
  characterRepository,
  sceneRepository,
  plotSuggestionRepository,
  storyStructureRepository,
  transactionRepository,
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
