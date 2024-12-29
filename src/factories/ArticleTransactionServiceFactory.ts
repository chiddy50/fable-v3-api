import { ArticleTransactionService } from "../services/ArticleTransactionService";
import { errorService } from "./ErrorServiceFactory";
import {
  userRepository,
  articleRepository,
  articleAccessRepository,
  articleTransactionRepository,
  paymentRepository
} from "./RepositoryFactory";


export const articleTransactionServiceFactory = new ArticleTransactionService(
    articleTransactionRepository,
    articleRepository,
    paymentRepository,
    articleAccessRepository,
    userRepository,
    errorService,
);

