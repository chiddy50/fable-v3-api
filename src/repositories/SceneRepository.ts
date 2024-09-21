import { Base } from "./BaseRepository";

export class SceneRepository extends Base {
  constructor(db: any) {
    super(db, "Scene");
  }
}
