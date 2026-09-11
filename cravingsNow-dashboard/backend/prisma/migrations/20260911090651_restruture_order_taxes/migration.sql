/*
  Warnings:

  - You are about to drop the column `tax_id` on the `order_charge_taxes` table. All the data in the column will be lost.
  - You are about to drop the column `tax_id` on the `order_product_option_taxes` table. All the data in the column will be lost.
  - You are about to drop the column `tax_id` on the `order_product_taxes` table. All the data in the column will be lost.
  - You are about to drop the column `tax_id` on the `order_taxes` table. All the data in the column will be lost.
  - Added the required column `taxGroupId` to the `order_charge_taxes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxGroupId` to the `order_product_option_taxes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxGroupId` to the `order_product_taxes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxGroupId` to the `order_taxes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "order_charge_taxes" DROP CONSTRAINT "order_charge_taxes_tax_id_fkey";

-- DropForeignKey
ALTER TABLE "order_product_option_taxes" DROP CONSTRAINT "order_product_option_taxes_tax_id_fkey";

-- DropForeignKey
ALTER TABLE "order_product_taxes" DROP CONSTRAINT "order_product_taxes_tax_id_fkey";

-- DropForeignKey
ALTER TABLE "order_taxes" DROP CONSTRAINT "order_taxes_tax_id_fkey";

-- AlterTable
ALTER TABLE "order_charge_taxes" DROP COLUMN "tax_id",
ADD COLUMN     "taxGroupId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "order_product_option_taxes" DROP COLUMN "tax_id",
ADD COLUMN     "taxGroupId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "order_product_taxes" DROP COLUMN "tax_id",
ADD COLUMN     "taxGroupId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "order_taxes" DROP COLUMN "tax_id",
ADD COLUMN     "taxGroupId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "order_taxes" ADD CONSTRAINT "order_taxes_taxGroupId_fkey" FOREIGN KEY ("taxGroupId") REFERENCES "tax_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_product_taxes" ADD CONSTRAINT "order_product_taxes_taxGroupId_fkey" FOREIGN KEY ("taxGroupId") REFERENCES "tax_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_product_option_taxes" ADD CONSTRAINT "order_product_option_taxes_taxGroupId_fkey" FOREIGN KEY ("taxGroupId") REFERENCES "tax_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_charge_taxes" ADD CONSTRAINT "order_charge_taxes_taxGroupId_fkey" FOREIGN KEY ("taxGroupId") REFERENCES "tax_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
