import { ChapterService } from "../services/ChapterService";
import { authService } from "./AuthServiceFactory";
import { errorService } from "./ErrorServiceFactory";
import {
  storyRepository,
  characterRepository,
  storyStructureRepository,
  chapterRepository,
  sceneRepository
} from "./RepositoryFactory";

export const chapterServiceFactory = new ChapterService(
  chapterRepository,
  storyRepository,
  characterRepository,
  sceneRepository,
  storyStructureRepository,
  authService,
  errorService
);


