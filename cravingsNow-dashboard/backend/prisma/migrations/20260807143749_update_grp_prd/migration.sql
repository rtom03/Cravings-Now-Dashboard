/*
  Warnings:

  - Added the required column `pivot` to the `GroupProducts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupProducts" ADD COLUMN     "pivot" JSONB NOT NULL;
