/*
  Warnings:

  - A unique constraint covering the columns `[foodicsId]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `charges` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `combos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `coupons` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `customer_addresses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `delivery_zones` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `devices` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `discounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `gift_card_products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `gift_cards` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `inventory_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `menu_groups` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `modifier_options` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `modifiers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `payment_methods` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `promotions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `sections` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `suppliers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `tables` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `tags` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `tax_groups` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `taxes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodicsId]` on the table `timed_events` will be added. If there are existing duplicate values, this will fail.
  - The required column `foodicsId` was added to the `branches` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `foodicsId` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `charges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `combos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `customer_addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `delivery_zones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `discounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `gift_card_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `gift_cards` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `inventory_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `menu_groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `modifier_options` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `modifiers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `payment_methods` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `promotions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `sections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `tables` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `tags` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `tax_groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `taxes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodicsId` to the `timed_events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "branches" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "charges" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "combos" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "coupons" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "customer_addresses" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "delivery_zones" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "devices" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "discounts" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "gift_card_products" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "gift_cards" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "inventory_items" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "menu_groups" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "modifier_options" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "modifiers" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "payment_methods" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "promotions" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sections" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "suppliers" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tables" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tax_groups" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "taxes" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "timed_events" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "categories_foodicsId_key" ON "categories"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "charges_foodicsId_key" ON "charges"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "combos_foodicsId_key" ON "combos"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_foodicsId_key" ON "coupons"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "customer_addresses_foodicsId_key" ON "customer_addresses"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "customers_foodicsId_key" ON "customers"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "delivery_zones_foodicsId_key" ON "delivery_zones"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "devices_foodicsId_key" ON "devices"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "discounts_foodicsId_key" ON "discounts"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "gift_card_products_foodicsId_key" ON "gift_card_products"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "gift_cards_foodicsId_key" ON "gift_cards"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_foodicsId_key" ON "inventory_items"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "menu_groups_foodicsId_key" ON "menu_groups"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "modifier_options_foodicsId_key" ON "modifier_options"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "modifiers_foodicsId_key" ON "modifiers"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_foodicsId_key" ON "orders"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_methods_foodicsId_key" ON "payment_methods"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "products_foodicsId_key" ON "products"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "promotions_foodicsId_key" ON "promotions"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "sections_foodicsId_key" ON "sections"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_foodicsId_key" ON "suppliers"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "tables_foodicsId_key" ON "tables"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "tags_foodicsId_key" ON "tags"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "tax_groups_foodicsId_key" ON "tax_groups"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "taxes_foodicsId_key" ON "taxes"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "timed_events_foodicsId_key" ON "timed_events"("foodicsId");
