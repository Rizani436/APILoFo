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
  ValidationPipe
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto, UpdateAdminDto } from './dto/admin';
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';

@Controller('admin')
export class AdminController {
  private prisma = new PrismaClient();

  constructor(private readonly AdminService: AdminService) {}

  
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string
  ) {
    return this.AdminService.login(email, password);
  }

  @Post('logout')
  async logout(@Body('token') token: string,) {
    return this.AdminService.logout(token);
  }

  @Post('create')
  async create(
    @Body(new ValidationPipe({ whitelist: true })) dataData: CreateAdminDto,
  ) {
    return this.AdminService.create(dataData);
  }

  @Get('getAll')
    async getAlls() {
      return this.AdminService.getAll();
    }
  
    @Get('getById/:id')
    async getById(@Param('id') id: string) {
      return this.AdminService.getById(id);
    }
  
    @Put('update/:id')
    async update(
      @Param('id') id: string,
      @Body(new ValidationPipe({ whitelist: true }))
      dataData: UpdateAdminDto,
    ) {
      return this.AdminService.update(id, dataData);
    }
  
    @Delete('delete/:id')
    async delete(@Param('id') id: string) {
      return this.AdminService.delete(id);
    }

  @Put('change-password/:id')
  async changePassword(
    @Param('id') id: string,
    @Body('password') password: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.AdminService.changePassword(id, password, newPassword);
  }


  // @Post('setRedis')
  // async setRedis(@Param('id') id: string) {
  //   return this.AdminService.setRedis(session);
  // }

  // @Delete('deleteRedis/:id')
  // async deleteRedis(@Param('id') token: string) {
  //   return this.AdminService.deleteRedis(token);
  // }
}
