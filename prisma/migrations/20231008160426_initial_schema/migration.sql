/*
  Warnings:

  - The values [USER,ADMIN] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[account_name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `account_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash_password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salt_password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tel` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ORDER_PENDING', 'ORDER_PROCESSED', 'PRINT_PENDING', 'PRINTED', 'DELIVERING', 'DELIVERED', 'REJECTED');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('CUSTOMER', 'MANAGER');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'CUSTOMER';
COMMIT;

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "password",
ADD COLUMN     "account_name" VARCHAR(63) NOT NULL,
ADD COLUMN     "hash_password" VARCHAR(255) NOT NULL,
ADD COLUMN     "profile_name" VARCHAR(63) NOT NULL,
ADD COLUMN     "salt_password" VARCHAR(255) NOT NULL,
ADD COLUMN     "tel" VARCHAR(15) NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'CUSTOMER';

-- CreateTable
CREATE TABLE "Customer" (
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Manager" (
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(63) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "gcode" TEXT NOT NULL,
    "uploadTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadedModel" (
    "model_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "UploadedModel_pkey" PRIMARY KEY ("model_id","user_id")
);

-- CreateTable
CREATE TABLE "DefaultModel" (
    "model_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "likesNo" INTEGER NOT NULL,
    "imageUrl" VARCHAR(255) NOT NULL,

    CONSTRAINT "DefaultModel_pkey" PRIMARY KEY ("model_id")
);

-- CreateTable
CREATE TABLE "Like" (
    "user_id" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("user_id","model_id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "user_id" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("user_id","model_id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "shipping_fee" DOUBLE PRECISION NOT NULL,
    "est_deli_time" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ORDER_PENDING',
    "district" VARCHAR(31) NOT NULL,
    "ward" VARCHAR(31) NOT NULL,
    "street" VARCHAR(31) NOT NULL,
    "streetNo" VARCHAR(31) NOT NULL,
    "creation_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPaid" BOOLEAN NOT NULL,
    "extra_note" VARCHAR(255),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "item_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "name" VARCHAR(63) NOT NULL,
    "gcode" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "imageUrl" VARCHAR(255) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("item_id","order_id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_user_id_key" ON "Customer"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Manager_user_id_key" ON "Manager"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UploadedModel_model_id_key" ON "UploadedModel"("model_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_account_name_key" ON "User"("account_name");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedModel" ADD CONSTRAINT "UploadedModel_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedModel" ADD CONSTRAINT "UploadedModel_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Customer"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefaultModel" ADD CONSTRAINT "DefaultModel_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefaultModel" ADD CONSTRAINT "DefaultModel_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Customer"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "DefaultModel"("model_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Customer"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Customer"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
