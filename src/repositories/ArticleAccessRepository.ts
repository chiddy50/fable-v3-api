import { Base } from "./BaseRepository";

export class ArticleAccessRepository extends Base {
  constructor(db: any) {
    super(db, "ArticleAccess");
  }
}
