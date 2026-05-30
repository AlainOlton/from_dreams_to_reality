-- Add optional columns first (no constraint issues)
ALTER TABLE "logbook_entries"
  ADD COLUMN "absenceReason"  TEXT,
  ADD COLUMN "finalReportUrl" TEXT;

-- Add internshipSite with a temporary default so existing rows get a value
ALTER TABLE "logbook_entries"
  ADD COLUMN "internshipSite" TEXT NOT NULL DEFAULT 'Not specified';

-- Remove the default so future inserts must supply a value explicitly
ALTER TABLE "logbook_entries"
  ALTER COLUMN "internshipSite" DROP DEFAULT;

-- Backfill NULL values in the three fields that are becoming required
UPDATE "logbook_entries"
  SET "skillsGained" = 'Not recorded'
  WHERE "skillsGained" IS NULL;

UPDATE "logbook_entries"
  SET "challenges" = 'Not recorded'
  WHERE "challenges" IS NULL;

UPDATE "logbook_entries"
  SET "nextWeekPlan" = 'Not recorded'
  WHERE "nextWeekPlan" IS NULL;

-- Now make those columns NOT NULL
ALTER TABLE "logbook_entries"
  ALTER COLUMN "skillsGained" SET NOT NULL,
  ALTER COLUMN "challenges"   SET NOT NULL,
  ALTER COLUMN "nextWeekPlan" SET NOT NULL;
