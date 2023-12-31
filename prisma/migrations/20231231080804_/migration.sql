-- AlterTable
ALTER TABLE "User" ALTER COLUMN "joinedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "VerificationEmail" ALTER COLUMN "expiration_time" SET DEFAULT NOW() + interval '5 minutes';
