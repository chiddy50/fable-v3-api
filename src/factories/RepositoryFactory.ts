import { PrismaClient } from "@prisma/client";
import { UserRepository } from "../repositories/UserRepository";
import { StoryRepository } from "../repositories/StoryRepository";
import { PageRepository } from "../repositories/PageRepository";
import { ImageRepository } from "../repositories/ImageRepository";
import { CharacterRepository } from "../repositories/CharacterRepository";
import { SceneRepository } from "../repositories/SceneRepository";
import { PlotSuggestionRepository } from "../repositories/PlotSuggestionRepository";
import { StoryStructureRepository } from "../repositories/StoryStructureRepository";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { StoryAccessRepository } from "../repositories/StoryAccessRepository";

const prisma: any = new PrismaClient();

export const userRepository = new UserRepository(prisma);
export const storyRepository = new StoryRepository(prisma);
export const pageRepository = new PageRepository(prisma);
export const imageRepository = new ImageRepository(prisma);
export const characterRepository = new CharacterRepository(prisma);
export const sceneRepository = new SceneRepository(prisma);
export const plotSuggestionRepository = new PlotSuggestionRepository(prisma);
export const storyStructureRepository = new StoryStructureRepository(prisma);
export const transactionRepository = new TransactionRepository(prisma);
export const storyAccessRepository = new StoryAccessRepository(prisma);
