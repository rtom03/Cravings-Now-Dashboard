-- AlterTable
ALTER TABLE "GroupProducts" ADD COLUMN     "tax_group_id" TEXT;

-- AlterTable
ALTER TABLE "tax_groups" ADD COLUMN     "reference" TEXT;

-- AddForeignKey
ALTER TABLE "GroupProducts" ADD CONSTRAINT "GroupProducts_tax_group_id_fkey" FOREIGN KEY ("tax_group_id") REFERENCES "tax_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
