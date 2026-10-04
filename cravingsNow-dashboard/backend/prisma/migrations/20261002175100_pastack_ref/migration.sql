/*
  Warnings:

  - A unique constraint covering the columns `[paystack_reference]` on the table `customer_orders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Pending', 'Paid', 'Failed');

-- AlterTable
ALTER TABLE "customer_orders" ADD COLUMN     "payment_status" "PaymentStatus" NOT NULL DEFAULT 'Pending',
ADD COLUMN     "paystack_reference" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "customer_orders_paystack_reference_key" ON "customer_orders"("paystack_reference");
