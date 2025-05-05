import { ImageService } from "../services/ImageService";
import { errorService } from "./ErrorServiceFactory";
import {
  imageRepository,
  userRepository,
  articleRepository,
  chapterRepository,
  sceneRepository,
  characterRepository,
  storyRepository
} from "./RepositoryFactory";


export const imageServiceFactory = new ImageService(
    imageRepository,
    userRepository,
    articleRepository,
    chapterRepository,
    characterRepository,
    sceneRepository,
    storyRepository,
    errorService,
);


