/*
  Warnings:

  - A unique constraint covering the columns `[foodicsId]` on the table `GroupProducts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `foodicsId` to the `GroupProducts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupProducts" ADD COLUMN     "foodicsId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GroupProducts_foodicsId_key" ON "GroupProducts"("foodicsId");
