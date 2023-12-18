/*
  Warnings:

  - You are about to drop the column `expiration_date` on the `VerificationEmail` table. All the data in the column will be lost.
  - Added the required column `otp` to the `VerificationEmail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VerificationEmail" DROP COLUMN "expiration_date",
ADD COLUMN     "expiration_time" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '5 minutes',
ADD COLUMN     "otp" TEXT NOT NULL;
