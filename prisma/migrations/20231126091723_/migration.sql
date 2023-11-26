/*
  Warnings:

  - The `subImageUrls` column on the `DefaultModel` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DefaultModel" DROP COLUMN "subImageUrls",
ADD COLUMN     "subImageUrls" VARCHAR(255)[];

-- AlterTable
ALTER TABLE "VerificationEmail" ALTER COLUMN "expiration_date" SET DEFAULT NOW() + interval '1 day';
