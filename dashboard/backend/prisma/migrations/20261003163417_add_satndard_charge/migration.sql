/*
  Warnings:

  - The values [AMOUNT,PERCENTAGE] on the enum `ChargeType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `deleted_at` on the `charges` table. All the data in the column will be lost.
  - You are about to drop the column `foodicsId` on the `charges` table. All the data in the column will be lost.
  - You are about to drop the column `foodicsSandBoxId` on the `charges` table. All the data in the column will be lost.
  - You are about to drop the column `is_auto_applied` on the `charges` table. All the data in the column will be lost.
  - You are about to drop the column `is_open_charge` on the `charges` table. All the data in the column will be lost.
  - You are about to drop the column `name_localized` on the `charges` table. All the data in the column will be lost.
  - You are about to drop the column `order_types` on the `charges` table. All the data in the column will be lost.
  - You are about to drop the column `tax_group_id` on the `charges` table. All the data in the column will be lost.
  - You are about to drop the `_BranchCharges` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `calculation` to the `charges` table without a default value. This is not possible if the table is not empty.
  - Made the column `type` on table `charges` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ChargeCalculation" AS ENUM ('Fixed', 'Percentage');

-- AlterEnum
BEGIN;
CREATE TYPE "ChargeType_new" AS ENUM ('Delivery', 'Service', 'ProcessingFee');
ALTER TABLE "charges" ALTER COLUMN "type" TYPE "ChargeType_new" USING ("type"::text::"ChargeType_new");
ALTER TYPE "ChargeType" RENAME TO "ChargeType_old";
ALTER TYPE "ChargeType_new" RENAME TO "ChargeType";
DROP TYPE "public"."ChargeType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "_BranchCharges" DROP CONSTRAINT "_BranchCharges_A_fkey";

-- DropForeignKey
ALTER TABLE "_BranchCharges" DROP CONSTRAINT "_BranchCharges_B_fkey";

-- DropForeignKey
ALTER TABLE "charges" DROP CONSTRAINT "charges_tax_group_id_fkey";

-- DropForeignKey
ALTER TABLE "order_charges" DROP CONSTRAINT "order_charges_charge_id_fkey";

-- DropIndex
DROP INDEX "charges_foodicsId_key";

-- DropIndex
DROP INDEX "charges_tax_group_id_key";

-- AlterTable
ALTER TABLE "charges" DROP COLUMN "deleted_at",
DROP COLUMN "foodicsId",
DROP COLUMN "foodicsSandBoxId",
DROP COLUMN "is_auto_applied",
DROP COLUMN "is_open_charge",
DROP COLUMN "name_localized",
DROP COLUMN "order_types",
DROP COLUMN "tax_group_id",
ADD COLUMN     "calculation" "ChargeCalculation" NOT NULL,
ADD COLUMN     "cap_amount" DOUBLE PRECISION,
ADD COLUMN     "flat_add_on" DOUBLE PRECISION,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "min_amount" DOUBLE PRECISION,
ALTER COLUMN "type" SET NOT NULL;

-- DropTable
DROP TABLE "_BranchCharges";
