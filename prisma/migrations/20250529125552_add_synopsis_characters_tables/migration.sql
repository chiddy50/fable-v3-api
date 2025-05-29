-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "roleJustification" TEXT;

-- CreateTable
CREATE TABLE "SynopsisCharacter" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "synopsisId" TEXT,
    "name" TEXT NOT NULL,
    "alias" TEXT,
    "internalConflict" TEXT,
    "externalConflict" TEXT,
    "voice" TEXT,
    "perspective" TEXT,
    "height" TEXT,
    "weight" TEXT,
    "hairTexture" TEXT,
    "hairLength" TEXT,
    "hairQuirk" TEXT,
    "facialHair" TEXT,
    "extraDescription" TEXT,
    "age" TEXT,
    "race" TEXT,
    "skinTone" TEXT,
    "hair" TEXT,
    "facialFeatures" TEXT,
    "eye_color" TEXT,
    "gender" TEXT,
    "clothing_style" TEXT,
    "role" TEXT,
    "personalityTraits" JSONB,
    "motivations" JSONB,
    "backstory" TEXT,
    "angst" TEXT,
    "relationships" JSONB,
    "relationshipsWithOtherCharacters" JSONB,
    "skills" JSONB,
    "weaknesses" JSONB,
    "strengths" JSONB,
    "coreValues" JSONB,
    "speechPattern" JSONB,
    "intelligence" TEXT,
    "evolution" JSONB,
    "imageUrl" TEXT,
    "public_id" TEXT,
    "description" TEXT,
    "summary" TEXT,
    "metaData" JSONB,
    "relationshipToOtherCharacters" JSONB,
    "relationshipToProtagonists" TEXT,
    "uniqueHook" TEXT,
    "roleJustification" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SynopsisCharacter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SynopsisCharacter" ADD CONSTRAINT "SynopsisCharacter_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SynopsisCharacter" ADD CONSTRAINT "SynopsisCharacter_synopsisId_fkey" FOREIGN KEY ("synopsisId") REFERENCES "Synopsis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
