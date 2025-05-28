/*
  Warnings:

  - You are about to drop the column `introductionLocked` on the `Story` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "race" TEXT,
ADD COLUMN     "relationshipToOtherCharacters" JSONB,
ADD COLUMN     "relationshipToProtagonists" TEXT,
ADD COLUMN     "synopsisId" TEXT,
ADD COLUMN     "uniqueHook" TEXT;

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "introductionLocked",
ADD COLUMN     "synopsisId" TEXT;

-- CreateTable
CREATE TABLE "Synopsis" (
    "id" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "storyId" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "active" BOOLEAN,
    "storyStructure" TEXT,
    "reason" TEXT,
    "narrativeConcept" JSONB,
    "genres" JSONB,
    "storyAudiences" JSONB,
    "tone" JSONB,
    "contentType" JSONB,
    "projectDescription" TEXT,
    "publicId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Synopsis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Synopsis_index_idx" ON "Synopsis"("index");

-- CreateIndex
CREATE INDEX "Synopsis_active_idx" ON "Synopsis"("active");

-- CreateIndex
CREATE INDEX "Story_synopsisId_idx" ON "Story"("synopsisId");

-- AddForeignKey
ALTER TABLE "Synopsis" ADD CONSTRAINT "Synopsis_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_synopsisId_fkey" FOREIGN KEY ("synopsisId") REFERENCES "Synopsis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
