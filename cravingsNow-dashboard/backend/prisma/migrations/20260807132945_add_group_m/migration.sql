/*
  Warnings:

  - You are about to drop the column `name_localized` on the `Group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "name_localized",
ADD COLUMN     "nameLocalized" TEXT;
