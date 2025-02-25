/*
  Warnings:

  - Added the required column `chapterId` to the `Scene` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Scene" ADD COLUMN     "chapterId" TEXT NOT NULL,
ADD COLUMN     "charactersInvolved" JSONB,
ADD COLUMN     "externalVideoUrl" TEXT,
ADD COLUMN     "setting" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "videoUrl" TEXT;

-- AddForeignKey
ALTER TABLE "Scene" ADD CONSTRAINT "Scene_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
