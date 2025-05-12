import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Res,
  HttpStatus,
  ValidationPipe,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { userService } from 'src/user/user-service';
import { CreateUserDto, UpdateUserDto } from './dto/user';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../config/multer.config';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { File as MulterFile } from 'multer';
import { PrismaClient } from '@prisma/client';

@Controller('user')
export class userController {
  private prisma = new PrismaClient();

  constructor(private readonly userService: userService) {}

  @Post('register')
  async signup(@Body(new ValidationPipe({ whitelist: true })) dataData: CreateUserDto,) {
    return this.userService.register(dataData);
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string
  ) {
    return this.userService.login(username, password);
  }

  @Post('logout')
  async logout(@Body('token') token: string,) {
    return this.userService.logout(token);
  }

  @Post('create')
  async create(
    @Body(new ValidationPipe({ whitelist: true })) dataData: CreateUserDto,
  ) {
    return this.userService.create(dataData);
  }

  @Get('getAll')
    async getAlls() {
      return this.userService.getAll();
    }
  
    @Get('getById/:id')
    async getById(@Param('id') id: string) {
      return this.userService.getById(id);
    }
  
    @Put('update/:id')
    async update(
      @Param('id') id: string,
      @Body(new ValidationPipe({ whitelist: true }))
      dataData: UpdateUserDto,
    ) {
      return this.userService.update(id, dataData);
    }
  
    @Delete('delete/:id')
    async delete(@Param('id') id: string) {
      return this.userService.delete(id);
    }

  @Put('/change-password/:id')
  async changePassword(
    @Param('id') id: string,
    @Body('password') password: string,
    @Body('newPassword') newPassword: string,
  @Body('confirmPassword') confirmPassword: string,
  ) {
    return this.userService.changePassword(id, password, newPassword, confirmPassword);
  }

  @Put('change-profile/:id')
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads/userProfile',
          filename: (req, file, cb) => {
            const uniqueName = `${Date.now()}-${Math.round(
              Math.random() * 1e9,
            )}${extname(file.originalname)}`;
            cb(null, uniqueName);
          },
        }),
      }),
    )
    async changeProfile(
      @UploadedFile() file: MulterFile,  @Param('id') id: string,
    ) {
      return this.userService.changeProfile(id, file);
    }

    @Put('delete-profile/:id')
    async deleteProfile(@Param('id') id: string) {
      return this.userService.deleteProfile(id);
    }

    


  // @Post('setRedis')
  // async setRedis(@Param('id') id: string) {
  //   return this.userService.setRedis(session);
  // }

  // @Delete('deleteRedis/:id')
  // async deleteRedis(@Param('id') token: string) {
  //   return this.userService.deleteRedis(token);
  // }
}
