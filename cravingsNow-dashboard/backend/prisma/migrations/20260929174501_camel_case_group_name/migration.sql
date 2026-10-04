/*
  Warnings:

  - You are about to drop the column `group_name` on the `GroupProducts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GroupProducts" DROP COLUMN "group_name",
ADD COLUMN     "groupName" TEXT;
