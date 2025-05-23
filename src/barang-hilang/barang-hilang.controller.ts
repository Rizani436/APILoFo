import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  ValidationPipe,
  UseGuards,
  Res,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { BarangHilangService } from './barang-hilang.service';
import {
  CreateBarangHilangDto,
  UpdateBarangHilangDto,
} from './dto/barang-hilang';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../config/multer.config';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { File as MulterFile } from 'multer';
import { KategoriBarang } from '@prisma/client';
@Controller('barang-Hilang')
export class BarangHilangController {
  constructor(private readonly BarangHilangService: BarangHilangService) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/barang-hilang',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: MulterFile,
    @Body(new ValidationPipe({ whitelist: true }))
    dataData: CreateBarangHilangDto,
  ) {
    return this.BarangHilangService.create(dataData, file);
  }

  @Get('getAll')
  async getAlls() {
    return this.BarangHilangService.getAll();
  }

  @Get('getAllVerifikasi')
  async getAllVerifikasi() {
    return this.BarangHilangService.getAllVerifikasi();
  }

  @Get('getById/:id')
  async getById(@Param('id') id: string) {
    return this.BarangHilangService.getById(id);
  }

  

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true }))
    dataData: UpdateBarangHilangDto,
  ) {
    return this.BarangHilangService.update(id, dataData);
  }

  @Put('update-gambar/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/barang-hilang',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async updateGambar(
    @UploadedFile() file: MulterFile,
    @Param('id') id: string,
  ) {
    return this.BarangHilangService.updateGambar(id, file);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.BarangHilangService.delete(id);
  }

  @Get('getMyAll/:id')
  async getMyAll(@Param('id') id: string) {
    return this.BarangHilangService.getMyAll(id);
  }
  @Get('getOtherAll/:id')
  async getOtherAll(
    @Param('id') id: string,
    @Query('kategoriBarang') kategori: string,
  ) {
    return this.BarangHilangService.getOtherAll(id, kategori);
  }

  //   @Post('import')
  //   @UseInterceptors(FileInterceptor('file', multerConfig))
  //   async import(@UploadedFile() file: MulterFile) {
  //     return this.BarangHilangService.import(file);
  //   }
  //   @Get('export')
  //   async export(@Res() res: Response) {
  //     return this.BarangHilangService.export(res);
  //   }
  //   @Get('search')
  //   async search(
  //     @Query('search') search: string,
  //     @Query('fields') fields: string,
  //   ) {
  //     return this.BarangHilangService.search(search, fields);
  //   }
}
