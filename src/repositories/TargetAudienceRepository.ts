import { Base } from "./BaseRepository";

export class TargetAudienceRepository extends Base {
  constructor(db: any) {
    super(db, "TargetAudience");
  }
}

