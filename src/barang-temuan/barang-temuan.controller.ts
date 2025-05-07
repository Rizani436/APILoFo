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
import { BarangTemuanService } from './barang-temuan.service';
import {
  CreateBarangTemuanDto,
  UpdateBarangTemuanDto,
} from './dto/barang-temuan';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../config/multer.config';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { File as MulterFile } from 'multer';

@Controller('barang-temuan')
export class BarangTemuanController {
  constructor(private readonly BarangTemuanService: BarangTemuanService) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/barang-temuan',
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
    dataData: CreateBarangTemuanDto,
  ) {
    return this.BarangTemuanService.create(dataData, file);
  }
  
  @Get('getAll')
  async getAll() {
    return this.BarangTemuanService.getAll();
  }

  @Get('getById/:id')
  async getById(@Param('id') id: string) {
    return this.BarangTemuanService.getById(id);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true }))
    dataData: UpdateBarangTemuanDto,
  ) {
    return this.BarangTemuanService.update(id, dataData);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.BarangTemuanService.delete(id);
  }


  //   @Post('import')
  //   @UseInterceptors(FileInterceptor('file', multerConfig))
  //   async importMerchant(@UploadedFile() file: MulterFile) {
  //     return this.BarangTemuanService.importMerchant(file);
  //   }
  //   @Get('export')
  //   async exportMerchant(@Res() res: Response) {
  //     return this.BarangTemuanService.exportMerchant(res);
  //   }
  //   @Get('search')
  //   async searchMerchant(
  //     @Query('search') search: string,
  //     @Query('fields') fields: string,
  //   ) {
  //     return this.BarangTemuanService.searchMerchant(search, fields);
  //   }
}
