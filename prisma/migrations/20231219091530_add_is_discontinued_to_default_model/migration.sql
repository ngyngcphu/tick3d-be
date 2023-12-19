-- AlterTable
ALTER TABLE "DefaultModel" ADD COLUMN     "isDiscontinued" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "VerificationEmail" ALTER COLUMN "expiration_time" SET DEFAULT NOW() + interval '5 minutes';
