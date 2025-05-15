import { Base } from "./BaseRepository";

export class StoryCommentRepository extends Base {
  constructor(db: any) {
    super(db, "StoryComment");
  }
}
