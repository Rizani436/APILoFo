/*
  Warnings:

  - You are about to drop the column `tanggalPenemuan` on the `BarangTemuan` table. All the data in the column will be lost.
  - You are about to drop the column `tempatPenemuan` on the `BarangTemuan` table. All the data in the column will be lost.
  - Added the required column `tanggalTemuan` to the `BarangTemuan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tempatTemuan` to the `BarangTemuan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BarangTemuan" DROP COLUMN "tanggalPenemuan",
DROP COLUMN "tempatPenemuan",
ADD COLUMN     "tanggalTemuan" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tempatTemuan" TEXT NOT NULL;
