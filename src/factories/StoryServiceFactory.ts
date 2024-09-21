import { StoryService } from "../services/StoryService";
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


