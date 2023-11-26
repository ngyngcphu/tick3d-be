/*
  Warnings:

  - Added the required column `subImageUrls` to the `DefaultModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DefaultModel" ADD COLUMN     "subImageUrls" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "VerificationEmail" ALTER COLUMN "expiration_date" SET DEFAULT NOW() + interval '1 day';

-- CreateTable
CREATE TABLE "ModelPromotion" (
    "model_id" TEXT NOT NULL,
    "discount" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ModelPromotion_model_id_key" ON "ModelPromotion"("model_id");

-- AddForeignKey
ALTER TABLE "ModelPromotion" ADD CONSTRAINT "ModelPromotion_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
