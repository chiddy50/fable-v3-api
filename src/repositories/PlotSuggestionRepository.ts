import { Base } from "./BaseRepository";

export class PlotSuggestionRepository extends Base {
  constructor(db: any) {
    super(db, "PlotSuggestion");
  }
}
