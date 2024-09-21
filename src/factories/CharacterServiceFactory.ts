import { CharacterService } from "../services/CharacterService";
import { authService } from "./AuthServiceFactory";
import { errorService } from "./ErrorServiceFactory";
import {
  storyRepository,
  characterRepository,
  storyStructureRepository
} from "./RepositoryFactory";

export const characterServiceFactory = new CharacterService(
  storyRepository,
  characterRepository,
  storyStructureRepository,
  authService,
  errorService
);


