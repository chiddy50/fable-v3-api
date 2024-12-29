import { ArticleCommentService } from "../services/ArticleCommentService";
import { errorService } from "./ErrorServiceFactory";
import {
    articleCommentRepository,
    userRepository,
    articleRepository,
} from "./RepositoryFactory";


export const articleCommentServiceFactory = new ArticleCommentService(
    articleRepository,
    articleCommentRepository,
    userRepository,
    errorService,
);


