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
  userRepository
} from "./RepositoryFactory";

export const transactionServiceFactory = new TransactionService(
    transactionRepository,
    storyAccessRepository,
    paymentRepository,
    userRepository,
    storyRepository,
    characterRepository,
    storyStructureRepository,
    errorService
);


