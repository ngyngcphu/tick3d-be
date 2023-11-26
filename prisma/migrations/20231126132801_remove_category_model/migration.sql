/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DefaultModel" DROP CONSTRAINT "DefaultModel_category_id_fkey";

-- AlterTable
ALTER TABLE "VerificationEmail" ALTER COLUMN "expiration_date" SET DEFAULT NOW() + interval '1 day';

-- DropTable
DROP TABLE "Category";
