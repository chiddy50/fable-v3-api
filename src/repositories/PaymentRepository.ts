import { Base } from "./BaseRepository";

export class PaymentRepository extends Base {
  constructor(db: any) {
    super(db, "Payment");
  }
}
