/*
  Warnings:

  - A unique constraint covering the columns `[foodicsId]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `foodicsId` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "GroupProducts" (
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
    "groupId" TEXT NOT NULL,

    CONSTRAINT "GroupProducts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupProducts_sku_key" ON "GroupProducts"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Group_foodicsId_key" ON "Group"("foodicsId");

-- AddForeignKey
ALTER TABLE "GroupProducts" ADD CONSTRAINT "GroupProducts_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
