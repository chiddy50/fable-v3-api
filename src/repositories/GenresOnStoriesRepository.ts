import { Base } from "./BaseRepository";

export class GenresOnStoriesRepository extends Base {
  constructor(db: any) {
    super(db, "GenresOnStories");
  }
}
