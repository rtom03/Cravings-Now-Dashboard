/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Group` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Group_id_key" ON "Group"("id");
