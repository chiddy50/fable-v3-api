import { Base } from "./BaseRepository";

export class AssetTransactionRepository extends Base {
  constructor(db: any) {
    super(db, "AssetTransaction");
  }
}
