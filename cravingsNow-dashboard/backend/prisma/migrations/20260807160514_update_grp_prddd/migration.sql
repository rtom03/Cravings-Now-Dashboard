-- DropForeignKey
ALTER TABLE "GroupProducts" DROP CONSTRAINT "GroupProducts_groupId_fkey";

-- AlterTable
ALTER TABLE "GroupProducts" ALTER COLUMN "is_active" DROP NOT NULL,
ALTER COLUMN "is_stock_product" DROP NOT NULL,
ALTER COLUMN "is_non_revenue" DROP NOT NULL,
ALTER COLUMN "is_ready" DROP NOT NULL,
ALTER COLUMN "groupId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "GroupProducts" ADD CONSTRAINT "GroupProducts_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
