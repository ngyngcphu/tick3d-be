-- CreateTable
CREATE TABLE "VerificationEmail" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expiration_date" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '1 day',

    CONSTRAINT "VerificationEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationEmail_user_id_key" ON "VerificationEmail"("user_id");

-- AddForeignKey
ALTER TABLE "VerificationEmail" ADD CONSTRAINT "VerificationEmail_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
