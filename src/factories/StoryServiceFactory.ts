import { StoryService } from "../services/StoryService";
import { StoryStructureService } from "../services/StoryStructureService";
import { authService } from "./AuthServiceFactory";
import { errorService } from "./ErrorServiceFactory";
import {
  storyRepository,
  pageRepository,
  imageRepository,
  characterRepository,
  sceneRepository,
  plotSuggestionRepository,
  storyStructureRepository
} from "./RepositoryFactory";

export const storyServiceFactory = new StoryService(
  storyRepository,
  pageRepository,
  imageRepository,
  characterRepository,
  sceneRepository,
  plotSuggestionRepository,
  storyStructureRepository,
  authService,
  errorService
);

export const storyStructureService = new StoryStructureService(
  storyRepository,
  storyStructureRepository,
  authService,
  errorService
)


