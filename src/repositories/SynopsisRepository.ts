import { Base } from "./BaseRepository";

export class SynopsisRepository extends Base {
  constructor(db: any) {
    super(db, "Synopsis");
  }
}
