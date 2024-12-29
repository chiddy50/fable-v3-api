import { Base } from "./BaseRepository";

export class ArticleLikeRepository extends Base {
  constructor(db: any) {
    super(db, "ArticleLike");
  }
}
