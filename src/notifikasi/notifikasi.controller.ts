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
import { NotifikasiService } from './notifikasi.service';
import { CreateNotifikasiDTO, UpdateNotifikasiDTO } from './dto/notifikasi';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../config/multer.config';
import { File as MulterFile } from 'multer';

@Controller('notifikasi')
export class NotifikasiController {
  constructor(private readonly NotifikasiService: NotifikasiService) {}

  @Post('create')
  async create(
    @Body(new ValidationPipe({ whitelist: true }))
    dataData: CreateNotifikasiDTO,
  ) {
    return this.NotifikasiService.create(dataData);
  }

  @Get('getAll')
  async getAll() {
    return this.NotifikasiService.getAll();
  }

  @Get('getById/:id')
  async getId(@Param('id') id: number) {
    return this.NotifikasiService.getById(id);
  }

  @Get('getMyAll/:id')
  async getMyAll(@Param('id') id: string) {
    return this.NotifikasiService.getMyAll(id);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: number,
    @Body(new ValidationPipe({ whitelist: true }))
    dataData: UpdateNotifikasiDTO,
  ) {
    return this.NotifikasiService.update(id, dataData);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    return this.NotifikasiService.delete(id);
  }

//   @Post('import')
//   @UseInterceptors(FileInterceptor('file', multerConfig))
//   async importMerchant(@UploadedFile() file: MulterFile) {
//     return this.NotifikasiService.importMerchant(file);
//   }
//   @Get('export')
//   async exportMerchant(@Res() res: Response) {
//     return this.NotifikasiService.exportMerchant(res);
//   }
//   @Get('search')
//   async searchMerchant(
//     @Query('search') search: string,
//     @Query('fields') fields: string,
//   ) {
//     return this.NotifikasiService.searchMerchant(search, fields);
//   }
}
