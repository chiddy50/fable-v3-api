import { TransactionService } from "../services/TransactionService";
import { authService } from "./AuthServiceFactory";
import { errorService } from "./ErrorServiceFactory";
import {
  storyRepository,
  characterRepository,
  storyStructureRepository,
  transactionRepository
} from "./RepositoryFactory";

export const transactionServiceFactory = new TransactionService(
    transactionRepository,
    storyRepository,
    characterRepository,
    storyStructureRepository,
    authService,
    errorService
);


