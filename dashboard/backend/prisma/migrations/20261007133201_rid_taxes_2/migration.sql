/*
  Warnings:

  - You are about to drop the column `tax_exclusive_discount_amount` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "tax_exclusive_discount_amount";
