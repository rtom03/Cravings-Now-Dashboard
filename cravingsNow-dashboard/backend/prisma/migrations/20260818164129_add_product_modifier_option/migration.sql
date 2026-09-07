/*
  Warnings:

  - You are about to drop the column `modifier_id` on the `modifier_options` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "modifier_option_branches" DROP CONSTRAINT "modifier_option_branches_modifier_option_id_fkey";

-- DropForeignKey
ALTER TABLE "modifier_options" DROP CONSTRAINT "modifier_options_modifier_id_fkey";

-- AlterTable
ALTER TABLE "modifier_options" DROP COLUMN "modifier_id";

-- CreateTable
CREATE TABLE "GroupProductModifierOption" (
    "groupProductId" TEXT NOT NULL,
    "modifierOptionId" TEXT NOT NULL,

    CONSTRAINT "GroupProductModifierOption_pkey" PRIMARY KEY ("groupProductId","modifierOptionId")
);

-- AddForeignKey
ALTER TABLE "GroupProductModifierOption" ADD CONSTRAINT "GroupProductModifierOption_groupProductId_fkey" FOREIGN KEY ("groupProductId") REFERENCES "GroupProducts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupProductModifierOption" ADD CONSTRAINT "GroupProductModifierOption_modifierOptionId_fkey" FOREIGN KEY ("modifierOptionId") REFERENCES "modifier_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;
