import { UserService } from "../services/UserService";
import { AuthenticationService } from "../services/AuthenticationService";

import { authService } from "./AuthServiceFactory";
import { errorService } from "./ErrorServiceFactory";
import {
  userRepository,
} from "./RepositoryFactory";

export const userServiceFactory = new UserService(
  userRepository,
  authService,
  errorService
);

export const authenticationServiceFactory = new AuthenticationService(
  userRepository,
  authService,
  errorService
);

