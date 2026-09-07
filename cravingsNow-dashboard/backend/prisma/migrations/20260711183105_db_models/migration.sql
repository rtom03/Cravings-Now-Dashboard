/*
  Warnings:

  - Added the required column `branchId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('CASH', 'CARD', 'OTHER', 'GIFT_CARD', 'HOUSE_ACCOUNT', 'THIRD_PARTY');

-- CreateEnum
CREATE TYPE "ConditionType" AS ENUM ('QUANTITY_BASED', 'SPENDING_BASED');

-- CreateEnum
CREATE TYPE "PromotionType" AS ENUM ('BASIC', 'ADVANCED');

-- CreateEnum
CREATE TYPE "RewardType" AS ENUM ('PERCENTAGE_DISCOUNT_ON_PRODUCTS', 'AMOUNT_DISCOUNT_ON_PRODUCTS', 'PERCENTAGE_DISCOUNT_ON_ORDER', 'AMOUNT_DISCOUNT_ON_ORDER', 'FIXED_PRICE');

-- CreateEnum
CREATE TYPE "TagType" AS ENUM ('CUSTOMER_TAG', 'BRANCH_TAG', 'INVENTORY_ITEM_TAG', 'ORDER_TAG', 'SUPPLIER_TAG', 'USER_TAG', 'PRODUCT_TAG', 'DEVICE_TAG', 'REVENUE_CENTER_TAG');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('DINE_IN', 'PICK_UP', 'DELIVERY', 'DRIVE_THRU');

-- CreateEnum
CREATE TYPE "ChargeType" AS ENUM ('AMOUNT', 'PERCENTAGE');

-- CreateEnum
CREATE TYPE "TableStatus" AS ENUM ('FREE', 'OCCUPIED', 'CHECK_PRINTED', 'RESERVED');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('CASHIER', 'KDS', 'NOTIFIER', 'DISPLAY', 'SUB_CASHIER', 'FOODICS_ONE_CASHIER', 'WAITER');

-- CreateEnum
CREATE TYPE "PricingMethod" AS ENUM ('FIXED_PRICE', 'OPEN_PRICE');

-- CreateEnum
CREATE TYPE "CostingMethod" AS ENUM ('FIXED_COST', 'CALCULATE_FROM_INGREDIENTS');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "branchId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "branches" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_localized" TEXT,
    "reference" TEXT NOT NULL,
    "latitude" TEXT,
    "longitude" TEXT,
    "phone" TEXT,
    "opening_from" TEXT NOT NULL,
    "opening_to" TEXT NOT NULL,
    "accepts_reservations" BOOLEAN NOT NULL DEFAULT false,
    "address" TEXT,
    "receipt_footer" TEXT,
    "receipt_header" TEXT,
    "reservation_duration" INTEGER NOT NULL DEFAULT 0,
    "reservation_times" JSONB,
    "settings" JSONB NOT NULL,
    "inventory_end_of_day_time" TEXT NOT NULL,
    "receives_online_orders" BOOLEAN NOT NULL DEFAULT false,
    "tax_group_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "barcode" TEXT,
    "name" TEXT NOT NULL,
    "name_localized" TEXT,
    "description" TEXT,
    "description_localized" TEXT,
    "image" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_stock_product" BOOLEAN NOT NULL DEFAULT false,
    "is_non_revenue" BOOLEAN NOT NULL DEFAULT false,
    "is_ready" BOOLEAN NOT NULL DEFAULT false,
    "pricing_method" INTEGER NOT NULL,
    "selling_method" INTEGER NOT NULL,
    "costing_method" INTEGER NOT NULL,
    "preparation_time" INTEGER,
    "price" DOUBLE PRECISION,
    "cost" DOUBLE PRECISION,
    "calories" INTEGER,
    "walking_minutes_to_burn_calories" INTEGER,
    "is_high_salt" BOOLEAN,
    "tax_group_id" TEXT,
    "category_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_branches" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "branch_id" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "is_active" BOOLEAN,
    "is_in_stock" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_ingredients" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "inventory_item_id" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION,
    "yieldPercentage" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modifiers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_localized" TEXT,
    "is_ready" BOOLEAN NOT NULL DEFAULT false,
    "reference" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "modifiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modifier_options" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_localized" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_in_stock" BOOLEAN NOT NULL DEFAULT true,
    "costing_method" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "cost" DOUBLE PRECISION,
    "calories" DOUBLE PRECISION,
    "index" INTEGER,
    "modifier_id" TEXT NOT NULL,
    "tax_group_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "modifier_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modifier_option_branches" (
    "id" TEXT NOT NULL,
    "modifier_option_id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "is_active" BOOLEAN,
    "is_in_stock" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modifier_option_branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modifier_option_ingredients" (
    "id" TEXT NOT NULL,
    "modifier_option_id" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modifier_option_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "barcode" TEXT,
    "name" TEXT NOT NULL,
    "name_localized" TEXT,
    "minimum_level" TEXT,
    "maximum_level" TEXT,
    "par_level" TEXT,
    "storage_unit" TEXT NOT NULL,
    "ingredient_unit" INTEGER NOT NULL,
    "storage_to_ingredient_factor" DOUBLE PRECISION NOT NULL,
    "costing_method" "CostingMethod" NOT NULL,
    "cost" DOUBLE PRECISION,
    "is_product" BOOLEAN,
    "yield_percentage" DOUBLE PRECISION,
    "category_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_item_branches" (
    "id" TEXT NOT NULL,
    "inventory_item_id" TEXT NOT NULL,
    "branch_id" TEXT NOT NULL,
    "minimum_level" TEXT,
    "maximum_level" TEXT,
    "par_level" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_item_branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_item_suppliers" (
    "id" TEXT NOT NULL,
    "inventory_item_id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "inventoryPivotItemId" TEXT NOT NULL,
    "order_unit" TEXT,
    "order_to_storage_factor" DOUBLE PRECISION,
    "minimum_order_quantity" DOUBLE PRECISION,
    "cost" DOUBLE PRECISION,
    "code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_item_suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact_name" TEXT,
    "phone" TEXT,
    "code" TEXT,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_localized" TEXT,
    "image" TEXT,
    "items_index" JSONB,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "menu_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combos" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "barcode" TEXT,
    "name" TEXT NOT NULL,
    "name_localized" TEXT,
    "description" TEXT,
    "description_localized" TEXT,
    "image" TEXT,
    "is_active" BOOLEAN,
    "is_ready" BOOLEAN,
    "category_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "combos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combo_branches" (
    "id" TEXT NOT NULL,
    "combo_id" TEXT NOT NULL,
    "branch_id" TEXT NOT NULL,
    "is_active" BOOLEAN,

    CONSTRAINT "combo_branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combo_sizes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_localized" TEXT,
    "combo_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "combo_sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combo_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_localized" TEXT,
    "is_upgradable" BOOLEAN,
    "combo_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "combo_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combo_item_options" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_localized" TEXT,
    "hid" TEXT,
    "combo_item_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "combo_item_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combo_item_option_sizes" (
    "combo_item_option_id" TEXT NOT NULL,
    "combo_size_id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "combo_item_option_sizes_pkey" PRIMARY KEY ("combo_item_option_id","combo_size_id")
);

-- CreateTable
CREATE TABLE "combo_item_option_size_branches" (
    "id" TEXT NOT NULL,
    "combo_item_option_id" TEXT NOT NULL,
    "combo_size_id" TEXT NOT NULL,
    "branch_id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "combo_item_option_size_branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_localized" TEXT,
    "is_active" BOOLEAN,
    "type" "PromotionType" NOT NULL,
    "from_date" DATE NOT NULL,
    "to_date" DATE NOT NULL,
    "from_time" INTEGER NOT NULL,
    "to_time" INTEGER NOT NULL,
    "is_sat" BOOLEAN,
    "is_sun" BOOLEAN,
    "is_mon" BOOLEAN,
    "is_tue" BOOLEAN,
    "is_wed" BOOLEAN,
    "is_thu" BOOLEAN,
    "is_fri" BOOLEAN,
    "include_modifiers" BOOLEAN,
    "target_quantity" INTEGER,
    "reward_quantity" INTEGER,
    "reward_type" "RewardType" NOT NULL,
    "reward_amount" DOUBLE PRECISION NOT NULL,
    "maximum_discount_amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_localized" TEXT,
    "reference" TEXT,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_localized" TEXT,
    "type" "TagType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timed_events" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_localized" TEXT,
    "type" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "priority" INTEGER,
    "is_active" BOOLEAN,
    "from_date" DATE NOT NULL,
    "to_date" DATE NOT NULL,
    "from_time" TEXT NOT NULL,
    "to_time" TEXT NOT NULL,
    "is_sat" BOOLEAN,
    "is_sun" BOOLEAN,
    "is_mon" BOOLEAN,
    "is_tue" BOOLEAN,
    "is_wed" BOOLEAN,
    "is_thu" BOOLEAN,
    "is_fri" BOOLEAN,
    "orderTypes" "OrderType" NOT NULL DEFAULT 'DELIVERY',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "timed_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discounts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_localized" TEXT,
    "qualification" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "minimum_product_price" DOUBLE PRECISION,
    "minimum_order_price" DOUBLE PRECISION NOT NULL,
    "maximum_amount" DOUBLE PRECISION,
    "is_percentage" BOOLEAN NOT NULL,
    "is_taxable" BOOLEAN,
    "reference" TEXT,
    "orderTypes" "OrderType" NOT NULL DEFAULT 'DELIVERY',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_zones" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_localized" TEXT,
    "reference" TEXT,
    "coordinates" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "delivery_zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_localized" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tax_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_localized" TEXT,
    "rate" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "taxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "charges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_localized" TEXT,
    "type" "ChargeType",
    "order_types" "OrderType"[],
    "is_auto_applied" BOOLEAN,
    "value" DOUBLE PRECISION NOT NULL,
    "is_open_charge" BOOLEAN NOT NULL,
    "tax_group_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "charges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sections" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "name_localized" TEXT,
    "branch_id" TEXT NOT NULL,
    "revenue_center" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tables" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "status" "TableStatus" NOT NULL,
    "seats" INTEGER,
    "accepts_reservations" BOOLEAN,
    "section_id" TEXT,
    "revenue_center" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "in_use" BOOLEAN,
    "reference" TEXT NOT NULL,
    "type" "DeviceType" NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "is_blocked" BOOLEAN,
    "local_settings" JSONB,
    "model" TEXT,
    "build" INTEGER,
    "app_version" TEXT,
    "system_version" TEXT,
    "settings" JSONB,
    "is_online_receiver" BOOLEAN,
    "last_sync_at" TIMESTAMP(3),
    "last_seen_at" TIMESTAMP(3),
    "last_order_at" TIMESTAMP(3),
    "branch_id" TEXT NOT NULL,
    "revenue_center" JSONB,
    "group" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "reference" TEXT,
    "reference_x" TEXT,
    "app_id" TEXT,
    "number" INTEGER,
    "type" "OrderType" NOT NULL,
    "source" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "delivery_status" INTEGER,
    "guests" INTEGER NOT NULL,
    "kitchen_notes" TEXT,
    "customer_notes" TEXT,
    "business_date" DATE NOT NULL,
    "subtotal_price" DOUBLE PRECISION NOT NULL,
    "discount_amount" DOUBLE PRECISION NOT NULL,
    "rounding_amount" DOUBLE PRECISION NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "tax_exclusive_discount_amount" DOUBLE PRECISION NOT NULL,
    "delay_in_seconds" INTEGER,
    "discount_type" INTEGER NOT NULL,
    "meta" JSONB,
    "tax_reporting_transaction" JSONB,
    "branch_id" TEXT NOT NULL,
    "table_id" TEXT,
    "creator_id" TEXT NOT NULL,
    "closer_id" TEXT,
    "driver_id" TEXT,
    "original_order_id" TEXT,
    "customer_id" TEXT,
    "customer_address_id" TEXT,
    "discount_id" TEXT,
    "coupon_id" TEXT,
    "gift_card_id" TEXT,
    "promotion_id" TEXT,
    "revenue_center" JSONB,
    "opened_at" TIMESTAMP(3),
    "due_at" TIMESTAMP(3),
    "kitchen_received_at" TIMESTAMP(3),
    "kitchen_done_at" TIMESTAMP(3),
    "driver_assigned_at" TIMESTAMP(3),
    "dispatched_at" TIMESTAMP(3),
    "driver_collected_at" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),
    "closed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_taxes" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "tax_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "tax_exclusive_discount_amount" DOUBLE PRECISION,

    CONSTRAINT "order_taxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_products" (
    "id" TEXT NOT NULL,
    "discount_type" INTEGER,
    "quantity" INTEGER NOT NULL,
    "returned_quantity" INTEGER,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "discount_amount" DOUBLE PRECISION NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "total_cost" DOUBLE PRECISION NOT NULL,
    "tax_exclusive_discount_amount" DOUBLE PRECISION NOT NULL,
    "tax_exclusive_unit_price" DOUBLE PRECISION NOT NULL,
    "tax_exclusive_total_price" DOUBLE PRECISION NOT NULL,
    "status" INTEGER NOT NULL,
    "is_ingredients_wasted" BOOLEAN NOT NULL,
    "is_ingredients_returned" BOOLEAN NOT NULL,
    "delay_in_seconds" INTEGER,
    "kitchen_notes" TEXT,
    "meta" JSONB,
    "added_at" TIMESTAMP(3) NOT NULL,
    "closed_at" TIMESTAMP(3),
    "void_reason" TEXT,
    "void_tag" JSONB,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "discount_id" TEXT,
    "creator_id" TEXT,
    "voider_id" TEXT,
    "promotion_id" TEXT,

    CONSTRAINT "order_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_product_taxes" (
    "id" TEXT NOT NULL,
    "order_product_id" TEXT NOT NULL,
    "tax_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "tax_exclusive_discount_amount" DOUBLE PRECISION,

    CONSTRAINT "order_product_taxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_product_options" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "partition" INTEGER,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "total_cost" DOUBLE PRECISION NOT NULL,
    "tax_exclusive_unit_price" DOUBLE PRECISION,
    "tax_exclusive_total_price" DOUBLE PRECISION,
    "tax_exclusive_discount_amount" DOUBLE PRECISION,
    "added_at" TIMESTAMP(3),
    "order_product_id" TEXT NOT NULL,
    "modifier_option_id" TEXT NOT NULL,

    CONSTRAINT "order_product_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_product_option_taxes" (
    "id" TEXT NOT NULL,
    "order_product_option_id" TEXT NOT NULL,
    "tax_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "tax_exclusive_discount_amount" DOUBLE PRECISION,

    CONSTRAINT "order_product_option_taxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_charges" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "tax_exclusive_amount" DOUBLE PRECISION NOT NULL,
    "order_id" TEXT NOT NULL,
    "charge_id" TEXT NOT NULL,

    CONSTRAINT "order_charges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_charge_taxes" (
    "id" TEXT NOT NULL,
    "order_charge_id" TEXT NOT NULL,
    "tax_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "tax_exclusive_discount_amount" DOUBLE PRECISION,

    CONSTRAINT "order_charge_taxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_payments" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "tendered" DOUBLE PRECISION NOT NULL,
    "tips" DOUBLE PRECISION NOT NULL,
    "business_date" DATE NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL,
    "meta" JSONB,
    "order_id" TEXT NOT NULL,
    "user_id" TEXT,
    "payment_method_id" TEXT NOT NULL,

    CONSTRAINT "order_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_combos" (
    "id" TEXT NOT NULL,
    "discount_type" INTEGER,
    "quantity" INTEGER NOT NULL,
    "returned_quantity" INTEGER,
    "discount_amount" DOUBLE PRECISION NOT NULL,
    "order_id" TEXT NOT NULL,
    "combo_size_id" TEXT NOT NULL,
    "discount_id" TEXT,

    CONSTRAINT "order_combos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_combo_products" (
    "id" TEXT NOT NULL,
    "discount_type" INTEGER,
    "quantity" INTEGER NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "discount_amount" DOUBLE PRECISION NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "total_cost" DOUBLE PRECISION NOT NULL,
    "tax_exclusive_discount_amount" DOUBLE PRECISION,
    "tax_exclusive_unit_price" DOUBLE PRECISION,
    "tax_exclusive_total_price" DOUBLE PRECISION,
    "status" INTEGER NOT NULL,
    "is_ingredients_wasted" BOOLEAN NOT NULL,
    "is_ingredients_returned" BOOLEAN NOT NULL,
    "delay_in_seconds" INTEGER,
    "kitchen_notes" TEXT,
    "meta" JSONB,
    "added_at" TIMESTAMP(3),
    "closed_at" TIMESTAMP(3),
    "void_reason" TEXT,
    "void_tag" JSONB,
    "order_combo_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "discount_id" TEXT,
    "creator_id" TEXT,
    "voider_id" TEXT,
    "promotion_id" TEXT,
    "combo_option_id" TEXT NOT NULL,
    "combo_size_id" TEXT NOT NULL,

    CONSTRAINT "order_combo_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_combo_product_taxes" (
    "id" TEXT NOT NULL,
    "order_combo_product_id" TEXT NOT NULL,
    "tax_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "tax_exclusive_discount_amount" DOUBLE PRECISION,

    CONSTRAINT "order_combo_product_taxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_combo_product_options" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "partition" INTEGER,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "total_cost" DOUBLE PRECISION NOT NULL,
    "tax_exclusive_unit_price" DOUBLE PRECISION,
    "tax_exclusive_total_price" DOUBLE PRECISION,
    "tax_exclusive_discount_amount" DOUBLE PRECISION,
    "added_at" TIMESTAMP(3),
    "order_combo_product_id" TEXT NOT NULL,
    "modifier_option_id" TEXT NOT NULL,

    CONSTRAINT "order_combo_product_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_combo_product_option_taxes" (
    "id" TEXT NOT NULL,
    "order_combo_product_option_id" TEXT NOT NULL,
    "tax_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "tax_exclusive_discount_amount" DOUBLE PRECISION,

    CONSTRAINT "order_combo_product_option_taxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "dial_code" INTEGER,
    "phone" TEXT,
    "email" TEXT,
    "gender" INTEGER,
    "birth_date" DATE,
    "house_account_limit" INTEGER,
    "house_account_balance" DOUBLE PRECISION,
    "loyalty_balance" DOUBLE PRECISION,
    "is_loyalty_enabled" BOOLEAN NOT NULL,
    "is_blacklisted" BOOLEAN NOT NULL,
    "is_house_account_enabled" BOOLEAN NOT NULL,
    "last_order_at" TIMESTAMP(3),
    "order_count" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_addresses" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "latitude" TEXT,
    "longitude" TEXT,
    "customer_id" TEXT NOT NULL,
    "delivery_zone_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "customer_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gift_card_products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_localized" TEXT,
    "image" TEXT,
    "sku" TEXT NOT NULL,
    "barcode" TEXT,
    "pricing_method" "PricingMethod" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "is_active" BOOLEAN,
    "category_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "gift_card_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gift_card_product_branches" (
    "id" TEXT NOT NULL,
    "gift_card_product_id" TEXT NOT NULL,
    "branch_id" TEXT NOT NULL,
    "is_active" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gift_card_product_branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gift_cards" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "code" TEXT,
    "order_id" TEXT,
    "gift_card_product_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gift_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "maximum_uses" INTEGER NOT NULL,
    "is_active" BOOLEAN,
    "from_date" DATE NOT NULL,
    "to_date" DATE NOT NULL,
    "from_time" INTEGER NOT NULL,
    "to_time" INTEGER NOT NULL,
    "is_sat" BOOLEAN,
    "is_sun" BOOLEAN,
    "is_mon" BOOLEAN,
    "is_tue" BOOLEAN,
    "is_wed" BOOLEAN,
    "is_thu" BOOLEAN,
    "is_fri" BOOLEAN,
    "discount_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_localized" TEXT,
    "code" TEXT,
    "auto_open_drawer" BOOLEAN,
    "type" "PaymentMethodType" NOT NULL,
    "is_active" BOOLEAN,
    "index" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BranchTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BranchTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BranchDeliveryZones" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BranchDeliveryZones_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BranchTimedEvents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BranchTimedEvents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BranchPromotions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BranchPromotions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BranchCharges" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BranchCharges_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DiscountBranches" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DiscountBranches_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PromotionProducts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PromotionProducts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PromotionRewardProducts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PromotionRewardProducts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductTimedEvents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductTimedEvents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ModifierProducts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ModifierProducts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_InventoryItemTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_InventoryItemTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SupplierTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SupplierTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductMenuGroups" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductMenuGroups_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ComboMenuGroups" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ComboMenuGroups_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ComboTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ComboTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ComboTimedEvents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ComboTimedEvents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PromotionCombos" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PromotionCombos_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PromotionRewardCombos" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PromotionRewardCombos_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ComboToDiscount" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ComboToDiscount_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PromotionProductTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PromotionProductTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PromotionCustomerTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PromotionCustomerTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PromotionRewardProductTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PromotionRewardProductTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CategoryDiscounts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryDiscounts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CategoryTimedEvents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryTimedEvents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PromotionCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PromotionCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PromotionRewardCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PromotionRewardCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TimedEventTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TimedEventTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductDiscounts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductDiscounts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DiscountProductTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DiscountProductTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DiscountCustomerTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DiscountCustomerTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TaxGroupTaxes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TaxGroupTaxes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DeviceTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DeviceTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_OrderTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrderTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_OrderProductTimedEvents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrderProductTimedEvents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_OrderComboProductTimedEvents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrderComboProductTimedEvents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CustomerTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CustomerTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GiftCardProductTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GiftCardProductTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MenuGroupGiftCardProducts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MenuGroupGiftCardProducts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "branches_reference_key" ON "branches"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "product_branches_product_id_branch_id_key" ON "product_branches"("product_id", "branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_ingredients_product_id_inventory_item_id_key" ON "product_ingredients"("product_id", "inventory_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "modifiers_reference_key" ON "modifiers"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "modifier_options_sku_key" ON "modifier_options"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "modifier_option_branches_modifier_option_id_branchId_key" ON "modifier_option_branches"("modifier_option_id", "branchId");

-- CreateIndex
CREATE UNIQUE INDEX "modifier_option_ingredients_modifier_option_id_inventoryIte_key" ON "modifier_option_ingredients"("modifier_option_id", "inventoryItemId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_sku_key" ON "inventory_items"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_item_branches_inventory_item_id_branch_id_key" ON "inventory_item_branches"("inventory_item_id", "branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_item_suppliers_inventory_item_id_supplier_id_key" ON "inventory_item_suppliers"("inventory_item_id", "supplier_id");

-- CreateIndex
CREATE UNIQUE INDEX "combos_sku_key" ON "combos"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "combo_branches_combo_id_branch_id_key" ON "combo_branches"("combo_id", "branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "combo_item_option_size_branches_combo_item_option_id_combo__key" ON "combo_item_option_size_branches"("combo_item_option_id", "combo_size_id", "branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_reference_key" ON "categories"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "discounts_reference_key" ON "discounts"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "delivery_zones_reference_key" ON "delivery_zones"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "charges_tax_group_id_key" ON "charges"("tax_group_id");

-- CreateIndex
CREATE UNIQUE INDEX "devices_reference_key" ON "devices"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "orders_table_id_key" ON "orders"("table_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_creator_id_key" ON "orders"("creator_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_closer_id_key" ON "orders"("closer_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_driver_id_key" ON "orders"("driver_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_customer_id_key" ON "orders"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_customer_address_id_key" ON "orders"("customer_address_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_discount_id_key" ON "orders"("discount_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_coupon_id_key" ON "orders"("coupon_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_gift_card_id_key" ON "orders"("gift_card_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_promotion_id_key" ON "orders"("promotion_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_taxes_tax_id_key" ON "order_taxes"("tax_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_products_product_id_key" ON "order_products"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_products_discount_id_key" ON "order_products"("discount_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_products_creator_id_key" ON "order_products"("creator_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_products_voider_id_key" ON "order_products"("voider_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_products_promotion_id_key" ON "order_products"("promotion_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_product_taxes_tax_id_key" ON "order_product_taxes"("tax_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_product_options_modifier_option_id_key" ON "order_product_options"("modifier_option_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_product_option_taxes_tax_id_key" ON "order_product_option_taxes"("tax_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_charges_charge_id_key" ON "order_charges"("charge_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_charge_taxes_tax_id_key" ON "order_charge_taxes"("tax_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_payments_user_id_key" ON "order_payments"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_combos_combo_size_id_key" ON "order_combos"("combo_size_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_combos_discount_id_key" ON "order_combos"("discount_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_combo_products_product_id_key" ON "order_combo_products"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_combo_products_discount_id_key" ON "order_combo_products"("discount_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_combo_products_creator_id_key" ON "order_combo_products"("creator_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_combo_products_voider_id_key" ON "order_combo_products"("voider_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_combo_products_promotion_id_key" ON "order_combo_products"("promotion_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_combo_products_combo_size_id_key" ON "order_combo_products"("combo_size_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_combo_product_taxes_tax_id_key" ON "order_combo_product_taxes"("tax_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_combo_product_options_modifier_option_id_key" ON "order_combo_product_options"("modifier_option_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_combo_product_option_taxes_tax_id_key" ON "order_combo_product_option_taxes"("tax_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_addresses_delivery_zone_id_key" ON "customer_addresses"("delivery_zone_id");

-- CreateIndex
CREATE UNIQUE INDEX "gift_card_products_sku_key" ON "gift_card_products"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "gift_card_products_category_id_key" ON "gift_card_products"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "gift_card_product_branches_branch_id_key" ON "gift_card_product_branches"("branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "gift_card_product_branches_gift_card_product_id_branch_id_key" ON "gift_card_product_branches"("gift_card_product_id", "branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "gift_cards_gift_card_product_id_key" ON "gift_cards"("gift_card_product_id");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_discount_id_key" ON "coupons"("discount_id");

-- CreateIndex
CREATE INDEX "_BranchTags_B_index" ON "_BranchTags"("B");

-- CreateIndex
CREATE INDEX "_BranchDeliveryZones_B_index" ON "_BranchDeliveryZones"("B");

-- CreateIndex
CREATE INDEX "_BranchTimedEvents_B_index" ON "_BranchTimedEvents"("B");

-- CreateIndex
CREATE INDEX "_BranchPromotions_B_index" ON "_BranchPromotions"("B");

-- CreateIndex
CREATE INDEX "_BranchCharges_B_index" ON "_BranchCharges"("B");

-- CreateIndex
CREATE INDEX "_DiscountBranches_B_index" ON "_DiscountBranches"("B");

-- CreateIndex
CREATE INDEX "_PromotionProducts_B_index" ON "_PromotionProducts"("B");

-- CreateIndex
CREATE INDEX "_PromotionRewardProducts_B_index" ON "_PromotionRewardProducts"("B");

-- CreateIndex
CREATE INDEX "_ProductTags_B_index" ON "_ProductTags"("B");

-- CreateIndex
CREATE INDEX "_ProductTimedEvents_B_index" ON "_ProductTimedEvents"("B");

-- CreateIndex
CREATE INDEX "_ModifierProducts_B_index" ON "_ModifierProducts"("B");

-- CreateIndex
CREATE INDEX "_InventoryItemTags_B_index" ON "_InventoryItemTags"("B");

-- CreateIndex
CREATE INDEX "_SupplierTags_B_index" ON "_SupplierTags"("B");

-- CreateIndex
CREATE INDEX "_ProductMenuGroups_B_index" ON "_ProductMenuGroups"("B");

-- CreateIndex
CREATE INDEX "_ComboMenuGroups_B_index" ON "_ComboMenuGroups"("B");

-- CreateIndex
CREATE INDEX "_ComboTags_B_index" ON "_ComboTags"("B");

-- CreateIndex
CREATE INDEX "_ComboTimedEvents_B_index" ON "_ComboTimedEvents"("B");

-- CreateIndex
CREATE INDEX "_PromotionCombos_B_index" ON "_PromotionCombos"("B");

-- CreateIndex
CREATE INDEX "_PromotionRewardCombos_B_index" ON "_PromotionRewardCombos"("B");

-- CreateIndex
CREATE INDEX "_ComboToDiscount_B_index" ON "_ComboToDiscount"("B");

-- CreateIndex
CREATE INDEX "_PromotionProductTags_B_index" ON "_PromotionProductTags"("B");

-- CreateIndex
CREATE INDEX "_PromotionCustomerTags_B_index" ON "_PromotionCustomerTags"("B");

-- CreateIndex
CREATE INDEX "_PromotionRewardProductTags_B_index" ON "_PromotionRewardProductTags"("B");

-- CreateIndex
CREATE INDEX "_CategoryDiscounts_B_index" ON "_CategoryDiscounts"("B");

-- CreateIndex
CREATE INDEX "_CategoryTimedEvents_B_index" ON "_CategoryTimedEvents"("B");

-- CreateIndex
CREATE INDEX "_PromotionCategories_B_index" ON "_PromotionCategories"("B");

-- CreateIndex
CREATE INDEX "_PromotionRewardCategories_B_index" ON "_PromotionRewardCategories"("B");

-- CreateIndex
CREATE INDEX "_TimedEventTags_B_index" ON "_TimedEventTags"("B");

-- CreateIndex
CREATE INDEX "_ProductDiscounts_B_index" ON "_ProductDiscounts"("B");

-- CreateIndex
CREATE INDEX "_DiscountProductTags_B_index" ON "_DiscountProductTags"("B");

-- CreateIndex
CREATE INDEX "_DiscountCustomerTags_B_index" ON "_DiscountCustomerTags"("B");

-- CreateIndex
CREATE INDEX "_TaxGroupTaxes_B_index" ON "_TaxGroupTaxes"("B");

-- CreateIndex
CREATE INDEX "_DeviceTags_B_index" ON "_DeviceTags"("B");

-- CreateIndex
CREATE INDEX "_OrderTags_B_index" ON "_OrderTags"("B");

-- CreateIndex
CREATE INDEX "_OrderProductTimedEvents_B_index" ON "_OrderProductTimedEvents"("B");

-- CreateIndex
CREATE INDEX "_OrderComboProductTimedEvents_B_index" ON "_OrderComboProductTimedEvents"("B");

-- CreateIndex
CREATE INDEX "_CustomerTags_B_index" ON "_CustomerTags"("B");

-- CreateIndex
CREATE INDEX "_GiftCardProductTags_B_index" ON "_GiftCardProductTags"("B");

-- CreateIndex
CREATE INDEX "_MenuGroupGiftCardProducts_B_index" ON "_MenuGroupGiftCardProducts"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branches" ADD CONSTRAINT "branches_tax_group_id_fkey" FOREIGN KEY ("tax_group_id") REFERENCES "tax_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_tax_group_id_fkey" FOREIGN KEY ("tax_group_id") REFERENCES "tax_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_branches" ADD CONSTRAINT "product_branches_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_branches" ADD CONSTRAINT "product_branches_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_ingredients" ADD CONSTRAINT "product_ingredients_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_ingredients" ADD CONSTRAINT "product_ingredients_inventory_item_id_fkey" FOREIGN KEY ("inventory_item_id") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modifier_options" ADD CONSTRAINT "modifier_options_modifier_id_fkey" FOREIGN KEY ("modifier_id") REFERENCES "modifiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modifier_options" ADD CONSTRAINT "modifier_options_tax_group_id_fkey" FOREIGN KEY ("tax_group_id") REFERENCES "tax_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modifier_option_branches" ADD CONSTRAINT "modifier_option_branches_modifier_option_id_fkey" FOREIGN KEY ("modifier_option_id") REFERENCES "modifier_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modifier_option_branches" ADD CONSTRAINT "modifier_option_branches_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modifier_option_ingredients" ADD CONSTRAINT "modifier_option_ingredients_modifier_option_id_fkey" FOREIGN KEY ("modifier_option_id") REFERENCES "modifier_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modifier_option_ingredients" ADD CONSTRAINT "modifier_option_ingredients_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_item_branches" ADD CONSTRAINT "inventory_item_branches_inventory_item_id_fkey" FOREIGN KEY ("inventory_item_id") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_item_branches" ADD CONSTRAINT "inventory_item_branches_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_item_suppliers" ADD CONSTRAINT "inventory_item_suppliers_inventory_item_id_fkey" FOREIGN KEY ("inventory_item_id") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_item_suppliers" ADD CONSTRAINT "inventory_item_suppliers_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_groups" ADD CONSTRAINT "menu_groups_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "menu_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combos" ADD CONSTRAINT "combos_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_branches" ADD CONSTRAINT "combo_branches_combo_id_fkey" FOREIGN KEY ("combo_id") REFERENCES "combos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_branches" ADD CONSTRAINT "combo_branches_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_sizes" ADD CONSTRAINT "combo_sizes_combo_id_fkey" FOREIGN KEY ("combo_id") REFERENCES "combos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_items" ADD CONSTRAINT "combo_items_combo_id_fkey" FOREIGN KEY ("combo_id") REFERENCES "combos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_item_options" ADD CONSTRAINT "combo_item_options_combo_item_id_fkey" FOREIGN KEY ("combo_item_id") REFERENCES "combo_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_item_option_sizes" ADD CONSTRAINT "combo_item_option_sizes_combo_item_option_id_fkey" FOREIGN KEY ("combo_item_option_id") REFERENCES "combo_item_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_item_option_sizes" ADD CONSTRAINT "combo_item_option_sizes_combo_size_id_fkey" FOREIGN KEY ("combo_size_id") REFERENCES "combo_sizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_item_option_sizes" ADD CONSTRAINT "combo_item_option_sizes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_item_option_size_branches" ADD CONSTRAINT "combo_item_option_size_branches_combo_item_option_id_combo_fkey" FOREIGN KEY ("combo_item_option_id", "combo_size_id") REFERENCES "combo_item_option_sizes"("combo_item_option_id", "combo_size_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_item_option_size_branches" ADD CONSTRAINT "combo_item_option_size_branches_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charges" ADD CONSTRAINT "charges_tax_group_id_fkey" FOREIGN KEY ("tax_group_id") REFERENCES "tax_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tables" ADD CONSTRAINT "tables_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "tables"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_closer_id_fkey" FOREIGN KEY ("closer_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_original_order_id_fkey" FOREIGN KEY ("original_order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_address_id_fkey" FOREIGN KEY ("customer_address_id") REFERENCES "customer_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_gift_card_id_fkey" FOREIGN KEY ("gift_card_id") REFERENCES "gift_cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_taxes" ADD CONSTRAINT "order_taxes_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_taxes" ADD CONSTRAINT "order_taxes_tax_id_fkey" FOREIGN KEY ("tax_id") REFERENCES "taxes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_voider_id_fkey" FOREIGN KEY ("voider_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_product_taxes" ADD CONSTRAINT "order_product_taxes_order_product_id_fkey" FOREIGN KEY ("order_product_id") REFERENCES "order_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_product_taxes" ADD CONSTRAINT "order_product_taxes_tax_id_fkey" FOREIGN KEY ("tax_id") REFERENCES "taxes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_product_options" ADD CONSTRAINT "order_product_options_order_product_id_fkey" FOREIGN KEY ("order_product_id") REFERENCES "order_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_product_options" ADD CONSTRAINT "order_product_options_modifier_option_id_fkey" FOREIGN KEY ("modifier_option_id") REFERENCES "modifier_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_product_option_taxes" ADD CONSTRAINT "order_product_option_taxes_order_product_option_id_fkey" FOREIGN KEY ("order_product_option_id") REFERENCES "order_product_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_product_option_taxes" ADD CONSTRAINT "order_product_option_taxes_tax_id_fkey" FOREIGN KEY ("tax_id") REFERENCES "taxes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_charges" ADD CONSTRAINT "order_charges_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_charges" ADD CONSTRAINT "order_charges_charge_id_fkey" FOREIGN KEY ("charge_id") REFERENCES "charges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_charge_taxes" ADD CONSTRAINT "order_charge_taxes_order_charge_id_fkey" FOREIGN KEY ("order_charge_id") REFERENCES "order_charges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_charge_taxes" ADD CONSTRAINT "order_charge_taxes_tax_id_fkey" FOREIGN KEY ("tax_id") REFERENCES "taxes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_payments" ADD CONSTRAINT "order_payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_payments" ADD CONSTRAINT "order_payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_payments" ADD CONSTRAINT "order_payments_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combos" ADD CONSTRAINT "order_combos_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combos" ADD CONSTRAINT "order_combos_combo_size_id_fkey" FOREIGN KEY ("combo_size_id") REFERENCES "combo_sizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combos" ADD CONSTRAINT "order_combos_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combo_products" ADD CONSTRAINT "order_combo_products_order_combo_id_fkey" FOREIGN KEY ("order_combo_id") REFERENCES "order_combos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combo_products" ADD CONSTRAINT "order_combo_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combo_products" ADD CONSTRAINT "order_combo_products_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combo_products" ADD CONSTRAINT "order_combo_products_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combo_products" ADD CONSTRAINT "order_combo_products_voider_id_fkey" FOREIGN KEY ("voider_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combo_products" ADD CONSTRAINT "order_combo_products_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combo_products" ADD CONSTRAINT "order_combo_products_combo_option_id_fkey" FOREIGN KEY ("combo_option_id") REFERENCES "combo_item_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combo_products" ADD CONSTRAINT "order_combo_products_combo_size_id_fkey" FOREIGN KEY ("combo_size_id") REFERENCES "combo_sizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combo_product_taxes" ADD CONSTRAINT "order_combo_product_taxes_order_combo_product_id_fkey" FOREIGN KEY ("order_combo_product_id") REFERENCES "order_combo_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combo_product_taxes" ADD CONSTRAINT "order_combo_product_taxes_tax_id_fkey" FOREIGN KEY ("tax_id") REFERENCES "taxes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combo_product_options" ADD CONSTRAINT "order_combo_product_options_order_combo_product_id_fkey" FOREIGN KEY ("order_combo_product_id") REFERENCES "order_combo_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combo_product_options" ADD CONSTRAINT "order_combo_product_options_modifier_option_id_fkey" FOREIGN KEY ("modifier_option_id") REFERENCES "modifier_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combo_product_option_taxes" ADD CONSTRAINT "order_combo_product_option_taxes_order_combo_product_optio_fkey" FOREIGN KEY ("order_combo_product_option_id") REFERENCES "order_combo_product_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combo_product_option_taxes" ADD CONSTRAINT "order_combo_product_option_taxes_tax_id_fkey" FOREIGN KEY ("tax_id") REFERENCES "taxes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_delivery_zone_id_fkey" FOREIGN KEY ("delivery_zone_id") REFERENCES "delivery_zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_card_products" ADD CONSTRAINT "gift_card_products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_card_product_branches" ADD CONSTRAINT "gift_card_product_branches_gift_card_product_id_fkey" FOREIGN KEY ("gift_card_product_id") REFERENCES "gift_card_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_card_product_branches" ADD CONSTRAINT "gift_card_product_branches_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_cards" ADD CONSTRAINT "gift_cards_gift_card_product_id_fkey" FOREIGN KEY ("gift_card_product_id") REFERENCES "gift_card_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchTags" ADD CONSTRAINT "_BranchTags_A_fkey" FOREIGN KEY ("A") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchTags" ADD CONSTRAINT "_BranchTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchDeliveryZones" ADD CONSTRAINT "_BranchDeliveryZones_A_fkey" FOREIGN KEY ("A") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchDeliveryZones" ADD CONSTRAINT "_BranchDeliveryZones_B_fkey" FOREIGN KEY ("B") REFERENCES "delivery_zones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchTimedEvents" ADD CONSTRAINT "_BranchTimedEvents_A_fkey" FOREIGN KEY ("A") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchTimedEvents" ADD CONSTRAINT "_BranchTimedEvents_B_fkey" FOREIGN KEY ("B") REFERENCES "timed_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchPromotions" ADD CONSTRAINT "_BranchPromotions_A_fkey" FOREIGN KEY ("A") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchPromotions" ADD CONSTRAINT "_BranchPromotions_B_fkey" FOREIGN KEY ("B") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchCharges" ADD CONSTRAINT "_BranchCharges_A_fkey" FOREIGN KEY ("A") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchCharges" ADD CONSTRAINT "_BranchCharges_B_fkey" FOREIGN KEY ("B") REFERENCES "charges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscountBranches" ADD CONSTRAINT "_DiscountBranches_A_fkey" FOREIGN KEY ("A") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscountBranches" ADD CONSTRAINT "_DiscountBranches_B_fkey" FOREIGN KEY ("B") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionProducts" ADD CONSTRAINT "_PromotionProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionProducts" ADD CONSTRAINT "_PromotionProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionRewardProducts" ADD CONSTRAINT "_PromotionRewardProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionRewardProducts" ADD CONSTRAINT "_PromotionRewardProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductTags" ADD CONSTRAINT "_ProductTags_A_fkey" FOREIGN KEY ("A") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductTags" ADD CONSTRAINT "_ProductTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductTimedEvents" ADD CONSTRAINT "_ProductTimedEvents_A_fkey" FOREIGN KEY ("A") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductTimedEvents" ADD CONSTRAINT "_ProductTimedEvents_B_fkey" FOREIGN KEY ("B") REFERENCES "timed_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModifierProducts" ADD CONSTRAINT "_ModifierProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "modifiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModifierProducts" ADD CONSTRAINT "_ModifierProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InventoryItemTags" ADD CONSTRAINT "_InventoryItemTags_A_fkey" FOREIGN KEY ("A") REFERENCES "inventory_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InventoryItemTags" ADD CONSTRAINT "_InventoryItemTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SupplierTags" ADD CONSTRAINT "_SupplierTags_A_fkey" FOREIGN KEY ("A") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SupplierTags" ADD CONSTRAINT "_SupplierTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductMenuGroups" ADD CONSTRAINT "_ProductMenuGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "menu_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductMenuGroups" ADD CONSTRAINT "_ProductMenuGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComboMenuGroups" ADD CONSTRAINT "_ComboMenuGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "combos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComboMenuGroups" ADD CONSTRAINT "_ComboMenuGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "menu_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComboTags" ADD CONSTRAINT "_ComboTags_A_fkey" FOREIGN KEY ("A") REFERENCES "combos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComboTags" ADD CONSTRAINT "_ComboTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComboTimedEvents" ADD CONSTRAINT "_ComboTimedEvents_A_fkey" FOREIGN KEY ("A") REFERENCES "combos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComboTimedEvents" ADD CONSTRAINT "_ComboTimedEvents_B_fkey" FOREIGN KEY ("B") REFERENCES "timed_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionCombos" ADD CONSTRAINT "_PromotionCombos_A_fkey" FOREIGN KEY ("A") REFERENCES "combos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionCombos" ADD CONSTRAINT "_PromotionCombos_B_fkey" FOREIGN KEY ("B") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionRewardCombos" ADD CONSTRAINT "_PromotionRewardCombos_A_fkey" FOREIGN KEY ("A") REFERENCES "combos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionRewardCombos" ADD CONSTRAINT "_PromotionRewardCombos_B_fkey" FOREIGN KEY ("B") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComboToDiscount" ADD CONSTRAINT "_ComboToDiscount_A_fkey" FOREIGN KEY ("A") REFERENCES "combos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComboToDiscount" ADD CONSTRAINT "_ComboToDiscount_B_fkey" FOREIGN KEY ("B") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionProductTags" ADD CONSTRAINT "_PromotionProductTags_A_fkey" FOREIGN KEY ("A") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionProductTags" ADD CONSTRAINT "_PromotionProductTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionCustomerTags" ADD CONSTRAINT "_PromotionCustomerTags_A_fkey" FOREIGN KEY ("A") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionCustomerTags" ADD CONSTRAINT "_PromotionCustomerTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionRewardProductTags" ADD CONSTRAINT "_PromotionRewardProductTags_A_fkey" FOREIGN KEY ("A") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionRewardProductTags" ADD CONSTRAINT "_PromotionRewardProductTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryDiscounts" ADD CONSTRAINT "_CategoryDiscounts_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryDiscounts" ADD CONSTRAINT "_CategoryDiscounts_B_fkey" FOREIGN KEY ("B") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryTimedEvents" ADD CONSTRAINT "_CategoryTimedEvents_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryTimedEvents" ADD CONSTRAINT "_CategoryTimedEvents_B_fkey" FOREIGN KEY ("B") REFERENCES "timed_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionCategories" ADD CONSTRAINT "_PromotionCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionCategories" ADD CONSTRAINT "_PromotionCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionRewardCategories" ADD CONSTRAINT "_PromotionRewardCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionRewardCategories" ADD CONSTRAINT "_PromotionRewardCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TimedEventTags" ADD CONSTRAINT "_TimedEventTags_A_fkey" FOREIGN KEY ("A") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TimedEventTags" ADD CONSTRAINT "_TimedEventTags_B_fkey" FOREIGN KEY ("B") REFERENCES "timed_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductDiscounts" ADD CONSTRAINT "_ProductDiscounts_A_fkey" FOREIGN KEY ("A") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductDiscounts" ADD CONSTRAINT "_ProductDiscounts_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscountProductTags" ADD CONSTRAINT "_DiscountProductTags_A_fkey" FOREIGN KEY ("A") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscountProductTags" ADD CONSTRAINT "_DiscountProductTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscountCustomerTags" ADD CONSTRAINT "_DiscountCustomerTags_A_fkey" FOREIGN KEY ("A") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscountCustomerTags" ADD CONSTRAINT "_DiscountCustomerTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaxGroupTaxes" ADD CONSTRAINT "_TaxGroupTaxes_A_fkey" FOREIGN KEY ("A") REFERENCES "taxes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaxGroupTaxes" ADD CONSTRAINT "_TaxGroupTaxes_B_fkey" FOREIGN KEY ("B") REFERENCES "tax_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeviceTags" ADD CONSTRAINT "_DeviceTags_A_fkey" FOREIGN KEY ("A") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeviceTags" ADD CONSTRAINT "_DeviceTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderTags" ADD CONSTRAINT "_OrderTags_A_fkey" FOREIGN KEY ("A") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderTags" ADD CONSTRAINT "_OrderTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderProductTimedEvents" ADD CONSTRAINT "_OrderProductTimedEvents_A_fkey" FOREIGN KEY ("A") REFERENCES "order_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderProductTimedEvents" ADD CONSTRAINT "_OrderProductTimedEvents_B_fkey" FOREIGN KEY ("B") REFERENCES "timed_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderComboProductTimedEvents" ADD CONSTRAINT "_OrderComboProductTimedEvents_A_fkey" FOREIGN KEY ("A") REFERENCES "order_combo_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderComboProductTimedEvents" ADD CONSTRAINT "_OrderComboProductTimedEvents_B_fkey" FOREIGN KEY ("B") REFERENCES "timed_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomerTags" ADD CONSTRAINT "_CustomerTags_A_fkey" FOREIGN KEY ("A") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomerTags" ADD CONSTRAINT "_CustomerTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GiftCardProductTags" ADD CONSTRAINT "_GiftCardProductTags_A_fkey" FOREIGN KEY ("A") REFERENCES "gift_card_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GiftCardProductTags" ADD CONSTRAINT "_GiftCardProductTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuGroupGiftCardProducts" ADD CONSTRAINT "_MenuGroupGiftCardProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "gift_card_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuGroupGiftCardProducts" ADD CONSTRAINT "_MenuGroupGiftCardProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "menu_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
