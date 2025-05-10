/*
  Warnings:

  - The values [Accessoris,Document] on the enum `KategoriBarang` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "KategoriBarang_new" AS ENUM ('Aksesoris', 'Kendaraan', 'Elektronik', 'Dokumen', 'DLL');
ALTER TABLE "BarangHilang" ALTER COLUMN "kategoriBarang" TYPE "KategoriBarang_new" USING ("kategoriBarang"::text::"KategoriBarang_new");
ALTER TABLE "BarangTemuan" ALTER COLUMN "kategoriBarang" TYPE "KategoriBarang_new" USING ("kategoriBarang"::text::"KategoriBarang_new");
ALTER TYPE "KategoriBarang" RENAME TO "KategoriBarang_old";
ALTER TYPE "KategoriBarang_new" RENAME TO "KategoriBarang";
DROP TYPE "KategoriBarang_old";
COMMIT;
