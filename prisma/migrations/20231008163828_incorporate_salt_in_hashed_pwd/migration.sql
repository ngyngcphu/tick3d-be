/*
  Warnings:

  - You are about to drop the column `hash_password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `salt_password` on the `User` table. All the data in the column will be lost.
  - Added the required column `password_sh` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "hash_password",
DROP COLUMN "salt_password",
ADD COLUMN     "password_sh" VARCHAR(255) NOT NULL;
