import { SynopsisService } from "../services/SynopsisService";
import { authService } from "./AuthServiceFactory";
import { errorService } from "./ErrorServiceFactory";
import {
    storyRepository,
    characterRepository,
    userRepository,
    synopsisRepository,
    synopsisCharacterRepository,
} from "./RepositoryFactory";

export const synopsisServiceFactory = new SynopsisService(
    synopsisRepository,
    storyRepository,
    characterRepository,
    userRepository,
    synopsisCharacterRepository,
    errorService,
    authService,
);


