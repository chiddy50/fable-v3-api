import { Base } from "./BaseRepository";

export class ImageRepository extends Base {
  constructor(db: any) {
    super(db, "Image");
  }
}
