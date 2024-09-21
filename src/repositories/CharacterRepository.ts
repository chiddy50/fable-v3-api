import { Base } from "./BaseRepository";

export class CharacterRepository extends Base {
  constructor(db: any) {
    super(db, "Character");
  }
}
