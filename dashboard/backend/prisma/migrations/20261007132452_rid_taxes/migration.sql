/*
  Warnings:

  - You are about to drop the column `tax_group_id` on the `GroupProducts` table. All the data in the column will be lost.
  - You are about to drop the column `tax_group_id` on the `branches` table. All the data in the column will be lost.
  - You are about to drop the column `tax_group_id` on the `modifier_options` table. All the data in the column will be lost.
  - You are about to drop the column `tax_exclusive_discount_amount` on the `order_product_options` table. All the data in the column will be lost.
  - You are about to drop the column `tax_exclusive_total_price` on the `order_product_options` table. All the data in the column will be lost.
  - You are about to drop the column `tax_exclusive_unit_price` on the `order_product_options` table. All the data in the column will be lost.
  - You are about to drop the column `tax_exclusive_discount_amount` on the `order_products` table. All the data in the column will be lost.
  - You are about to drop the column `tax_exclusive_total_price` on the `order_products` table. All the data in the column will be lost.
  - You are about to drop the column `tax_exclusive_unit_price` on the `order_products` table. All the data in the column will be lost.
  - You are about to drop the `order_charge_taxes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_product_option_taxes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_product_taxes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_taxes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tax_groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `taxes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GroupProducts" DROP CONSTRAINT "GroupProducts_tax_group_id_fkey";

-- DropForeignKey
ALTER TABLE "branches" DROP CONSTRAINT "branches_tax_group_id_fkey";

-- DropForeignKey
ALTER TABLE "modifier_options" DROP CONSTRAINT "modifier_options_tax_group_id_fkey";

-- DropForeignKey
ALTER TABLE "order_charge_taxes" DROP CONSTRAINT "order_charge_taxes_order_charge_id_fkey";

-- DropForeignKey
ALTER TABLE "order_charge_taxes" DROP CONSTRAINT "order_charge_taxes_taxGroupId_fkey";

-- DropForeignKey
ALTER TABLE "order_product_option_taxes" DROP CONSTRAINT "order_product_option_taxes_order_product_option_id_fkey";

-- DropForeignKey
ALTER TABLE "order_product_option_taxes" DROP CONSTRAINT "order_product_option_taxes_taxGroupId_fkey";

-- DropForeignKey
ALTER TABLE "order_product_taxes" DROP CONSTRAINT "order_product_taxes_order_product_id_fkey";

-- DropForeignKey
ALTER TABLE "order_product_taxes" DROP CONSTRAINT "order_product_taxes_taxGroupId_fkey";

-- DropForeignKey
ALTER TABLE "order_taxes" DROP CONSTRAINT "order_taxes_order_id_fkey";

-- DropForeignKey
ALTER TABLE "order_taxes" DROP CONSTRAINT "order_taxes_taxGroupId_fkey";

-- DropForeignKey
ALTER TABLE "taxes" DROP CONSTRAINT "taxes_taxGroupId_fkey";

-- AlterTable
ALTER TABLE "GroupProducts" DROP COLUMN "tax_group_id";

-- AlterTable
ALTER TABLE "branches" DROP COLUMN "tax_group_id";

-- AlterTable
ALTER TABLE "modifier_options" DROP COLUMN "tax_group_id";

-- AlterTable
ALTER TABLE "order_product_options" DROP COLUMN "tax_exclusive_discount_amount",
DROP COLUMN "tax_exclusive_total_price",
DROP COLUMN "tax_exclusive_unit_price";

-- AlterTable
ALTER TABLE "order_products" DROP COLUMN "tax_exclusive_discount_amount",
DROP COLUMN "tax_exclusive_total_price",
DROP COLUMN "tax_exclusive_unit_price";

-- DropTable
DROP TABLE "order_charge_taxes";

-- DropTable
DROP TABLE "order_product_option_taxes";

-- DropTable
DROP TABLE "order_product_taxes";

-- DropTable
DROP TABLE "order_taxes";

-- DropTable
DROP TABLE "tax_groups";

-- DropTable
DROP TABLE "taxes";
