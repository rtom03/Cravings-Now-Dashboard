/*
  Warnings:

  - You are about to drop the column `delay_in_seconds` on the `order_products` table. All the data in the column will be lost.
  - You are about to drop the column `is_ingredients_returned` on the `order_products` table. All the data in the column will be lost.
  - You are about to drop the column `is_ingredients_wasted` on the `order_products` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `order_products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order_products" DROP COLUMN "delay_in_seconds",
DROP COLUMN "is_ingredients_returned",
DROP COLUMN "is_ingredients_wasted",
DROP COLUMN "status";

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "GroupProducts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
