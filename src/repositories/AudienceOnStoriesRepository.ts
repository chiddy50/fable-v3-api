
import { Base } from "./BaseRepository";

export class AudienceOnStoriesRepository extends Base {
  constructor(db: any) {
    super(db, "AudienceOnStories");
  }
}
