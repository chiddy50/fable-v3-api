import { Base } from "./BaseRepository";

export class StoryRepository extends Base {
  constructor(db: any) {
    super(db, "Story");
  }
}
