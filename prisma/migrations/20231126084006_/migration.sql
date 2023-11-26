-- AlterTable
ALTER TABLE "Model" ALTER COLUMN "boughtAmount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "VerificationEmail" ALTER COLUMN "expiration_date" SET DEFAULT NOW() + interval '1 day';
