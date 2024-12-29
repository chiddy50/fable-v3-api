import { Base } from "./BaseRepository";

export class TagRepository extends Base {
  constructor(db: any) {
    super(db, "Tag");
  }
}
