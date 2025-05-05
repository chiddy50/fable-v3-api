import { ChapterService } from "../services/ChapterService";
import { ChapterServiceV2 } from "../services/v2/ChapterService";
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

export const chapterServiceFactoryV2 = new ChapterServiceV2(
  chapterRepository,
  storyRepository,
  characterRepository,
  sceneRepository,
  storyStructureRepository,
  authService,
  errorService
);
