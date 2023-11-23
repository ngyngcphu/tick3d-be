/*
  Warnings:

  - You are about to drop the column `profile_name` on the `User` table. All the data in the column will be lost.
  - Added the required column `first_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "profile_name",
ADD COLUMN     "first_name" VARCHAR(63) NOT NULL,
ADD COLUMN     "last_name" VARCHAR(63) NOT NULL;

-- AlterTable
ALTER TABLE "VerificationEmail" ALTER COLUMN "expiration_date" SET DEFAULT NOW() + interval '1 day';
