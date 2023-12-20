-- AlterTable
ALTER TABLE "DefaultModel" ALTER COLUMN "likesNo" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "VerificationEmail" ALTER COLUMN "expiration_time" SET DEFAULT NOW() + interval '5 minutes';
