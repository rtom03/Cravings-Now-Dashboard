-- AlterTable
ALTER TABLE "GroupProducts" ADD COLUMN     "foodicsSandBoxId" TEXT;

-- AlterTable
ALTER TABLE "branches" ADD COLUMN     "foodicsSandBoxId" TEXT;

-- AlterTable
ALTER TABLE "charges" ADD COLUMN     "foodicsSandBoxId" TEXT;

-- AlterTable
ALTER TABLE "discounts" ADD COLUMN     "foodicsSandBoxId" TEXT;

-- AlterTable
ALTER TABLE "modifier_options" ADD COLUMN     "foodicsSandBoxId" TEXT;

-- AlterTable
ALTER TABLE "tax_groups" ADD COLUMN     "foodicsSandBoxId" TEXT;

-- AlterTable
ALTER TABLE "taxes" ADD COLUMN     "foodicsSandBoxId" TEXT;
