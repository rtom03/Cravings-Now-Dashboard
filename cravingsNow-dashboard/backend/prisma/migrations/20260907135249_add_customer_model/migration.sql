/*
  Warnings:

  - You are about to drop the column `foodicsId` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the `_DeviceTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `devices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sections` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tables` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_DeviceTags" DROP CONSTRAINT "_DeviceTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_DeviceTags" DROP CONSTRAINT "_DeviceTags_B_fkey";

-- DropForeignKey
ALTER TABLE "devices" DROP CONSTRAINT "devices_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_table_id_fkey";

-- DropForeignKey
ALTER TABLE "sections" DROP CONSTRAINT "sections_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "tables" DROP CONSTRAINT "tables_section_id_fkey";

-- DropIndex
DROP INDEX "customers_foodicsId_key";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "foodicsId",
ADD COLUMN     "password" TEXT NOT NULL;

-- DropTable
DROP TABLE "_DeviceTags";

-- DropTable
DROP TABLE "devices";

-- DropTable
DROP TABLE "sections";

-- DropTable
DROP TABLE "tables";

-- CreateTable
CREATE TABLE "MobileNotification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MobileNotification_id_key" ON "MobileNotification"("id");
