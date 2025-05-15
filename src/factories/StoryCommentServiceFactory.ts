import { SceneService } from "../services/SceneService";
import { StoryCommentService } from "../services/StoryCommentService";
import { authService } from "./AuthServiceFactory";
import { errorService } from "./ErrorServiceFactory";
import {
    storyCommentRepository,
    storyRepository,
    chapterRepository,
} from "./RepositoryFactory";

export const storyCommentServiceFactory = new StoryCommentService(
    storyCommentRepository,
    storyRepository,
    chapterRepository,
    authService,
    errorService
);


