-- Safe sync: run in Supabase SQL Editor if prisma db push fails
-- Creates missing tables without dropping existing data

CREATE TABLE IF NOT EXISTS "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scoringWeights" JSONB,
    "webhookUrl" TEXT,
    "brandName" TEXT,
    "brandLogoUrl" TEXT,
    "onboardingDone" BOOLEAN NOT NULL DEFAULT false,
    "notifyOnComplete" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "UserSettings_userId_key" ON "UserSettings"("userId");

DO $$ BEGIN
  ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Team_slug_key" ON "Team"("slug");

DO $$ BEGIN
  ALTER TABLE "Team" ADD CONSTRAINT "Team_ownerId_fkey"
    FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "TeamMember" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "TeamMember_teamId_userId_key" ON "TeamMember"("teamId", "userId");

DO $$ BEGIN
  ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey"
    FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "ApiKey" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "keyPrefix" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT,
    "lastUsed" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ApiKey_keyHash_key" ON "ApiKey"("keyHash");

DO $$ BEGIN
  ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_teamId_fkey"
    FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "ScheduledAudit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "nextRunAt" TIMESTAMP(3) NOT NULL,
    "lastRunAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ScheduledAudit_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  ALTER TABLE "ScheduledAudit" ADD CONSTRAINT "ScheduledAudit_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

DO $$ BEGIN
  ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "SharedAudit" (
    "id" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SharedAudit_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "SharedAudit_auditId_key" ON "SharedAudit"("auditId");
CREATE UNIQUE INDEX IF NOT EXISTS "SharedAudit_token_key" ON "SharedAudit"("token");

DO $$ BEGIN
  ALTER TABLE "SharedAudit" ADD CONSTRAINT "SharedAudit_auditId_fkey"
    FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "BulkJob" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "urls" JSONB NOT NULL,
    "results" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BulkJob_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  ALTER TABLE "BulkJob" ADD CONSTRAINT "BulkJob_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Audit extra columns
ALTER TABLE "Audit" ADD COLUMN IF NOT EXISTS "progress" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Audit" ADD COLUMN IF NOT EXISTS "progressMsg" TEXT;
ALTER TABLE "Audit" ADD COLUMN IF NOT EXISTS "title" TEXT;
ALTER TABLE "Audit" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "Audit" ADD COLUMN IF NOT EXISTS "wordCount" INTEGER;
ALTER TABLE "Audit" ADD COLUMN IF NOT EXISTS "eeatScore" DOUBLE PRECISION;
ALTER TABLE "Audit" ADD COLUMN IF NOT EXISTS "contentStructureScore" DOUBLE PRECISION;
ALTER TABLE "Audit" ADD COLUMN IF NOT EXISTS "internalLinkScore" DOUBLE PRECISION;
ALTER TABLE "Audit" ADD COLUMN IF NOT EXISTS "readabilityScore" DOUBLE PRECISION;
ALTER TABLE "Audit" ADD COLUMN IF NOT EXISTS "faqScore" DOUBLE PRECISION;
ALTER TABLE "Audit" ADD COLUMN IF NOT EXISTS "scoreBreakdown" JSONB;
ALTER TABLE "Audit" ADD COLUMN IF NOT EXISTS "recommendations" JSONB;
ALTER TABLE "Audit" ADD COLUMN IF NOT EXISTS "crawlData" JSONB;
ALTER TABLE "Audit" ADD COLUMN IF NOT EXISTS "robotsData" JSONB;
ALTER TABLE "Audit" ADD COLUMN IF NOT EXISTS "webVitals" JSONB;
ALTER TABLE "Audit" ADD COLUMN IF NOT EXISTS "languageData" JSONB;

-- Project teamId
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "teamId" TEXT;

-- Session better-auth columns
ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "token" TEXT;
ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX IF NOT EXISTS "session_token_key" ON "session"("token");

-- Verification columns
ALTER TABLE "verification" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "verification" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX IF NOT EXISTS "Audit_projectId_createdAt_idx" ON "Audit"("projectId", "createdAt");
