-- CreateEnum
CREATE TYPE "KategoriBarang" AS ENUM ('Accessoris', 'Kendaraan', 'Elektronik', 'Document', 'DLL');

-- CreateEnum
CREATE TYPE "StatusBarang" AS ENUM ('Diterima', 'Ditolak', 'Menunggu', 'Selesai');

-- CreateEnum
CREATE TYPE "NotifStatus" AS ENUM ('belumDibaca', 'sudahDibaca');

-- CreateTable
CREATE TABLE "Admin" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "noHP" TEXT NOT NULL,
    "pictUrl" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "jenisKelamin" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "noHP" TEXT NOT NULL,
    "pictUrl" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "BarangHilang" (
    "idBarangHilang" TEXT NOT NULL,
    "uploader" TEXT NOT NULL,
    "namaBarang" TEXT NOT NULL,
    "kategoriBarang" "KategoriBarang" NOT NULL,
    "tanggalHilang" TIMESTAMP(3) NOT NULL,
    "tempatHilang" TEXT NOT NULL,
    "kotaKabupaten" TEXT NOT NULL,
    "informasiDetail" TEXT NOT NULL,
    "noHP" TEXT NOT NULL,
    "pictUrl" TEXT NOT NULL,
    "status" "StatusBarang" DEFAULT 'Menunggu',
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BarangHilang_pkey" PRIMARY KEY ("idBarangHilang")
);

-- CreateTable
CREATE TABLE "BarangTemuan" (
    "idBarangTemuan" TEXT NOT NULL,
    "uploader" TEXT NOT NULL,
    "namaBarang" TEXT NOT NULL,
    "kategoriBarang" "KategoriBarang" NOT NULL,
    "tanggalPenemuan" TIMESTAMP(3) NOT NULL,
    "tempatPenemuan" TEXT NOT NULL,
    "kotaKabupaten" TEXT NOT NULL,
    "informasiDetail" TEXT NOT NULL,
    "noHP" TEXT NOT NULL,
    "pictUrl" TEXT NOT NULL,
    "status" "StatusBarang" NOT NULL DEFAULT 'Menunggu',
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BarangTemuan_pkey" PRIMARY KEY ("idBarangTemuan")
);

-- CreateTable
CREATE TABLE "JawabanPertanyaan" (
    "id" SERIAL NOT NULL,
    "idBarangTemuan" TEXT NOT NULL,
    "penanya" TEXT NOT NULL,
    "pertanyaan" TEXT NOT NULL,
    "penjawab" TEXT NOT NULL,
    "jawaban" TEXT NOT NULL,

    CONSTRAINT "JawabanPertanyaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifikasi" (
    "notification_id" SERIAL NOT NULL,
    "idUser" TEXT NOT NULL,
    "idBarangTemuan" TEXT NOT NULL,
    "pesanNotifikasi" TEXT NOT NULL,
    "read" "NotifStatus" NOT NULL DEFAULT 'belumDibaca',

    CONSTRAINT "Notifikasi_pkey" PRIMARY KEY ("notification_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "BarangHilang" ADD CONSTRAINT "BarangHilang_uploader_fkey" FOREIGN KEY ("uploader") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarangTemuan" ADD CONSTRAINT "BarangTemuan_uploader_fkey" FOREIGN KEY ("uploader") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JawabanPertanyaan" ADD CONSTRAINT "JawabanPertanyaan_idBarangTemuan_fkey" FOREIGN KEY ("idBarangTemuan") REFERENCES "BarangTemuan"("idBarangTemuan") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JawabanPertanyaan" ADD CONSTRAINT "JawabanPertanyaan_penjawab_fkey" FOREIGN KEY ("penjawab") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifikasi" ADD CONSTRAINT "Notifikasi_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifikasi" ADD CONSTRAINT "Notifikasi_idBarangTemuan_fkey" FOREIGN KEY ("idBarangTemuan") REFERENCES "BarangTemuan"("idBarangTemuan") ON DELETE CASCADE ON UPDATE CASCADE;
