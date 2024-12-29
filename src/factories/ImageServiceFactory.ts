import { ImageService } from "../services/ImageService";
import { errorService } from "./ErrorServiceFactory";
import {
  imageRepository,
  userRepository,
  articleRepository
} from "./RepositoryFactory";


export const imageServiceFactory = new ImageService(
    imageRepository,
    userRepository,
    articleRepository,
    errorService,
);


