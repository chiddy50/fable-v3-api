import { HelperService } from "../services/HelperService";
import { errorService } from "./ErrorServiceFactory";
import {
  storyRepository,
  characterRepository,
  storyStructureRepository,
  genresOnStoriesRepository,
  storyGenreRepository,
  userRepository,
  storyAccessRepository
} from "./RepositoryFactory";


export const helperServiceFactory = new HelperService(
  userRepository,
  storyRepository,
  storyAccessRepository,
  characterRepository,
  storyStructureRepository,
  genresOnStoriesRepository,
  storyGenreRepository,
  errorService,
);


