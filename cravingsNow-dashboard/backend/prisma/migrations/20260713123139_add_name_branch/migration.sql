/*
  Warnings:

  - You are about to drop the column `foodicsId` on the `branches` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[foodics_id]` on the table `branches` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `foodics_id` to the `branches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "branches" DROP COLUMN "foodicsId",
ADD COLUMN     "foodics_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "branches_foodics_id_key" ON "branches"("foodics_id");
