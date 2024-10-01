import { Base } from "./BaseRepository";

export class StoryAccessRepository extends Base {
  constructor(db: any) {
    super(db, "StoryAccess");
  }
}
