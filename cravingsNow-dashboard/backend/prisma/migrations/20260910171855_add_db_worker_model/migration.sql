/*
  Warnings:

  - You are about to drop the column `last_sync_error` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `sync_attempts` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `sync_status` on the `orders` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('Pending', 'Processing', 'Synced', 'Failed');

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "last_sync_error",
DROP COLUMN "sync_attempts",
DROP COLUMN "sync_status";

-- CreateTable
CREATE TABLE "order_sync_jobs" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "status" "SyncStatus" NOT NULL DEFAULT 'Pending',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "max_attempts" INTEGER NOT NULL DEFAULT 5,
    "last_error" TEXT,
    "next_attempt_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_sync_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "order_sync_jobs_order_id_key" ON "order_sync_jobs"("order_id");

-- AddForeignKey
ALTER TABLE "order_sync_jobs" ADD CONSTRAINT "order_sync_jobs_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
