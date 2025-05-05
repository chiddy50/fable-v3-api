import { SceneService } from "../services/SceneService";
import { authService } from "./AuthServiceFactory";
import { errorService } from "./ErrorServiceFactory";
import {
  storyRepository,
  characterRepository,
  storyStructureRepository,
  chapterRepository,
  sceneRepository
} from "./RepositoryFactory";

export const sceneServiceFactory = new SceneService(
    sceneRepository,
    chapterRepository,
    storyRepository,
    characterRepository,
    storyStructureRepository,
    authService,
    errorService
);


