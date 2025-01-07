import { TransactionService } from "../services/TransactionService";
import { authService } from "./AuthServiceFactory";
import { errorService } from "./ErrorServiceFactory";
import {
  storyRepository,
  characterRepository,
  storyStructureRepository,
  transactionRepository,
  storyAccessRepository,
  paymentRepository,
  userRepository,
  articleTransactionRepository
} from "./RepositoryFactory";

export const transactionServiceFactory = new TransactionService(
    transactionRepository,
    storyAccessRepository,
    paymentRepository,
    articleTransactionRepository,
    userRepository,
    storyRepository,
    characterRepository,
    storyStructureRepository,
    errorService
);


