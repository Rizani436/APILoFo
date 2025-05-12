import {
  Injectable,
  HttpException,
  HttpStatus,
  UploadedFile,
} from '@nestjs/common';
import { KategoriBarang, PrismaClient } from '@prisma/client';
import {
  CreateBarangTemuanDto,
  UpdateBarangTemuanDto,
} from './dto/barang-temuan';
import { File as MulterFile } from 'multer';
// import * as ExcelJS from 'exceljs';
// import { Response } from 'express';
import * as fs from 'fs';
// import { File as MulterFile } from 'multer';

@Injectable()
export class BarangTemuanService {
  private prisma = new PrismaClient();

  async create(dataData: CreateBarangTemuanDto, file: MulterFile) {
    const url = `https://backend-web-admin.onrender.com/uploads/barang-temuan/${file.filename}`;
    return this.prisma.barangTemuan.create({
      data: {
        uploader: dataData.userId,
        namaBarang: dataData.namaBarang,
        kategoriBarang: dataData.kategoriBarang,
        tanggalTemuan: dataData.tanggalTemuan,
        tempatTemuan: dataData.tempatTemuan,
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
    const barangTemuan = await this.prisma.barangTemuan.findMany();
    if (barangTemuan.length == 0) {
      throw new HttpException('barang temuan tidak ada', HttpStatus.NOT_FOUND);
    }
    return barangTemuan;
  }

  async getById(id: string) {
    const barangTemuan = await this.prisma.barangTemuan.findUnique({
      where: {
        idBarangTemuan: id,
      },
    });
    if (!barangTemuan) {
      throw new HttpException(
        'barang temuan tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );
    }
    return barangTemuan;
  }

  async update(id: string, dataData: UpdateBarangTemuanDto) {
    const barangTemuan = await this.prisma.barangTemuan.findUnique({
      where: {
        idBarangTemuan: id,
      },
    });
    if (!barangTemuan) {
      throw new HttpException(
        'barang temuan tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.prisma.barangTemuan.update({
      where: { idBarangTemuan: id },
      data: {
        uploader: dataData.userId,
        namaBarang: dataData.namaBarang,
        kategoriBarang: dataData.kategoriBarang,
        tanggalTemuan: dataData.tanggalTemuan,
        tempatTemuan: dataData.tempatTemuan,
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
    const barangTemuan = await this.prisma.barangTemuan.findUnique({
      where: {
        idBarangTemuan: id,
      },
    });
    if (!barangTemuan) {
      throw new HttpException(
        'barang temuan tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );
    }
    if (barangTemuan.pictUrl) {
      const filename = barangTemuan.pictUrl.split('/').pop();
      const filePath = `./uploads/barang-temuan/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File deleted successfully');
        }
      });
    }

    return this.prisma.barangTemuan.delete({
      where: {
        idBarangTemuan: id,
      },
    });
  }

  async getMyAll(userId: string) {
    const barangTemuan = await this.prisma.barangTemuan.findMany({
      where: {
        uploader: userId,
      },
    });
    if (barangTemuan.length == 0) {
      throw new HttpException('barang temuan tidak ada', HttpStatus.NOT_FOUND);
    }
    return barangTemuan;
  }

  async getOtherAll(userId: string, kategori: any) {
    if (typeof kategori === 'object' && kategori !== null) {
      kategori = kategori.kategoriBarang || '';
    }

    let barangTemuan;

    if (!kategori || kategori === '') {
      barangTemuan = await this.prisma.barangTemuan.findMany({
        where: {
          status: 'Diterima',
          NOT: { uploader: userId },
        },
      });
    } else if (kategori === 'All') {
      barangTemuan = await this.prisma.barangTemuan.findMany({
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
      barangTemuan = await this.prisma.barangTemuan.findMany({
        where: {
          status: 'Diterima',
          NOT: { uploader: userId },
          kategoriBarang: kategori,
        },
      });
    } else {
      barangTemuan = '';
    }

    if (!barangTemuan || barangTemuan.length === 0) {
      throw new HttpException('barang temuan tidak ada', HttpStatus.NOT_FOUND);
    }

    return barangTemuan;
  }

  async updatengambar(id: string, dataData: UpdateBarangTemuanDto, file: MulterFile) {
      const barangTemuan = await this.prisma.barangTemuan.findUnique({
        where: {
          idBarangTemuan: id,
        },
      });
      if (!barangTemuan) {
        throw new HttpException(
          'barang temuan tidak ditemukan',
          HttpStatus.NOT_FOUND,
        );
      }
      if (barangTemuan.pictUrl) {
        const filename = barangTemuan.pictUrl.split('/').pop();
        const filePath = `./uploads/barang-temuan/${filename}`;
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          } else {
            console.log('File deleted successfully');
          }
        });
      }
      const url = `https://backend-web-admin.onrender.com/uploads/barang-temuan/${file.filename}`;
      return this.prisma.barangTemuan.update({
        where: { idBarangTemuan: id },
        data: {
          uploader: dataData.userId,
          namaBarang: dataData.namaBarang,
          kategoriBarang: dataData.kategoriBarang,
          tanggalTemuan: dataData.tanggalTemuan,
          tempatTemuan: dataData.tempatTemuan,
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
