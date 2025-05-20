import { StoryGenreService } from "../services/StoryGenreService";
import { authService } from "./AuthServiceFactory";
import { errorService } from "./ErrorServiceFactory";
import {
    storyGenreRepository,
    genresOnStoriesRepository,
    storyRepository,
} from "./RepositoryFactory";

export const storyGenreServiceFactory = new StoryGenreService(
    storyGenreRepository,
    genresOnStoriesRepository,
    storyRepository,
    authService,
    errorService
);


