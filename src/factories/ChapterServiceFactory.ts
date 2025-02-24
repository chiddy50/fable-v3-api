import { ChapterService } from "../services/ChapterService";
import { authService } from "./AuthServiceFactory";
import { errorService } from "./ErrorServiceFactory";
import {
  storyRepository,
  characterRepository,
  storyStructureRepository,
  chapterRepository
} from "./RepositoryFactory";

export const chapterServiceFactory = new ChapterService(
  chapterRepository,
  storyRepository,
  characterRepository,
  storyStructureRepository,
  authService,
  errorService
);


