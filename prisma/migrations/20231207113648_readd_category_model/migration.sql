-- AlterTable
ALTER TABLE "VerificationEmail" ALTER COLUMN "expiration_date" SET DEFAULT NOW() + interval '1 day';

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DefaultModel" ADD CONSTRAINT "DefaultModel_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
