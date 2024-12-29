import { Base } from "./BaseRepository";

export class ArticleRatingRepository extends Base {
  constructor(db: any) {
    super(db, "ArticleRating");
  }
}
