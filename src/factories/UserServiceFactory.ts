import { UserService } from "../services/UserService";
import { AuthenticationService } from "../services/AuthenticationService";
import { AuthenticationService as AuthenticationServiceV2  } from "../services/v2/AuthenticationService";

import { authService } from "./AuthServiceFactory";
import { errorService } from "./ErrorServiceFactory";
import {
  articleAccessRepository,
  articleRepository,
  articleTransactionRepository,
  authTokenRepository,
  chapterRepository,
  characterRepository,
  genresOnStoriesRepository,
  paymentRepository,
  sceneRepository,
  storyAccessRepository,
  storyRepository,
  storyStructureRepository,
  tagsOnArticleRepository,
  transactionRepository,
  userRepository,
} from "./RepositoryFactory";

export const userServiceFactory = new UserService(
  userRepository,
  transactionRepository,
  storyRepository,
  chapterRepository,
  sceneRepository,
  characterRepository,
  articleRepository,
  articleTransactionRepository,
  storyAccessRepository,
  articleAccessRepository,
  paymentRepository,
  genresOnStoriesRepository,
  tagsOnArticleRepository,
  storyStructureRepository,

  authService,
  errorService
);

export const authenticationServiceFactory = new AuthenticationService(
  userRepository,
  authTokenRepository,
  authService,
  errorService
);

export const authenticationServiceFactoryV2 = new AuthenticationServiceV2(
  userRepository,
  authTokenRepository,
  authService,
  errorService
);

