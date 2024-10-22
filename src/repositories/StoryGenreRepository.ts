import { Base } from "./BaseRepository";

export class StoryGenreRepository extends Base {
  constructor(db: any) {
    super(db, "StoryGenre");
  }
}
