import { TipService } from "../services/TipService";
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

export const tipServiceFactory = new TipService(
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


