-- AlterTable
ALTER TABLE "VerificationEmail" ALTER COLUMN "expiration_time" SET DEFAULT NOW() + interval '5 minutes';
