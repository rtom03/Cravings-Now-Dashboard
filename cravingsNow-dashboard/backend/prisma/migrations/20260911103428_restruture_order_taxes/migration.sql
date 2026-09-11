/*
  Warnings:

  - You are about to drop the `_TaxGroupTaxes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `taxGroupId` to the `taxes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_TaxGroupTaxes" DROP CONSTRAINT "_TaxGroupTaxes_A_fkey";

-- DropForeignKey
ALTER TABLE "_TaxGroupTaxes" DROP CONSTRAINT "_TaxGroupTaxes_B_fkey";

-- AlterTable
ALTER TABLE "taxes" ADD COLUMN     "taxGroupId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_TaxGroupTaxes";

-- AddForeignKey
ALTER TABLE "taxes" ADD CONSTRAINT "taxes_taxGroupId_fkey" FOREIGN KEY ("taxGroupId") REFERENCES "tax_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
