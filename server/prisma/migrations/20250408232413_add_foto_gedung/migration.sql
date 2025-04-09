/*
  Warnings:

  - Added the required column `foto_gedung` to the `Gedung` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gedung" ADD COLUMN     "foto_gedung" TEXT NOT NULL;
