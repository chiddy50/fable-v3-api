
import { CreditTransactionService } from "../services/CreditTransactionService";
import { authService } from "./AuthServiceFactory";
import { errorService } from "./ErrorServiceFactory";
import {
    creditTransactionRepository,
    paymentRepository,
    userRepository
} from "./RepositoryFactory";

export const creditTransactionServiceFactory = new CreditTransactionService(
    creditTransactionRepository,
    userRepository,
    paymentRepository,
    authService,
    errorService
);


