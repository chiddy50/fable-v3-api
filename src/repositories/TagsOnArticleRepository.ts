import { Base } from "./BaseRepository";

export class TagsOnArticleRepository extends Base {
  constructor(db: any) {
    super(db, "TagsOnArticle");
  }
}
