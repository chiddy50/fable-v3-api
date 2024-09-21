import { Base } from "./BaseRepository";

export class StoryStructureRepository extends Base {
  constructor(db: any) {
    super(db, "StoryStructure");
  }
}
