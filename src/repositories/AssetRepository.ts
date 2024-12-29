import { Base } from "./BaseRepository";

export class AssetRepository extends Base {
  constructor(db: any) {
    super(db, "Asset");
  }
}
