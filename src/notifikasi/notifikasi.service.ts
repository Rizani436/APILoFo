import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateNotifikasiDTO, UpdateNotifikasiDTO } from './dto/notifikasi';
// import * as ExcelJS from 'exceljs';
// import { Response } from 'express';
// import * as fs from 'fs';
// import { File as MulterFile } from 'multer';

@Injectable()
export class NotifikasiService {
  private prisma = new PrismaClient();

  async create(dataData: CreateNotifikasiDTO) {
    return this.prisma.notifikasi.create({
      data: {
        idUser: dataData.idUser,
        idBarangTemuan: dataData.idBarangTemuan,
        pesanNotifikasi: dataData.pesanNotifikasi,
        read: dataData.read,
      },
    });
  }

  async getAll() {
    const notifikasi = await this.prisma.notifikasi.findMany();
    if (notifikasi.length == 0) {
      throw new HttpException('notifikasi tidak ada', HttpStatus.NOT_FOUND);
    }
    return notifikasi;
  }

  async getMyAll(id: string) {
    const notifikasi = await this.prisma.notifikasi.findMany({
      where: {
        idUser: id,
      },
    });
    if (notifikasi.length == 0) {
      throw new HttpException('notifikasi tidak ada', HttpStatus.NOT_FOUND);
    }

    return Promise.all(
      notifikasi.map(async (notif) => {
        if (notif.pesanNotifikasi == 'Telah menolak klaim barang Anda') {
          notif = await this.prisma.notifikasi.update({
            where: {
              notification_id: notif.notification_id,
            },
            data: {
              read: 'sudahDibaca',
            },
          });
        }

        return {
          ...notif,
        };
      }),
    );
  }

  async getById(id: number) {
    const idNumber = Number(id);
    const notifikasi = await this.prisma.notifikasi.findUnique({
      where: {
        notification_id: idNumber,
      },
    });

    if (!notifikasi) {
      throw new HttpException(
        'notifikasi tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );
    }
    return notifikasi;
  }

  async update(id: number, dataData: UpdateNotifikasiDTO) {
    const idNumber = Number(id);
    const notif =  this.prisma.notifikasi.update({
      where: { notification_id: idNumber },
      data: {
        idUser: dataData.idUser,
        idBarangTemuan: dataData.idBarangTemuan,
        pesanNotifikasi: dataData.pesanNotifikasi,
        read: dataData.read,
      },
    });
    if (!notif) {
      throw new HttpException(
        'notifikasi tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );
    }
    const barangTemuan = await this.prisma.barangTemuan.findUnique({
      where: {
        idBarangTemuan: (await notif).idBarangTemuan,
      },
    });

    return barangTemuan;
  }

  async delete(id: number) {
    const idNumber = Number(id);
    const notifikasi = await this.prisma.notifikasi.findUnique({
      where: {
        notification_id: idNumber,
      },
    });
    if (!notifikasi) {
      throw new HttpException(
        'notifikasi tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.prisma.notifikasi.delete({
      where: {
        notification_id: idNumber,
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
