import { CharacterRepository } from "./CharacterRepository";
import { ImageRepository } from "./ImageRepository";
import { PageRepository } from "./PageRepository";
import { SceneRepository } from "./SceneRepository";
import { StoryRepository } from "./StoryRepository";
import { UserRepository } from "./UserRepository";
import { PlotSuggestionRepository } from "./PlotSuggestionRepository";
import { StoryStructureRepository } from "./StoryStructureRepository";
import { PrismaClient } from "@prisma/client";
import { TransactionRepository } from "./TransactionRepository";
import { StoryAccessRepository } from "./StoryAccessRepository";
import { StoryGenreRepository } from "./StoryGenreRepository";
import { GenresOnStoriesRepository } from "./GenresOnStoriesRepository";

const prisma: any = new PrismaClient();

export const userRepository = new UserRepository(prisma);
export const imageRepository = new ImageRepository(prisma);
export const storyRepository = new StoryRepository(prisma);
export const characterRepository = new CharacterRepository(prisma);
export const sceneRepository = new SceneRepository(prisma);
export const pageRepository = new PageRepository(prisma);
export const plotSuggestionRepository = new PlotSuggestionRepository(prisma);
export const storyStructureRepository = new StoryStructureRepository(prisma);
export const transactionRepository = new TransactionRepository(prisma);
export const storyAccessRepository = new StoryAccessRepository(prisma);
export const storyGenreRepository = new StoryGenreRepository(prisma);
export const genresOnStoriesRepository = new GenresOnStoriesRepository(prisma);
