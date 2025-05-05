-- CreateEnum
CREATE TYPE "GenerationType" AS ENUM ('IMAGE', 'VIDEO', 'MODEL', 'AUDIO', 'OTHER');

-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'DISLIKE');

-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "actPosition" TEXT,
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "price" DECIMAL(65,30),
ADD COLUMN     "questions" JSONB,
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "videoUrl" TEXT;

-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "clothing_style" TEXT,
ADD COLUMN     "evolution" JSONB,
ADD COLUMN     "eye_color" TEXT,
ADD COLUMN     "metaData" JSONB,
ADD COLUMN     "public_id" TEXT;

-- AlterTable
ALTER TABLE "Scene" ADD COLUMN     "imageId" TEXT,
ADD COLUMN     "imageStatus" TEXT,
ADD COLUMN     "meta" JSONB,
ADD COLUMN     "mood" TEXT,
ADD COLUMN     "narrative_importance" TEXT,
ADD COLUMN     "pendingVideoUrl" TEXT,
ADD COLUMN     "prompt" TEXT,
ADD COLUMN     "retries" INTEGER,
ADD COLUMN     "time_of_day" TEXT,
ADD COLUMN     "videoId" TEXT,
ADD COLUMN     "videoStatus" TEXT;

-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "applyFeeToAllChapters" BOOLEAN DEFAULT false,
ADD COLUMN     "autoDetectStructure" BOOLEAN,
ADD COLUMN     "bannerImageUrl" TEXT,
ADD COLUMN     "coverImageUrl" TEXT,
ADD COLUMN     "currentChapterId" TEXT,
ADD COLUMN     "generalChapterFee" DECIMAL(65,30),
ADD COLUMN     "storyType" TEXT,
ADD COLUMN     "structure" TEXT,
ADD COLUMN     "targetAudience" JSONB;

-- AlterTable
ALTER TABLE "StoryComment" ADD COLUMN     "dislikeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "credits" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "dateOfBirth" TEXT,
ADD COLUMN     "firstTimeLogin" BOOLEAN DEFAULT true,
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "password" TEXT,
ADD COLUMN     "userType" TEXT;

-- CreateTable
CREATE TABLE "UserInformation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "favoriteGenre" JSONB,
    "favoriteVibe" JSONB,
    "typeOfCreator" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TargetAudience" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "publicId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TargetAudience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudienceOnStories" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "targetAudienceId" TEXT NOT NULL,
    "publicId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AudienceOnStories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentReaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "writerId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SceneAsset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sceneId" TEXT NOT NULL,
    "type" "GenerationType" NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "url" TEXT,
    "imageUrl" TEXT,
    "externalImageUrl" TEXT,
    "videoUrl" TEXT,
    "externalVideoUrl" TEXT,
    "videoId" TEXT,
    "imageId" TEXT,
    "imageStatus" TEXT,
    "videoStatus" TEXT,
    "videoDuration" TEXT,
    "retries" INTEGER,
    "meta" JSONB,
    "modificationOfId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SceneAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterAsset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "type" "GenerationType" NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "url" TEXT,
    "imageUrl" TEXT,
    "externalImageUrl" TEXT,
    "videoUrl" TEXT,
    "externalVideoUrl" TEXT,
    "videoId" TEXT,
    "imageId" TEXT,
    "imageStatus" TEXT,
    "videoStatus" TEXT,
    "videoDuration" TEXT,
    "retries" INTEGER,
    "meta" JSONB,
    "modificationOfId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CharacterAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChapterAsset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "type" "GenerationType" NOT NULL,
    "cost" DECIMAL(65,30) NOT NULL,
    "coverImageUrl" TEXT,
    "externalCoverImageUrl" TEXT,
    "imageUrl" TEXT,
    "externalImageUrl" TEXT,
    "videoUrl" TEXT,
    "externalVideoUrl" TEXT,
    "videoId" TEXT,
    "imageId" TEXT,
    "imageStatus" TEXT,
    "videoStatus" TEXT,
    "videoDuration" TEXT,
    "retries" INTEGER,
    "meta" JSONB,
    "modificationOfId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChapterAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInformation_userId_key" ON "UserInformation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthToken_token_key" ON "AuthToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "TargetAudience_name_key" ON "TargetAudience"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AudienceOnStories_publicId_key" ON "AudienceOnStories"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "AudienceOnStories_storyId_targetAudienceId_key" ON "AudienceOnStories"("storyId", "targetAudienceId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentReaction_userId_commentId_key" ON "CommentReaction"("userId", "commentId");

-- CreateIndex
CREATE INDEX "CreditTransaction_userId_type_idx" ON "CreditTransaction"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_writerId_key" ON "Subscription"("userId", "writerId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_storyId_key" ON "Bookmark"("userId", "storyId");

-- CreateIndex
CREATE INDEX "SceneAsset_createdAt_idx" ON "SceneAsset"("createdAt");

-- CreateIndex
CREATE INDEX "SceneAsset_modificationOfId_idx" ON "SceneAsset"("modificationOfId");

-- CreateIndex
CREATE INDEX "SceneAsset_sceneId_idx" ON "SceneAsset"("sceneId");

-- CreateIndex
CREATE INDEX "SceneAsset_type_idx" ON "SceneAsset"("type");

-- CreateIndex
CREATE INDEX "SceneAsset_userId_idx" ON "SceneAsset"("userId");

-- CreateIndex
CREATE INDEX "CharacterAsset_characterId_idx" ON "CharacterAsset"("characterId");

-- CreateIndex
CREATE INDEX "CharacterAsset_createdAt_idx" ON "CharacterAsset"("createdAt");

-- CreateIndex
CREATE INDEX "CharacterAsset_modificationOfId_idx" ON "CharacterAsset"("modificationOfId");

-- CreateIndex
CREATE INDEX "CharacterAsset_type_idx" ON "CharacterAsset"("type");

-- CreateIndex
CREATE INDEX "CharacterAsset_userId_idx" ON "CharacterAsset"("userId");

-- CreateIndex
CREATE INDEX "ChapterAsset_chapterId_idx" ON "ChapterAsset"("chapterId");

-- CreateIndex
CREATE INDEX "ChapterAsset_createdAt_idx" ON "ChapterAsset"("createdAt");

-- CreateIndex
CREATE INDEX "ChapterAsset_modificationOfId_idx" ON "ChapterAsset"("modificationOfId");

-- CreateIndex
CREATE INDEX "ChapterAsset_type_idx" ON "ChapterAsset"("type");

-- CreateIndex
CREATE INDEX "ChapterAsset_userId_idx" ON "ChapterAsset"("userId");

-- CreateIndex
CREATE INDEX "Story_storyType_idx" ON "Story"("storyType");

-- AddForeignKey
ALTER TABLE "UserInformation" ADD CONSTRAINT "UserInformation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthToken" ADD CONSTRAINT "AuthToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudienceOnStories" ADD CONSTRAINT "AudienceOnStories_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudienceOnStories" ADD CONSTRAINT "AudienceOnStories_targetAudienceId_fkey" FOREIGN KEY ("targetAudienceId") REFERENCES "TargetAudience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentReaction" ADD CONSTRAINT "CommentReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentReaction" ADD CONSTRAINT "CommentReaction_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "StoryComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditTransaction" ADD CONSTRAINT "CreditTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_writerId_fkey" FOREIGN KEY ("writerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SceneAsset" ADD CONSTRAINT "SceneAsset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SceneAsset" ADD CONSTRAINT "SceneAsset_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SceneAsset" ADD CONSTRAINT "SceneAsset_modificationOfId_fkey" FOREIGN KEY ("modificationOfId") REFERENCES "SceneAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterAsset" ADD CONSTRAINT "CharacterAsset_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterAsset" ADD CONSTRAINT "CharacterAsset_modificationOfId_fkey" FOREIGN KEY ("modificationOfId") REFERENCES "CharacterAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterAsset" ADD CONSTRAINT "CharacterAsset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterAsset" ADD CONSTRAINT "ChapterAsset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterAsset" ADD CONSTRAINT "ChapterAsset_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterAsset" ADD CONSTRAINT "ChapterAsset_modificationOfId_fkey" FOREIGN KEY ("modificationOfId") REFERENCES "ChapterAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
