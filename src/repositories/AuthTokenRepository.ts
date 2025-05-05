import { Base } from "./BaseRepository";

export class AuthTokenRepository extends Base {
  constructor(db: any) {
    super(db, "AuthToken");
  }
}
