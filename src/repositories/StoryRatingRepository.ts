import { Base } from "./BaseRepository";

export class StoryRatingRepository extends Base {
  constructor(db: any) {
    super(db, "StoryRating");
  }
}
