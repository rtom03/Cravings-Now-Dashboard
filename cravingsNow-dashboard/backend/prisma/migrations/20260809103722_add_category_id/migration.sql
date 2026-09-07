-- AlterTable
ALTER TABLE "GroupProducts" ADD COLUMN     "category_id" TEXT;

-- AddForeignKey
ALTER TABLE "GroupProducts" ADD CONSTRAINT "GroupProducts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
