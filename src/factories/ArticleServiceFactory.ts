import { ArticleService } from "../services/ArticleService";
import { errorService } from "./ErrorServiceFactory";
import {
  assetRepository,
  assetTransactionRepository,
  userRepository,
  articleRepository,
  articleTransactionRepository,
  articleAccessRepository,
  articleLikeRepository,
  articleRatingRepository,
  tagRepository,
  tagsOnArticleRepository
} from "./RepositoryFactory";


export const articleServiceFactory = new ArticleService(
    articleRepository,
    articleTransactionRepository,
    articleAccessRepository,
    articleLikeRepository,
    articleRatingRepository,
    assetRepository,
    assetTransactionRepository,
    tagRepository,
    tagsOnArticleRepository,
    userRepository,
    errorService,
);


