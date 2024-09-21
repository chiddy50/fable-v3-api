import { Base } from "./BaseRepository";

export class PageRepository extends Base {
  constructor(db: any) {
    super(db, "Page");
  }
}
