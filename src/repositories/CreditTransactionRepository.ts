import { Base } from "./BaseRepository";

export class CreditTransactionRepository extends Base {
  constructor(db: any) {
    super(db, "CreditTransaction");
  }
}
