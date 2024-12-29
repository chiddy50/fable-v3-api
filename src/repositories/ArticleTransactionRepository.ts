import { Base } from "./BaseRepository";

export class ArticleTransactionRepository extends Base {
  constructor(db: any) {
    super(db, "ArticleTransaction");
  }
}
