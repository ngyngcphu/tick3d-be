/*
  Warnings:

  - Added the required column `joinedAt` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "VerificationEmail" ALTER COLUMN "expiration_time" SET DEFAULT NOW() + interval '5 minutes';
