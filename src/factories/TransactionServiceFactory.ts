import { TransactionService } from "../services/TransactionService";
import { authService } from "./AuthServiceFactory";
import { errorService } from "./ErrorServiceFactory";
import {
  storyRepository,
  characterRepository,
  storyStructureRepository,
  transactionRepository,
  storyAccessRepository,
  userRepository
} from "./RepositoryFactory";

export const transactionServiceFactory = new TransactionService(
    transactionRepository,
    storyAccessRepository,
    userRepository,
    storyRepository,
    characterRepository,
    storyStructureRepository,
    authService,
    errorService
);


