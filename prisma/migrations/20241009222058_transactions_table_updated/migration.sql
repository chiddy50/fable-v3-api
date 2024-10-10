-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "name" TEXT,
    "publicId" TEXT,
    "primaryWalletAddress" TEXT,
    "depositAddress" TEXT,
    "tipLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectTitle" TEXT,
    "projectDescription" TEXT,
    "title" TEXT,
    "slug" TEXT,
    "imageUrl" TEXT,
    "type" TEXT,
    "overview" TEXT,
    "writingStep" INTEGER DEFAULT 1,
    "currentPlotStep" INTEGER DEFAULT 1,
    "introductionStep" INTEGER DEFAULT 1,
    "confrontationStep" INTEGER DEFAULT 0,
    "resolutionStep" INTEGER DEFAULT 0,
    "status" TEXT,
    "currentStep" INTEGER,
    "currentStepUrl" TEXT,
    "thematicElements" JSONB,
    "thematicOptions" JSONB,
    "suspenseTechnique" JSONB,
    "suspenseTechniqueDescription" TEXT,
    "setting" TEXT,
    "introductionLocked" BOOLEAN DEFAULT false,
    "genre" TEXT,
    "genres" JSONB,
    "introductionTone" JSONB,
    "introductionSetting" JSONB,
    "protagonistSuggestions" JSONB,
    "suggestedCharacters" JSONB,
    "introductionImage" TEXT,
    "incitingIncidentLocked" BOOLEAN DEFAULT false,
    "typeOfEvent" TEXT,
    "causeOfTheEvent" TEXT,
    "stakesAndConsequences" TEXT,
    "incitingIncidentTone" JSONB,
    "incitingIncidentSetting" JSONB,
    "incitingIncidentExtraDetails" TEXT,
    "incitingIncidentImage" TEXT,
    "firstPlotPointLocked" BOOLEAN DEFAULT false,
    "protagonistGoal" TEXT,
    "protagonistTriggerToAction" TEXT,
    "obstaclesProtagonistWillFace" TEXT,
    "firstPlotPointCharacters" JSONB,
    "firstPlotPointSetting" JSONB,
    "firstPlotPointTone" JSONB,
    "firstPlotPointImage" TEXT,
    "challengesProtagonistFaces" TEXT,
    "protagonistPerspectiveChange" TEXT,
    "majorEventPropellingClimax" TEXT,
    "risingActionAndMidpointCharacters" JSONB,
    "risingActionAndMidpointSetting" JSONB,
    "risingActionAndMidpointTone" JSONB,
    "risingActionAndMidpointExtraDetails" TEXT,
    "risingActionAndMidpointLocked" BOOLEAN DEFAULT false,
    "risingActionAndMidpointImage" TEXT,
    "newObstacles" TEXT,
    "discoveryChanges" TEXT,
    "howStakesEscalate" TEXT,
    "pinchPointsAndSecondPlotPointCharacters" JSONB,
    "pinchPointsAndSecondPlotPointSetting" JSONB,
    "pinchPointsAndSecondPlotPointTone" JSONB,
    "pinchPointsAndSecondPlotPointExtraDetails" TEXT,
    "pinchPointsAndSecondPlotPointLocked" BOOLEAN DEFAULT false,
    "pinchPointsAndSecondPlotPointImage" TEXT,
    "finalChallenge" TEXT,
    "challengeOutcome" TEXT,
    "storyResolution" TEXT,
    "climaxAndFallingActionSetting" JSONB,
    "climaxAndFallingActionTone" JSONB,
    "climaxAndFallingActionExtraDetails" JSONB,
    "climaxAndFallingActionLocked" BOOLEAN DEFAULT false,
    "climaxAndFallingActionImage" TEXT,
    "climaxConsequences" TEXT,
    "howCharactersEvolve" TEXT,
    "resolutionOfConflict" TEXT,
    "resolutionSetting" JSONB,
    "resolutionTone" JSONB,
    "resolutionExtraDetails" JSONB,
    "resolutionLocked" BOOLEAN DEFAULT false,
    "resolutionImage" TEXT,
    "paidAt" TIMESTAMP(3),
    "isPaid" BOOLEAN DEFAULT false,
    "publicId" TEXT,
    "metaData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorySetting" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "typeOfEvent" TEXT,
    "causeOfTheEvent" TEXT,
    "stakesAndConsequences" TEXT,
    "incitingIncidentTone" JSONB,
    "incitingIncidentSetting" TEXT,

    CONSTRAINT "StorySetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryStructure" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "protagonistGoal" JSONB,
    "protagonistGoalSuggestions" JSONB,
    "whoDoesNotHaveProtagonistGoal" TEXT,
    "whoDoesNotHaveProtagonistGoalSuggestions" JSONB,
    "protagonists" JSONB,
    "protagonistSuggestions" JSONB,
    "protagonistGoalObstacle" JSONB,
    "protagonistGoalObstacleSuggestions" JSONB,
    "protagonistWeaknessStrengthSuggestions" JSONB,
    "protagonistGoalMotivationSuggestions" JSONB,
    "settingSuggestions" JSONB,
    "introductionSetting" JSONB,
    "introductionStakes" JSONB,
    "introductionStakesSuggestions" JSONB,
    "introduceProtagonistAndOrdinaryWorld" TEXT,
    "incitingIncident" TEXT,
    "firstPlotPoint" TEXT,
    "risingActionAndMidpoint" TEXT,
    "pinchPointsAndSecondPlotPoint" TEXT,
    "climaxAndFallingAction" TEXT,
    "resolution" TEXT,
    "antagonists" JSONB,
    "antagonistSuggestions" JSONB,
    "antagonisticForce" JSONB,
    "exposition" JSONB,
    "expositionSuggestions" JSONB,
    "expositionCharacters" JSONB,
    "expositionSummary" TEXT,
    "hook" JSONB,
    "hookSuggestions" JSONB,
    "hookCharacters" JSONB,
    "hookSummary" TEXT,
    "incitingEvent" JSONB,
    "incitingEventSuggestions" JSONB,
    "incitingEventCharacters" JSONB,
    "incitingEventSummary" TEXT,
    "protagonistOrdinaryWorld" JSONB,
    "protagonistOrdinaryWorldSuggestions" JSONB,
    "protagonistOrdinaryWorldSummary" JSONB,

    CONSTRAINT "StoryStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlotSuggestion" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "title" TEXT,
    "slug" TEXT,
    "plot" TEXT,

    CONSTRAINT "PlotSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "content" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "image" TEXT,
    "userId" TEXT,
    "storyId" TEXT,
    "source" TEXT,
    "paidAt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scene" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Scene_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "whatTheyWant" JSONB,
    "whoHasIt" JSONB,
    "protagonistGoalSuggestions" JSONB,
    "whoDoesNotHaveProtagonistGoalSuggestions" JSONB,
    "whoDoesNotHaveProtagonistGoal" JSONB,
    "protagonistGoalObstacleSuggestions" JSONB,
    "protagonistGoalObstacle" JSONB,
    "motivationSuggestions" JSONB,
    "isProtagonist" BOOLEAN DEFAULT true,
    "relationshipToProtagonist" TEXT,
    "emotionTriggerEvent" JSONB,
    "emotionTriggerEventsSuggestions" JSONB,
    "howCharacterOvercomeObstacleSuggestions" JSONB,
    "howCharacterOvercomeObstacles" JSONB,
    "howCharacterGoalChangeRelationshipSuggestions" JSONB,
    "howCharacterGoalChangeRelationship" JSONB,
    "howCharacterHasGrownSuggestions" JSONB,
    "howCharacterHasGrown" JSONB,
    "howCharactersGoalsAndPrioritiesChangedSuggestions" JSONB,
    "howCharactersGoalsAndPrioritiesChanged" JSONB,
    "unresolvedIssuesFromDepartureSuggestions" JSONB,
    "unresolvedIssuesFromDeparture" JSONB,
    "motivationsSuggestions" JSONB,
    "personalityTraitsSuggestions" JSONB,
    "skillsSuggestions" JSONB,
    "strengthsSuggestions" JSONB,
    "weaknessesSuggestions" JSONB,
    "coreValueSuggestions" JSONB,
    "conflictAndAngstSuggestions" JSONB,
    "height" TEXT,
    "weight" TEXT,
    "hairTexture" TEXT,
    "hairLength" TEXT,
    "hairQuirk" TEXT,
    "facialHair" TEXT,
    "extraDescription" TEXT,
    "age" TEXT,
    "skinTone" TEXT,
    "hair" TEXT,
    "facialFeatures" TEXT,
    "gender" TEXT,
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
    "imageUrl" TEXT,
    "description" TEXT,
    "summary" TEXT,
    "intelligence" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "unique_id" TEXT NOT NULL,
    "deposit_address" TEXT NOT NULL,
    "locale" TEXT,
    "mode" TEXT,
    "narration" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "usedAt" TIMESTAMP(3),
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "formatAmount" DECIMAL(65,30),
    "currency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "currentChapter" TEXT NOT NULL,
    "hasAccess" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "StoryAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_publicId_key" ON "User"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "Story_publicId_key" ON "Story"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "StorySetting_storyId_key" ON "StorySetting"("storyId");

-- CreateIndex
CREATE UNIQUE INDEX "StoryStructure_storyId_key" ON "StoryStructure"("storyId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_reference_key" ON "Transaction"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_key_key" ON "Transaction"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_unique_id_key" ON "Transaction"("unique_id");

-- CreateIndex
CREATE UNIQUE INDEX "StoryAccess_userId_storyId_key" ON "StoryAccess"("userId", "storyId");

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorySetting" ADD CONSTRAINT "StorySetting_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryStructure" ADD CONSTRAINT "StoryStructure_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlotSuggestion" ADD CONSTRAINT "PlotSuggestion_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scene" ADD CONSTRAINT "Scene_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryAccess" ADD CONSTRAINT "StoryAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryAccess" ADD CONSTRAINT "StoryAccess_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
