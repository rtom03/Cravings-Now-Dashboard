/*
  Warnings:

  - A unique constraint covering the columns `[idempotencyKey]` on the table `customer_orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "customer_orders" ADD COLUMN     "idempotencyKey" TEXT,
ADD COLUMN     "paystackAuthUrl" TEXT,
ADD COLUMN     "requestHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "customer_orders_idempotencyKey_key" ON "customer_orders"("idempotencyKey");
