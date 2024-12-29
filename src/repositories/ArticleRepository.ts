import { Base } from "./BaseRepository";

export class ArticleRepository extends Base {
  constructor(db: any) {
    super(db, "Article");
  }
}
