-- CreateEnum
CREATE TYPE "statusType" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILURE');

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "status" "statusType" NOT NULL,
    "submissionId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Submission_id_key" ON "Submission"("id");
