/*
  Warnings:

  - The primary key for the `JawabanPertanyaan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `JawabanPertanyaan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JawabanPertanyaan" DROP CONSTRAINT "JawabanPertanyaan_pkey",
DROP COLUMN "id",
ADD COLUMN     "idJawabanPertanyaan" SERIAL NOT NULL,
ADD CONSTRAINT "JawabanPertanyaan_pkey" PRIMARY KEY ("idJawabanPertanyaan");
