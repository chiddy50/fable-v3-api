import { Base } from "./BaseRepository";

export class TransactionRepository extends Base {
  constructor(db: any) {
    super(db, "Transaction");
  }
}
