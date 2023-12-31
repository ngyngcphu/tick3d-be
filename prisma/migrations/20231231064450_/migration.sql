/*
  Warnings:

  - You are about to drop the column `joinedAt` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `joinedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "joinedAt";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "VerificationEmail" ALTER COLUMN "expiration_time" SET DEFAULT NOW() + interval '5 minutes';
