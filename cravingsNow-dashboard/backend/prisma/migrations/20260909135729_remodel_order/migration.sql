/*
  Warnings:

  - You are about to drop the column `tips` on the `order_payments` table. All the data in the column will be lost.
  - You are about to drop the column `void_reason` on the `order_products` table. All the data in the column will be lost.
  - The `status` column on the `order_products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `coupon_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `discount_type` on the `orders` table. All the data in the column will be lost.
  - The `source` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `_BranchTimedEvents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CategoryTimedEvents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ComboMenuGroups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ComboTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ComboTimedEvents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ComboToDiscount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_InventoryItemTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MenuGroupGiftCardProducts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OrderComboProductTimedEvents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OrderProductTimedEvents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductDiscounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductMenuGroups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductTimedEvents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PromotionCombos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PromotionProducts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PromotionRewardCombos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PromotionRewardProducts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SupplierTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TimedEventTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `combo_branches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `combo_item_option_size_branches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `combo_item_option_sizes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `combo_item_options` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `combo_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `combo_sizes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `combos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventory_item_branches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventory_item_suppliers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventory_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `menu_groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `modifier_option_ingredients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_combo_product_option_taxes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_combo_product_options` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_combo_product_taxes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_combo_products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_combos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_branches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_ingredients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `suppliers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `timed_events` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "OrderSource" AS ENUM ('Cashier', 'API', 'Call_Center');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Pending', 'Active', 'Declined', 'Closed', 'Returned', 'Joined', 'Void', 'Draft');

-- CreateEnum
CREATE TYPE "Discounts_Types" AS ENUM ('Open', 'Predefined', 'Coupon', 'Loyalty', 'Promotion');

-- CreateEnum
CREATE TYPE "Product_Status" AS ENUM ('Pending', 'Active', 'Closed', 'Moved', 'Void', 'Returned', 'Declined');

-- CreateEnum
CREATE TYPE "ProductReason" AS ENUM ('Order_Void', 'Inventory', 'Drawer_Operation');

-- DropForeignKey
ALTER TABLE "_BranchTimedEvents" DROP CONSTRAINT "_BranchTimedEvents_A_fkey";

-- DropForeignKey
ALTER TABLE "_BranchTimedEvents" DROP CONSTRAINT "_BranchTimedEvents_B_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryTimedEvents" DROP CONSTRAINT "_CategoryTimedEvents_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryTimedEvents" DROP CONSTRAINT "_CategoryTimedEvents_B_fkey";

-- DropForeignKey
ALTER TABLE "_ComboMenuGroups" DROP CONSTRAINT "_ComboMenuGroups_A_fkey";

-- DropForeignKey
ALTER TABLE "_ComboMenuGroups" DROP CONSTRAINT "_ComboMenuGroups_B_fkey";

-- DropForeignKey
ALTER TABLE "_ComboTags" DROP CONSTRAINT "_ComboTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_ComboTags" DROP CONSTRAINT "_ComboTags_B_fkey";

-- DropForeignKey
ALTER TABLE "_ComboTimedEvents" DROP CONSTRAINT "_ComboTimedEvents_A_fkey";

-- DropForeignKey
ALTER TABLE "_ComboTimedEvents" DROP CONSTRAINT "_ComboTimedEvents_B_fkey";

-- DropForeignKey
ALTER TABLE "_ComboToDiscount" DROP CONSTRAINT "_ComboToDiscount_A_fkey";

-- DropForeignKey
ALTER TABLE "_ComboToDiscount" DROP CONSTRAINT "_ComboToDiscount_B_fkey";

-- DropForeignKey
ALTER TABLE "_InventoryItemTags" DROP CONSTRAINT "_InventoryItemTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_InventoryItemTags" DROP CONSTRAINT "_InventoryItemTags_B_fkey";

-- DropForeignKey
ALTER TABLE "_MenuGroupGiftCardProducts" DROP CONSTRAINT "_MenuGroupGiftCardProducts_A_fkey";

-- DropForeignKey
ALTER TABLE "_MenuGroupGiftCardProducts" DROP CONSTRAINT "_MenuGroupGiftCardProducts_B_fkey";

-- DropForeignKey
ALTER TABLE "_OrderComboProductTimedEvents" DROP CONSTRAINT "_OrderComboProductTimedEvents_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderComboProductTimedEvents" DROP CONSTRAINT "_OrderComboProductTimedEvents_B_fkey";

-- DropForeignKey
ALTER TABLE "_OrderProductTimedEvents" DROP CONSTRAINT "_OrderProductTimedEvents_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderProductTimedEvents" DROP CONSTRAINT "_OrderProductTimedEvents_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductDiscounts" DROP CONSTRAINT "_ProductDiscounts_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductDiscounts" DROP CONSTRAINT "_ProductDiscounts_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductMenuGroups" DROP CONSTRAINT "_ProductMenuGroups_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductMenuGroups" DROP CONSTRAINT "_ProductMenuGroups_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductTags" DROP CONSTRAINT "_ProductTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductTags" DROP CONSTRAINT "_ProductTags_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductTimedEvents" DROP CONSTRAINT "_ProductTimedEvents_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductTimedEvents" DROP CONSTRAINT "_ProductTimedEvents_B_fkey";

-- DropForeignKey
ALTER TABLE "_PromotionCombos" DROP CONSTRAINT "_PromotionCombos_A_fkey";

-- DropForeignKey
ALTER TABLE "_PromotionCombos" DROP CONSTRAINT "_PromotionCombos_B_fkey";

-- DropForeignKey
ALTER TABLE "_PromotionProducts" DROP CONSTRAINT "_PromotionProducts_A_fkey";

-- DropForeignKey
ALTER TABLE "_PromotionProducts" DROP CONSTRAINT "_PromotionProducts_B_fkey";

-- DropForeignKey
ALTER TABLE "_PromotionRewardCombos" DROP CONSTRAINT "_PromotionRewardCombos_A_fkey";

-- DropForeignKey
ALTER TABLE "_PromotionRewardCombos" DROP CONSTRAINT "_PromotionRewardCombos_B_fkey";

-- DropForeignKey
ALTER TABLE "_PromotionRewardProducts" DROP CONSTRAINT "_PromotionRewardProducts_A_fkey";

-- DropForeignKey
ALTER TABLE "_PromotionRewardProducts" DROP CONSTRAINT "_PromotionRewardProducts_B_fkey";

-- DropForeignKey
ALTER TABLE "_SupplierTags" DROP CONSTRAINT "_SupplierTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_SupplierTags" DROP CONSTRAINT "_SupplierTags_B_fkey";

-- DropForeignKey
ALTER TABLE "_TimedEventTags" DROP CONSTRAINT "_TimedEventTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_TimedEventTags" DROP CONSTRAINT "_TimedEventTags_B_fkey";

-- DropForeignKey
ALTER TABLE "combo_branches" DROP CONSTRAINT "combo_branches_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "combo_branches" DROP CONSTRAINT "combo_branches_combo_id_fkey";

-- DropForeignKey
ALTER TABLE "combo_item_option_size_branches" DROP CONSTRAINT "combo_item_option_size_branches_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "combo_item_option_size_branches" DROP CONSTRAINT "combo_item_option_size_branches_combo_item_option_id_combo_fkey";

-- DropForeignKey
ALTER TABLE "combo_item_option_sizes" DROP CONSTRAINT "combo_item_option_sizes_combo_item_option_id_fkey";

-- DropForeignKey
ALTER TABLE "combo_item_option_sizes" DROP CONSTRAINT "combo_item_option_sizes_combo_size_id_fkey";

-- DropForeignKey
ALTER TABLE "combo_item_option_sizes" DROP CONSTRAINT "combo_item_option_sizes_productId_fkey";

-- DropForeignKey
ALTER TABLE "combo_item_options" DROP CONSTRAINT "combo_item_options_combo_item_id_fkey";

-- DropForeignKey
ALTER TABLE "combo_items" DROP CONSTRAINT "combo_items_combo_id_fkey";

-- DropForeignKey
ALTER TABLE "combo_sizes" DROP CONSTRAINT "combo_sizes_combo_id_fkey";

-- DropForeignKey
ALTER TABLE "combos" DROP CONSTRAINT "combos_category_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_item_branches" DROP CONSTRAINT "inventory_item_branches_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_item_branches" DROP CONSTRAINT "inventory_item_branches_inventory_item_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_item_suppliers" DROP CONSTRAINT "inventory_item_suppliers_inventory_item_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_item_suppliers" DROP CONSTRAINT "inventory_item_suppliers_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_items" DROP CONSTRAINT "inventory_items_category_id_fkey";

-- DropForeignKey
ALTER TABLE "menu_groups" DROP CONSTRAINT "menu_groups_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "modifier_option_ingredients" DROP CONSTRAINT "modifier_option_ingredients_inventoryItemId_fkey";

-- DropForeignKey
ALTER TABLE "modifier_option_ingredients" DROP CONSTRAINT "modifier_option_ingredients_modifier_option_id_fkey";

-- DropForeignKey
ALTER TABLE "order_combo_product_option_taxes" DROP CONSTRAINT "order_combo_product_option_taxes_order_combo_product_optio_fkey";

-- DropForeignKey
ALTER TABLE "order_combo_product_option_taxes" DROP CONSTRAINT "order_combo_product_option_taxes_tax_id_fkey";

-- DropForeignKey
ALTER TABLE "order_combo_product_options" DROP CONSTRAINT "order_combo_product_options_modifier_option_id_fkey";

-- DropForeignKey
ALTER TABLE "order_combo_product_options" DROP CONSTRAINT "order_combo_product_options_order_combo_product_id_fkey";

-- DropForeignKey
ALTER TABLE "order_combo_product_taxes" DROP CONSTRAINT "order_combo_product_taxes_order_combo_product_id_fkey";

-- DropForeignKey
ALTER TABLE "order_combo_product_taxes" DROP CONSTRAINT "order_combo_product_taxes_tax_id_fkey";

-- DropForeignKey
ALTER TABLE "order_combo_products" DROP CONSTRAINT "order_combo_products_combo_option_id_fkey";

-- DropForeignKey
ALTER TABLE "order_combo_products" DROP CONSTRAINT "order_combo_products_combo_size_id_fkey";

-- DropForeignKey
ALTER TABLE "order_combo_products" DROP CONSTRAINT "order_combo_products_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "order_combo_products" DROP CONSTRAINT "order_combo_products_discount_id_fkey";

-- DropForeignKey
ALTER TABLE "order_combo_products" DROP CONSTRAINT "order_combo_products_order_combo_id_fkey";

-- DropForeignKey
ALTER TABLE "order_combo_products" DROP CONSTRAINT "order_combo_products_product_id_fkey";

-- DropForeignKey
ALTER TABLE "order_combo_products" DROP CONSTRAINT "order_combo_products_promotion_id_fkey";

-- DropForeignKey
ALTER TABLE "order_combo_products" DROP CONSTRAINT "order_combo_products_voider_id_fkey";

-- DropForeignKey
ALTER TABLE "order_combos" DROP CONSTRAINT "order_combos_combo_size_id_fkey";

-- DropForeignKey
ALTER TABLE "order_combos" DROP CONSTRAINT "order_combos_discount_id_fkey";

-- DropForeignKey
ALTER TABLE "order_combos" DROP CONSTRAINT "order_combos_order_id_fkey";

-- DropForeignKey
ALTER TABLE "order_products" DROP CONSTRAINT "order_products_product_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_coupon_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "product_branches" DROP CONSTRAINT "product_branches_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "product_branches" DROP CONSTRAINT "product_branches_product_id_fkey";

-- DropForeignKey
ALTER TABLE "product_ingredients" DROP CONSTRAINT "product_ingredients_inventory_item_id_fkey";

-- DropForeignKey
ALTER TABLE "product_ingredients" DROP CONSTRAINT "product_ingredients_product_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_category_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_tax_group_id_fkey";

-- DropIndex
DROP INDEX "customer_addresses_delivery_zone_id_key";

-- DropIndex
DROP INDEX "order_charge_taxes_tax_id_key";

-- DropIndex
DROP INDEX "order_charges_charge_id_key";

-- DropIndex
DROP INDEX "order_payments_user_id_key";

-- DropIndex
DROP INDEX "order_product_option_taxes_tax_id_key";

-- DropIndex
DROP INDEX "order_product_options_modifier_option_id_key";

-- DropIndex
DROP INDEX "order_product_taxes_tax_id_key";

-- DropIndex
DROP INDEX "order_products_creator_id_key";

-- DropIndex
DROP INDEX "order_products_discount_id_key";

-- DropIndex
DROP INDEX "order_products_product_id_key";

-- DropIndex
DROP INDEX "order_products_promotion_id_key";

-- DropIndex
DROP INDEX "order_products_voider_id_key";

-- DropIndex
DROP INDEX "order_taxes_tax_id_key";

-- DropIndex
DROP INDEX "orders_closer_id_key";

-- DropIndex
DROP INDEX "orders_coupon_id_key";

-- DropIndex
DROP INDEX "orders_creator_id_key";

-- DropIndex
DROP INDEX "orders_customer_address_id_key";

-- DropIndex
DROP INDEX "orders_customer_id_key";

-- DropIndex
DROP INDEX "orders_discount_id_key";

-- DropIndex
DROP INDEX "orders_driver_id_key";

-- DropIndex
DROP INDEX "orders_gift_card_id_key";

-- DropIndex
DROP INDEX "orders_promotion_id_key";

-- DropIndex
DROP INDEX "orders_table_id_key";

-- AlterTable
ALTER TABLE "coupons" ADD COLUMN     "orderId" TEXT;

-- AlterTable
ALTER TABLE "order_payments" DROP COLUMN "tips";

-- AlterTable
ALTER TABLE "order_products" DROP COLUMN "void_reason",
ADD COLUMN     "void_reason_id" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "Product_Status";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "coupon_id",
DROP COLUMN "discount_type",
ADD COLUMN     "couponCode" TEXT,
ADD COLUMN     "discountType" "Discounts_Types",
ADD COLUMN     "last_sync_error" TEXT,
ADD COLUMN     "sync_attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sync_status" TEXT NOT NULL DEFAULT 'pending',
DROP COLUMN "source",
ADD COLUMN     "source" "OrderSource" NOT NULL DEFAULT 'API',
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'Pending',
ALTER COLUMN "creator_id" DROP NOT NULL,
ALTER COLUMN "foodicsId" DROP NOT NULL;

-- DropTable
DROP TABLE "_BranchTimedEvents";

-- DropTable
DROP TABLE "_CategoryTimedEvents";

-- DropTable
DROP TABLE "_ComboMenuGroups";

-- DropTable
DROP TABLE "_ComboTags";

-- DropTable
DROP TABLE "_ComboTimedEvents";

-- DropTable
DROP TABLE "_ComboToDiscount";

-- DropTable
DROP TABLE "_InventoryItemTags";

-- DropTable
DROP TABLE "_MenuGroupGiftCardProducts";

-- DropTable
DROP TABLE "_OrderComboProductTimedEvents";

-- DropTable
DROP TABLE "_OrderProductTimedEvents";

-- DropTable
DROP TABLE "_ProductDiscounts";

-- DropTable
DROP TABLE "_ProductMenuGroups";

-- DropTable
DROP TABLE "_ProductTags";

-- DropTable
DROP TABLE "_ProductTimedEvents";

-- DropTable
DROP TABLE "_PromotionCombos";

-- DropTable
DROP TABLE "_PromotionProducts";

-- DropTable
DROP TABLE "_PromotionRewardCombos";

-- DropTable
DROP TABLE "_PromotionRewardProducts";

-- DropTable
DROP TABLE "_SupplierTags";

-- DropTable
DROP TABLE "_TimedEventTags";

-- DropTable
DROP TABLE "combo_branches";

-- DropTable
DROP TABLE "combo_item_option_size_branches";

-- DropTable
DROP TABLE "combo_item_option_sizes";

-- DropTable
DROP TABLE "combo_item_options";

-- DropTable
DROP TABLE "combo_items";

-- DropTable
DROP TABLE "combo_sizes";

-- DropTable
DROP TABLE "combos";

-- DropTable
DROP TABLE "inventory_item_branches";

-- DropTable
DROP TABLE "inventory_item_suppliers";

-- DropTable
DROP TABLE "inventory_items";

-- DropTable
DROP TABLE "menu_groups";

-- DropTable
DROP TABLE "modifier_option_ingredients";

-- DropTable
DROP TABLE "order_combo_product_option_taxes";

-- DropTable
DROP TABLE "order_combo_product_options";

-- DropTable
DROP TABLE "order_combo_product_taxes";

-- DropTable
DROP TABLE "order_combo_products";

-- DropTable
DROP TABLE "order_combos";

-- DropTable
DROP TABLE "product_branches";

-- DropTable
DROP TABLE "product_ingredients";

-- DropTable
DROP TABLE "products";

-- DropTable
DROP TABLE "suppliers";

-- DropTable
DROP TABLE "timed_events";

-- CreateTable
CREATE TABLE "reasons" (
    "id" TEXT NOT NULL,
    "foodics_id" TEXT,
    "name" TEXT NOT NULL,
    "name_localized" TEXT,
    "type" "ProductReason" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "reasons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reasons_foodics_id_key" ON "reasons"("foodics_id");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_void_reason_id_fkey" FOREIGN KEY ("void_reason_id") REFERENCES "reasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "GroupProducts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
