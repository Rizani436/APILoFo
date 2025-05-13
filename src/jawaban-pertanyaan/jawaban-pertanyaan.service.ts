import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  CreateJawabanPertanyaanDto,
  UpdateJawabanPertanyaanDto,
} from './dto/jawaban-pertanyaan';
// import * as ExcelJS from 'exceljs';
// import { Response } from 'express';
// import * as fs from 'fs';
// import { File as MulterFile } from 'multer';

@Injectable()
export class JawabanPertanyaanService {
  private prisma = new PrismaClient();

  async create(dataData: CreateJawabanPertanyaanDto) {
    const existingJawabanPertanyaan = await this.prisma.jawabanPertanyaan.findFirst({
      where: {
        idBarangTemuan: dataData.idBarangTemuan,
        penjawab: dataData.penjawab,
      },
    });
    if (existingJawabanPertanyaan) {
      const idNumber = Number(existingJawabanPertanyaan.idJawabanPertanyaan);
      return this.prisma.jawabanPertanyaan.update({
        where: {
          idJawabanPertanyaan: idNumber,
        },
        data: {
          jawaban: dataData.jawaban,
        },
      });
    }
    return this.prisma.jawabanPertanyaan.create({
      data: {
        idBarangTemuan: dataData.idBarangTemuan,
        penanya: dataData.penanya,
        pertanyaan: dataData.pertanyaan,
        penjawab: dataData.penjawab,
        jawaban: dataData.jawaban,
      },
    });
  }

  async getAll() {
    const jawabanPertanyaan = await this.prisma.jawabanPertanyaan.findMany();
    if (jawabanPertanyaan.length == 0) {
      throw new HttpException('Jawaban/Pertanyaan tidak ada', HttpStatus.NOT_FOUND);
    }
    return jawabanPertanyaan;
  }

  async getMyAll(Penanya : String, IdBarangTemuan : String) {
    const penanya = String(Penanya); 
    const idBarangTemuan = String(IdBarangTemuan);
    const jawabanPertanyaan = await this.prisma.jawabanPertanyaan.findMany({
      where: {
        penanya,
        idBarangTemuan
      },
    });
    if (jawabanPertanyaan.length == 0) {
      throw new HttpException('Jawaban/Pertanyaan tidak ada', HttpStatus.NOT_FOUND);
    }
    return jawabanPertanyaan;
  }

  async getById(id: number) {
    const idNumber = Number(id);
    const jawabanPertanyaan = await this.prisma.jawabanPertanyaan.findUnique({
      where: {
        idJawabanPertanyaan: id,
      },
    });
    if (!jawabanPertanyaan) {
      throw new HttpException(
        'Jawaban/Pertanyaan tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );
    }
    return jawabanPertanyaan;
  }

  async update(id: number, dataData: UpdateJawabanPertanyaanDto) {
    const idNumber = Number(id);
    return this.prisma.jawabanPertanyaan.update({
      where: { idJawabanPertanyaan: id },
      data: {
        idBarangTemuan: dataData.idBarangTemuan,
        penanya: dataData.penanya,
        pertanyaan: dataData.pertanyaan,
        penjawab: dataData.penjawab,
        jawaban: dataData.jawaban,
      },
    });
  }

  async delete(id: number) {
    const idNumber = Number(id);
    const jawabanPertanyaan = await this.prisma.jawabanPertanyaan.findUnique({
      where: {
        idJawabanPertanyaan: idNumber,
      },
    });
    if (!jawabanPertanyaan) {
      throw new HttpException(
        'barang temuan tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.prisma.jawabanPertanyaan.delete({
      where: {
        idJawabanPertanyaan: idNumber,
      },
    });
  }

  // async importMerchant(file: MulterFile) {
  //   if (!file) {
  //     throw new HttpException('File tidak ditemukan', HttpStatus.NOT_FOUND);
  //   }

  //   const filePath = file.path;
  //   const workbook = new ExcelJS.Workbook();
  //   await workbook.xlsx.readFile(filePath);
  //   const worksheet = workbook.worksheets[0];

  //   const data = [];

  //   // Mulai membaca baris dari index 2 (karena baris pertama adalah header)
  //   let headers: string[] = [];
  //   worksheet.eachRow((row, rowNumber) => {
  //     if (rowNumber === 1) {
  //       // Baca header dari baris pertama
  //       headers = row.values as string[];
  //     } else {
  //       const values = row.values as string[];
  //       const id_merchant = values[headers.indexOf('id_merchant')] ?? null;
  //       const nama_merchant = values[headers.indexOf('nama_merchant')] ?? null;
  //       const address = values[headers.indexOf('address')] ?? null;
  //       data.push({ id_merchant, nama_merchant, address });
  //     }
  //   });

  //   const hasNullValue = data.some((obj) =>
  //     Object.values(obj).some((value) => value === null),
  //   );

  //   if (hasNullValue) {
  //     fs.unlinkSync(filePath);
  //     throw new HttpException(
  //       'Data tidak boleh kosong',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   // Simpan ke database
  //   for (const merchant of data) {
  //     await this.prisma.merchant.upsert({
  //       where: { id_merchant: merchant.id_merchant },
  //       update: merchant,
  //       create: merchant,
  //     });
  //   }

  //   //   Hapus file setelah diproses
  //   fs.unlinkSync(filePath);

  //   return { message: 'Import berhasil', count: data.length };
  // }

  // async exportMerchant(res: Response) {
  //   const data = await this.prisma.merchant.findMany();
  //   if (data.length == 0) {
  //     throw new HttpException('No Merchant found', HttpStatus.NOT_FOUND);
  //   }

  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet('Merchant');
  //   worksheet.addRow(['id_merchant', 'nama_merchant', 'address']);
  //   data.forEach((merchant) => {
  //     worksheet.addRow([
  //       merchant.id_merchant,
  //       merchant.nama_merchant,
  //       merchant.address,
  //     ]);
  //   });
  //   res.setHeader(
  //     'Content-Type',
  //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //   );
  //   res.setHeader('Content-Disposition', 'attachment; filename=merchant.xlsx');

  //   // Kirim file sebagai response
  //   await workbook.xlsx.write(res);
  //   res.end();
  // }

  // async searchMerchant(search: string, fields?: string) {
  //   const allowedFields = [
  //     'id_merchant',
  //     'nama_merchant',
  //     'address',
  //     'address.location',
  //     'address.longitude',
  //     'address.latitude',
  //   ];

  //   let searchFields = allowedFields;
  //   if (fields) {
  //     const requestedFields = fields.split(',');
  //     searchFields = requestedFields.filter((field) =>
  //       allowedFields.includes(field),
  //     );
  //   }

  //   const orConditions = searchFields.map((field) => ({
  //     [field]: { contains: search, mode: 'insensitive', },
  //   }));

  //   const merchants = await this.prisma.merchant.findMany({
  //     where: {
  //       OR: orConditions,
  //     },
  //   });

  //   if (merchants.length === 0) {
  //     throw new HttpException('No merchants found', HttpStatus.NOT_FOUND);
  //   }
  //   return merchants;
  // }
}
