-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "digital_order_id" TEXT;

-- AlterTable
ALTER TABLE "VerificationEmail" ALTER COLUMN "expiration_date" SET DEFAULT NOW() + interval '1 day';
