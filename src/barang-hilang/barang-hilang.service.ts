import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { KategoriBarang, PrismaClient } from '@prisma/client';
import {
  CreateBarangHilangDto,
  UpdateBarangHilangDto,
} from './dto/barang-hilang';
// import * as ExcelJS from 'exceljs';
// import { Response } from 'express';
import * as fs from 'fs';
import { File as MulterFile } from 'multer';

@Injectable()
export class BarangHilangService {
  private prisma = new PrismaClient();

  async create(dataData: CreateBarangHilangDto, file: MulterFile) {
    const url = `https://backend-web-admin.onrender.com/uploads/barang-hilang/${file.filename}`;
    return this.prisma.barangHilang.create({
      data: {
        uploader: dataData.userId,
        namaBarang: dataData.namaBarang,
        kategoriBarang: dataData.kategoriBarang,
        tanggalHilang: dataData.tanggalHilang,
        tempatHilang: dataData.tempatHilang,
        kotaKabupaten: dataData.kotaKabupaten,
        informasiDetail: dataData.informasiDetail,
        noHP: dataData.noHP,
        pictUrl: url,
        status: dataData.status,
        latitude: dataData.latitude,
        longitude: dataData.longitude,
      },
    });
  }

  async getAll() {
    const barangHilang = await this.prisma.barangHilang.findMany();
    if (barangHilang.length == 0) {
      throw new HttpException('barang Hilang tidak ada', HttpStatus.NOT_FOUND);
    }
    return barangHilang;
  }

  async getById(id: string) {
    const barangHilang = await this.prisma.barangHilang.findUnique({
      where: {
        idBarangHilang: id,
      },
    });
    if (!barangHilang) {
      throw new HttpException(
        'barang Hilang tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );
    }
    return barangHilang;
  }

  async update(id: string, dataData: UpdateBarangHilangDto) {
    const barangHilang = await this.prisma.barangHilang.findUnique({
      where: {
        idBarangHilang: id,
      },
    });
    if (!barangHilang) {
      throw new HttpException(
        'barang Hilang tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.prisma.barangHilang.update({
      where: { idBarangHilang: id },
      data: {
        uploader: dataData.userId,
        namaBarang: dataData.namaBarang,
        kategoriBarang: dataData.kategoriBarang,
        tanggalHilang: dataData.tanggalHilang,
        tempatHilang: dataData.tempatHilang,
        kotaKabupaten: dataData.kotaKabupaten,
        informasiDetail: dataData.informasiDetail,
        noHP: dataData.noHP,
        pictUrl: dataData.pictUrl,
        status: dataData.status,
        latitude: dataData.latitude,
        longitude: dataData.longitude,
      },
    });
  }

  async delete(id: string) {
    const barangHilang = await this.prisma.barangHilang.findUnique({
      where: {
        idBarangHilang: id,
      },
    });
    if (!barangHilang) {
      throw new HttpException(
        'barang Hilang tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );
    }
    if (barangHilang.pictUrl) {
      const filename = barangHilang.pictUrl.split('/').pop();
      const filePath = `./uploads/barang-hilang/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File deleted successfully');
        }
      });
    }

    return this.prisma.barangHilang.delete({
      where: {
        idBarangHilang: id,
      },
    });
  }
  async getMyAll(userId: string) {
    const barangHilang = await this.prisma.barangHilang.findMany({
      where: {
        uploader: userId,
      },
    });
    if (barangHilang.length == 0) {
      throw new HttpException('barang hilang tidak ada', HttpStatus.NOT_FOUND);
    }
    return barangHilang;
  }

  async getOtherAll(userId: string, kategori: any) {
    if (typeof kategori === 'object' && kategori !== null) {
      kategori = kategori.kategoriBarang || '';
    }

    let barangHilang;

    if (!kategori || kategori === '') {
      barangHilang = await this.prisma.barangHilang.findMany({
        where: {
          status: 'Diterima',
          NOT: { uploader: userId },
        },
      });
    } else if (kategori === 'All') {
      barangHilang = await this.prisma.barangHilang.findMany({
        where: {
          status: 'Diterima',
          NOT: { uploader: userId },
        },
      });
    } else if (
      kategori === 'Aksesoris' ||
      kategori === 'Dokumen' ||
      kategori === 'Elektronik' ||
      kategori === 'Kendaraan' ||
      kategori === 'DLL'
    ) {
      barangHilang = await this.prisma.barangHilang.findMany({
        where: {
          status: 'Diterima',
          NOT: { uploader: userId },
          kategoriBarang: kategori,
        },
      });
    } else {
      barangHilang = '';
    }

    if (!barangHilang || barangHilang.length === 0) {
      throw new HttpException('barang hilang tidak ada', HttpStatus.NOT_FOUND);
    }

    return barangHilang;
  }

  async updatengambar(id: string, dataData: UpdateBarangHilangDto, file: MulterFile) {
    const barangHilang = await this.prisma.barangHilang.findUnique({
      where: {
        idBarangHilang: id,
      },
    });
    if (!barangHilang) {
      throw new HttpException(
        'barang hilang tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );
    }
    if (barangHilang.pictUrl&&barangHilang.pictUrl !== dataData.pictUrl) {
      const filename = barangHilang.pictUrl.split('/').pop();
      const filePath = `./uploads/barang-hilang/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File deleted successfully');
        }
      });
    }
    console.log(dataData.pictUrl??'');
    const url = `https://backend-web-admin.onrender.com/uploads/barang-hilang/${file.filename}`;
    return this.prisma.barangHilang.update({
      where: { idBarangHilang: id },
      data: {
        uploader: dataData.userId,
        namaBarang: dataData.namaBarang,
        kategoriBarang: dataData.kategoriBarang,
        tanggalHilang: dataData.tanggalHilang,
        tempatHilang: dataData.tempatHilang,
        kotaKabupaten: dataData.kotaKabupaten,
        informasiDetail: dataData.informasiDetail,
        noHP: dataData.noHP,
        pictUrl: url,
        status: dataData.status,
        latitude: dataData.latitude,
        longitude: dataData.longitude,
      },
    });
  }

  async updateGambar(id: string, file: MulterFile) {
          const barangHilang = await this.prisma.barangHilang.findUnique({
            where: { idBarangHilang: id },
          });
          if (!barangHilang) {
            throw new HttpException('barang hilang tidak ditemukan', HttpStatus.NOT_FOUND);
          }
          if (barangHilang.pictUrl) {
            const filename = barangHilang.pictUrl.split('/').pop();
            const filePath = `./uploads/barang-hilang/${filename}`;
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error('Error deleting file:', err);
              } else {
                console.log('File deleted successfully');
              }
            });
          }
          const url = `https://backend-web-admin.onrender.com/uploads/barang-hilang/${file.filename}`;
          return this.prisma.barangHilang.update({
            where: { idBarangHilang: id },
            data: {
              pictUrl: url,
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
