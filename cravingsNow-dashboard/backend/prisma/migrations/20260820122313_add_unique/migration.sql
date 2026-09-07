/*
  Warnings:

  - You are about to drop the `GroupProductModifierOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ModifierProducts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `modifier_option_branches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `modifiers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `branches` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "GroupProductModifierOption" DROP CONSTRAINT "GroupProductModifierOption_groupProductId_fkey";

-- DropForeignKey
ALTER TABLE "GroupProductModifierOption" DROP CONSTRAINT "GroupProductModifierOption_modifierOptionId_fkey";

-- DropForeignKey
ALTER TABLE "_ModifierProducts" DROP CONSTRAINT "_ModifierProducts_A_fkey";

-- DropForeignKey
ALTER TABLE "_ModifierProducts" DROP CONSTRAINT "_ModifierProducts_B_fkey";

-- DropForeignKey
ALTER TABLE "modifier_option_branches" DROP CONSTRAINT "modifier_option_branches_branchId_fkey";

-- DropTable
DROP TABLE "GroupProductModifierOption";

-- DropTable
DROP TABLE "_ModifierProducts";

-- DropTable
DROP TABLE "modifier_option_branches";

-- DropTable
DROP TABLE "modifiers";

-- CreateTable
CREATE TABLE "Modifier" (
    "id" TEXT NOT NULL,
    "foodicsId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameLocalized" TEXT,
    "reference" TEXT,
    "isReady" BOOLEAN,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Modifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModifierOptionBranch" (
    "modifierOptionId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL,
    "isInStock" BOOLEAN NOT NULL,

    CONSTRAINT "ModifierOptionBranch_pkey" PRIMARY KEY ("modifierOptionId","branchId")
);

-- CreateTable
CREATE TABLE "ModifierOptionModifier" (
    "modifierId" TEXT NOT NULL,
    "modifierOptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModifierOptionModifier_pkey" PRIMARY KEY ("modifierId","modifierOptionId")
);

-- CreateTable
CREATE TABLE "GroupProductModifier" (
    "groupProductId" TEXT NOT NULL,
    "modifierId" TEXT NOT NULL,
    "isSplittableInHalf" BOOLEAN,
    "uniqueOptions" BOOLEAN,
    "minimumOptions" INTEGER,
    "maximumOptions" INTEGER,
    "freeOptions" INTEGER,
    "defaultOptionsIds" JSONB,
    "excludedOptionsIds" JSONB,
    "index" INTEGER,

    CONSTRAINT "GroupProductModifier_pkey" PRIMARY KEY ("groupProductId","modifierId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Modifier_foodicsId_key" ON "Modifier"("foodicsId");

-- CreateIndex
CREATE UNIQUE INDEX "branches_id_key" ON "branches"("id");

-- AddForeignKey
ALTER TABLE "ModifierOptionBranch" ADD CONSTRAINT "ModifierOptionBranch_modifierOptionId_fkey" FOREIGN KEY ("modifierOptionId") REFERENCES "modifier_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModifierOptionBranch" ADD CONSTRAINT "ModifierOptionBranch_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModifierOptionModifier" ADD CONSTRAINT "ModifierOptionModifier_modifierId_fkey" FOREIGN KEY ("modifierId") REFERENCES "Modifier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModifierOptionModifier" ADD CONSTRAINT "ModifierOptionModifier_modifierOptionId_fkey" FOREIGN KEY ("modifierOptionId") REFERENCES "modifier_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupProductModifier" ADD CONSTRAINT "GroupProductModifier_groupProductId_fkey" FOREIGN KEY ("groupProductId") REFERENCES "GroupProducts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupProductModifier" ADD CONSTRAINT "GroupProductModifier_modifierId_fkey" FOREIGN KEY ("modifierId") REFERENCES "Modifier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
