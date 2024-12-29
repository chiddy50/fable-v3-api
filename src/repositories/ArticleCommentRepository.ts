import { Base } from "./BaseRepository";

export class ArticleCommentRepository extends Base {
  constructor(db: any) {
    super(db, "ArticleComment");
  }
}
