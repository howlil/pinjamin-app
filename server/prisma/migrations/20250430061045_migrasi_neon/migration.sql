/*
  Warnings:

  - The primary key for the `FasilitasGedung` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `FasilitasGedung` table. All the data in the column will be lost.
  - You are about to drop the column `icon_url` on the `FasilitasGedung` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `FasilitasGedung` table. All the data in the column will be lost.
  - You are about to drop the column `nama_fasilitas` on the `FasilitasGedung` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `FasilitasGedung` table. All the data in the column will be lost.
  - Added the required column `fasilitas_id` to the `FasilitasGedung` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FasilitasGedung" DROP CONSTRAINT "FasilitasGedung_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "icon_url",
DROP COLUMN "id",
DROP COLUMN "nama_fasilitas",
DROP COLUMN "updatedAt",
ADD COLUMN     "fasilitas_id" TEXT NOT NULL,
ADD CONSTRAINT "FasilitasGedung_pkey" PRIMARY KEY ("fasilitas_id", "gedung_id");

-- CreateTable
CREATE TABLE "Fasilitas" (
    "id" TEXT NOT NULL,
    "nama_fasilitas" TEXT NOT NULL,
    "icon_url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fasilitas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FasilitasGedung" ADD CONSTRAINT "FasilitasGedung_fasilitas_id_fkey" FOREIGN KEY ("fasilitas_id") REFERENCES "Fasilitas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
