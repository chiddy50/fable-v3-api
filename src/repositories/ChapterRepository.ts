import { Base } from "./BaseRepository";

export class ChapterRepository extends Base {
  constructor(db: any) {
    super(db, "Chapter");
  }
}
