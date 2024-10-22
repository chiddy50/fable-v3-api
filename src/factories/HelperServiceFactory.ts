import { HelperService } from "../services/HelperService";
import { errorService } from "./ErrorServiceFactory";
import {
  storyRepository,
  characterRepository,
  storyStructureRepository,
  genresOnStoriesRepository,
  storyGenreRepository
} from "./RepositoryFactory";


export const helperServiceFactory = new HelperService(
  storyRepository,
  characterRepository,
  storyStructureRepository,
  genresOnStoriesRepository,
  storyGenreRepository,
  errorService,
);


