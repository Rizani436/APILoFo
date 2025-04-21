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
import { JawabanPertanyaanService } from './jawaban-pertanyaan.service';
import { CreateJawabanPertanyaanDto, UpdateJawabanPertanyaanDto } from './dto/jawaban-pertanyaan';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../config/multer.config';
import { File as MulterFile } from 'multer';

@Controller('jawaban-pertanyaan')
export class JawabanPertanyaanController {
  constructor(private readonly JawabanPertanyaanService: JawabanPertanyaanService) {}

  @Post('create')
  async create(
    @Body(new ValidationPipe({ whitelist: true }))
    dataData: CreateJawabanPertanyaanDto,
  ) {
    return this.JawabanPertanyaanService.create(dataData);
  }

  @Get('getAll')
  async getAll() {
    return this.JawabanPertanyaanService.getAll();
  }

  @Get('getById/:id')
  async getById(@Param('id') id: number) {
    return this.JawabanPertanyaanService.getById(id);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: number,
    @Body(new ValidationPipe({ whitelist: true }))
    dataData: UpdateJawabanPertanyaanDto,
  ) {
    return this.JawabanPertanyaanService.update(id, dataData);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    return this.JawabanPertanyaanService.delete(id);
  }

//   @Post('import')
//   @UseInterceptors(FileInterceptor('file', multerConfig))
//   async importMerchant(@UploadedFile() file: MulterFile) {
//     return this.JawabanPertanyaanService.importMerchant(file);
//   }
//   @Get('export')
//   async exportMerchant(@Res() res: Response) {
//     return this.JawabanPertanyaanService.exportMerchant(res);
//   }
//   @Get('search')
//   async searchMerchant(
//     @Query('search') search: string,
//     @Query('fields') fields: string,
//   ) {
//     return this.JawabanPertanyaanService.searchMerchant(search, fields);
//   }
}
