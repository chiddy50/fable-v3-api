-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "name" TEXT,
    "gender" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "bio" TEXT,
    "publicId" TEXT,
    "primaryWalletAddress" TEXT,
    "publicKey" TEXT,
    "depositAddress" TEXT,
    "tipLink" TEXT,
    "imageUrl" TEXT,
    "backgroundImage" TEXT,
    "averageRating" DOUBLE PRECISION,
    "totalRatings" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialMedia" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "x" TEXT,
    "instagram" TEXT,
    "discord" TEXT,
    "tiktok" TEXT,
    "facebook" TEXT,
    "youtube" TEXT,
    "linkedin" TEXT,
    "github" TEXT,
    "website" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialMedia_pkey" PRIMARY KEY ("id")
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
    "imageStatus" TEXT,
    "imageId" TEXT,
    "type" TEXT,
    "overview" TEXT,
    "writingStep" INTEGER DEFAULT 1,
    "duration" TEXT,
    "averageRating" DOUBLE PRECISION,
    "totalRatings" INTEGER NOT NULL DEFAULT 0,
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
    "introductionCharacters" JSONB,
    "protagonistSuggestions" JSONB,
    "suggestedCharacters" JSONB,
    "introductionImage" TEXT,
    "incitingIncidentLocked" BOOLEAN DEFAULT false,
    "typeOfEvent" TEXT,
    "causeOfTheEvent" TEXT,
    "stakesAndConsequences" TEXT,
    "incitingIncidentTone" JSONB,
    "incitingIncidentCharacters" JSONB,
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
    "climaxAndFallingActionCharacters" JSONB,
    "climaxAndFallingActionExtraDetails" JSONB,
    "climaxAndFallingActionLocked" BOOLEAN DEFAULT false,
    "climaxAndFallingActionImage" TEXT,
    "climaxConsequences" TEXT,
    "howCharactersEvolve" TEXT,
    "resolutionOfConflict" TEXT,
    "resolutionCharacters" JSONB,
    "resolutionSetting" JSONB,
    "resolutionTone" JSONB,
    "resolutionExtraDetails" JSONB,
    "resolutionLocked" BOOLEAN DEFAULT false,
    "resolutionImage" TEXT,
    "paidAt" TIMESTAMP(3),
    "isPaid" BOOLEAN DEFAULT false,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "price" DOUBLE PRECISION,
    "freeUntil" INTEGER NOT NULL DEFAULT 2,
    "accessEnd" INTEGER NOT NULL DEFAULT 7,
    "publicId" TEXT,
    "metaData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "index" INTEGER,
    "readersHasAccess" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT,
    "description" TEXT,
    "duration" TEXT,
    "characters" JSONB,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT,
    "image" TEXT,
    "paywall" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT,
    "publishedAt" TIMESTAMP(3),
    "releaseDate" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryStructure" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "introduceProtagonistAndOrdinaryWorld" TEXT,
    "incitingIncident" TEXT,
    "firstPlotPoint" TEXT,
    "risingActionAndMidpoint" TEXT,
    "pinchPointsAndSecondPlotPoint" TEXT,
    "climaxAndFallingAction" TEXT,
    "resolution" TEXT,
    "introductionSummary" TEXT,
    "incitingIncidentSummary" TEXT,
    "firstPlotPointSummary" TEXT,
    "risingActionAndMidpointSummary" TEXT,
    "pinchPointsAndSecondPlotPointSummary" TEXT,
    "climaxAndFallingActionSummary" TEXT,
    "resolutionSummary" TEXT,
    "antagonists" JSONB,
    "antagonistSuggestions" JSONB,

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
    "ownerId" TEXT NOT NULL,
    "ownerType" TEXT NOT NULL,
    "userId" TEXT,
    "url" TEXT,
    "image" TEXT,
    "imageStatus" TEXT,
    "publicId" TEXT,
    "signature" TEXT,
    "description" TEXT,
    "meta" JSONB,
    "source" TEXT,
    "origin" TEXT,
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
    "updatedAt" TIMESTAMP(3) NOT NULL,

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
    "formatAmount" DOUBLE PRECISION,
    "currency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "currentChapter" TEXT NOT NULL,
    "hasAccess" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoryAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryGenre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "StoryGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenresOnStories" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "storyGenreId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GenresOnStories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT,
    "limit" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetTransaction" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "reference" TEXT,
    "userId" TEXT NOT NULL,
    "storyId" TEXT,
    "assetId" TEXT NOT NULL,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "totalPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" JSONB,
    "excerpt" TEXT,
    "type" TEXT,
    "coverImage" TEXT,
    "likeCount" INTEGER DEFAULT 0,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "price" DOUBLE PRECISION,
    "averageRating" DOUBLE PRECISION,
    "totalRatings" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleLike" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "hasAccess" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticleAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagsOnArticle" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TagsOnArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "replyCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "replyCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleTransaction" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "unique_id" TEXT NOT NULL,
    "deposit_address" TEXT NOT NULL,
    "locale" TEXT,
    "mode" TEXT,
    "narration" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "formatAmount" DOUBLE PRECISION,
    "currency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "key" TEXT,
    "unique_id" TEXT,
    "deposit_address" TEXT,
    "locale" TEXT,
    "mode" TEXT,
    "narration" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "type" TEXT,
    "status" TEXT,
    "amount" TEXT NOT NULL,
    "formatAmount" DOUBLE PRECISION,
    "currency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleRating" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" SMALLINT NOT NULL,
    "review" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryRating" (
    "id" TEXT NOT NULL,
    "rating" SMALLINT NOT NULL,
    "review" TEXT,
    "userId" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_publicId_key" ON "User"("publicId");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name");

-- CreateIndex
CREATE INDEX "User_totalRatings_idx" ON "User"("totalRatings");

-- CreateIndex
CREATE INDEX "User_averageRating_idx" ON "User"("averageRating");

-- CreateIndex
CREATE INDEX "User_gender_idx" ON "User"("gender");

-- CreateIndex
CREATE INDEX "User_firstName_lastName_idx" ON "User"("firstName", "lastName");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "User_primaryWalletAddress_idx" ON "User"("primaryWalletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "SocialMedia_userId_key" ON "SocialMedia"("userId");

-- CreateIndex
CREATE INDEX "SocialMedia_instagram_idx" ON "SocialMedia"("instagram");

-- CreateIndex
CREATE INDEX "SocialMedia_x_idx" ON "SocialMedia"("x");

-- CreateIndex
CREATE UNIQUE INDEX "Story_slug_key" ON "Story"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Story_publicId_key" ON "Story"("publicId");

-- CreateIndex
CREATE INDEX "Story_userId_publishedAt_idx" ON "Story"("userId", "publishedAt");

-- CreateIndex
CREATE INDEX "Story_type_publishedAt_idx" ON "Story"("type", "publishedAt");

-- CreateIndex
CREATE INDEX "Story_isPaid_isFree_publishedAt_idx" ON "Story"("isPaid", "isFree", "publishedAt");

-- CreateIndex
CREATE INDEX "Story_writingStep_updatedAt_idx" ON "Story"("writingStep", "updatedAt");

-- CreateIndex
CREATE INDEX "Story_projectTitle_idx" ON "Story"("projectTitle");

-- CreateIndex
CREATE INDEX "Story_title_idx" ON "Story"("title");

-- CreateIndex
CREATE INDEX "Story_isFree_idx" ON "Story"("isFree");

-- CreateIndex
CREATE INDEX "Story_type_status_publishedAt_idx" ON "Story"("type", "status", "publishedAt");

-- CreateIndex
CREATE INDEX "Story_price_publishedAt_idx" ON "Story"("price", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "StoryStructure_storyId_key" ON "StoryStructure"("storyId");

-- CreateIndex
CREATE INDEX "Image_ownerId_ownerType_idx" ON "Image"("ownerId", "ownerType");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_reference_key" ON "Transaction"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_key_key" ON "Transaction"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_unique_id_key" ON "Transaction"("unique_id");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_storyId_idx" ON "Transaction"("storyId");

-- CreateIndex
CREATE UNIQUE INDEX "StoryAccess_userId_storyId_key" ON "StoryAccess"("userId", "storyId");

-- CreateIndex
CREATE UNIQUE INDEX "StoryGenre_name_key" ON "StoryGenre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GenresOnStories_storyId_storyGenreId_key" ON "GenresOnStories"("storyId", "storyGenreId");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_name_key" ON "Asset"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_code_key" ON "Asset"("code");

-- CreateIndex
CREATE INDEX "AssetTransaction_userId_assetId_idx" ON "AssetTransaction"("userId", "assetId");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "Article_publishedAt_isPaid_isFree_idx" ON "Article"("publishedAt" DESC, "isPaid", "isFree");

-- CreateIndex
CREATE INDEX "Article_userId_publishedAt_idx" ON "Article"("userId", "publishedAt" DESC);

-- CreateIndex
CREATE INDEX "Article_type_publishedAt_idx" ON "Article"("type", "publishedAt" DESC);

-- CreateIndex
CREATE INDEX "Article_price_publishedAt_idx" ON "Article"("price", "publishedAt" DESC);

-- CreateIndex
CREATE INDEX "Article_likeCount_publishedAt_idx" ON "Article"("likeCount" DESC, "publishedAt");

-- CreateIndex
CREATE INDEX "ArticleLike_userId_idx" ON "ArticleLike"("userId");

-- CreateIndex
CREATE INDEX "ArticleLike_articleId_idx" ON "ArticleLike"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleLike_articleId_userId_key" ON "ArticleLike"("articleId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleAccess_userId_articleId_key" ON "ArticleAccess"("userId", "articleId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_title_key" ON "Tag"("title");

-- CreateIndex
CREATE UNIQUE INDEX "TagsOnArticle_articleId_tagId_key" ON "TagsOnArticle"("articleId", "tagId");

-- CreateIndex
CREATE INDEX "ArticleComment_articleId_idx" ON "ArticleComment"("articleId");

-- CreateIndex
CREATE INDEX "ArticleComment_userId_idx" ON "ArticleComment"("userId");

-- CreateIndex
CREATE INDEX "ArticleComment_parentId_idx" ON "ArticleComment"("parentId");

-- CreateIndex
CREATE INDEX "StoryComment_storyId_idx" ON "StoryComment"("storyId");

-- CreateIndex
CREATE INDEX "StoryComment_userId_idx" ON "StoryComment"("userId");

-- CreateIndex
CREATE INDEX "StoryComment_parentId_idx" ON "StoryComment"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleTransaction_reference_key" ON "ArticleTransaction"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleTransaction_key_key" ON "ArticleTransaction"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleTransaction_unique_id_key" ON "ArticleTransaction"("unique_id");

-- CreateIndex
CREATE INDEX "ArticleTransaction_type_idx" ON "ArticleTransaction"("type");

-- CreateIndex
CREATE INDEX "ArticleTransaction_status_idx" ON "ArticleTransaction"("status");

-- CreateIndex
CREATE INDEX "ArticleTransaction_userId_idx" ON "ArticleTransaction"("userId");

-- CreateIndex
CREATE INDEX "ArticleTransaction_articleId_idx" ON "ArticleTransaction"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_reference_key" ON "Payment"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_key_key" ON "Payment"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_unique_id_key" ON "Payment"("unique_id");

-- CreateIndex
CREATE INDEX "Payment_type_idx" ON "Payment"("type");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

-- CreateIndex
CREATE INDEX "ArticleRating_articleId_idx" ON "ArticleRating"("articleId");

-- CreateIndex
CREATE INDEX "ArticleRating_rating_idx" ON "ArticleRating"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleRating_userId_articleId_key" ON "ArticleRating"("userId", "articleId");

-- CreateIndex
CREATE INDEX "StoryRating_storyId_idx" ON "StoryRating"("storyId");

-- CreateIndex
CREATE INDEX "StoryRating_rating_idx" ON "StoryRating"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "StoryRating_userId_storyId_key" ON "StoryRating"("userId", "storyId");

-- AddForeignKey
ALTER TABLE "SocialMedia" ADD CONSTRAINT "SocialMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryStructure" ADD CONSTRAINT "StoryStructure_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlotSuggestion" ADD CONSTRAINT "PlotSuggestion_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "GenresOnStories" ADD CONSTRAINT "GenresOnStories_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenresOnStories" ADD CONSTRAINT "GenresOnStories_storyGenreId_fkey" FOREIGN KEY ("storyGenreId") REFERENCES "StoryGenre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetTransaction" ADD CONSTRAINT "AssetTransaction_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetTransaction" ADD CONSTRAINT "AssetTransaction_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleLike" ADD CONSTRAINT "ArticleLike_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleLike" ADD CONSTRAINT "ArticleLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleAccess" ADD CONSTRAINT "ArticleAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleAccess" ADD CONSTRAINT "ArticleAccess_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnArticle" ADD CONSTRAINT "TagsOnArticle_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnArticle" ADD CONSTRAINT "TagsOnArticle_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleComment" ADD CONSTRAINT "ArticleComment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleComment" ADD CONSTRAINT "ArticleComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleComment" ADD CONSTRAINT "ArticleComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ArticleComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryComment" ADD CONSTRAINT "StoryComment_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryComment" ADD CONSTRAINT "StoryComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryComment" ADD CONSTRAINT "StoryComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "StoryComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleTransaction" ADD CONSTRAINT "ArticleTransaction_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleTransaction" ADD CONSTRAINT "ArticleTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleRating" ADD CONSTRAINT "ArticleRating_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleRating" ADD CONSTRAINT "ArticleRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryRating" ADD CONSTRAINT "StoryRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryRating" ADD CONSTRAINT "StoryRating_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
