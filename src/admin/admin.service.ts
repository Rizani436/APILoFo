import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateAdminDto, UpdateAdminDto } from './dto/admin';
import { JwtService } from '@nestjs/jwt';
import { MyRedisService } from '../my-redis/my-redis.module';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  private prisma = new PrismaClient();

  constructor(
    private readonly jwtService: JwtService,
    private readonly redisSession: MyRedisService,
  ) {}

  async login(username: string, password: string) {
    const admin = await this.prisma.admin.findFirst({
      where: { username: username },
    });
    if (!admin) {
      throw new HttpException('admin tidak ditemukan', HttpStatus.NOT_FOUND);
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new HttpException(
        'password tidak valid',
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = this.jwtService.sign({ id: admin.username });
    this.setRedis(token, admin);
    return { admin, token };
  }

  async logout(token: string): Promise<{ message: string }> {
    this.deleteRedis(token);
    return { message: 'Logged out successfully' };
  }

  async create(dataData: CreateAdminDto) {
    const hashedPassword = await bcrypt.hash(dataData.password, 10);

    const existingUsername = await this.prisma.admin.findFirst({
      where: { username: dataData.username },
    });
    if (existingUsername) {
      throw new HttpException(
        'Username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.prisma.admin.create({
      data: {
        username: dataData.username,
        password: hashedPassword,
        namaLengkap: dataData.namaLengkap,
        noHP: dataData.noHP,
        pictUrl: dataData.pictUrl,
      },
    });
  }

  async getAll() {
    const admin = await this.prisma.admin.findMany();
    if (admin.length == 0) {
      throw new HttpException('admin tidak ada', HttpStatus.NOT_FOUND);
    }
    return admin;
  }

  async getById(id: string) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        username: id,
      },
    });
    if (!admin) {
      throw new HttpException('admin tidak ditemukan', HttpStatus.NOT_FOUND);
    }
    return admin;
  }

  async update(id: string, dataData: UpdateAdminDto) {
    return this.prisma.admin.update({
      where: { username: id },
      data: {
        username: dataData.username,
        password: dataData.password,
        namaLengkap: dataData.namaLengkap,
        noHP: dataData.noHP,
        pictUrl: dataData.pictUrl,
      },
    });
  }

  async delete(id: string) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        username: id,
      },
    });
    if (!admin) {
      throw new HttpException('admin tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    return this.prisma.admin.delete({
      where: {
        username: id,
      },
    });
  }

  async changePassword(id: string, password: string, newPassword: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { username: id },
    });

    if (!admin) {
      throw new HttpException('admin tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new HttpException(
        'password saat ini tidak valid',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isSamePassword = await bcrypt.compare(newPassword, admin.password);
    if (isSamePassword) {
      throw new HttpException(
        'password baru tidak boleh sama dengan password saat ini',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.admin.update({
      where: { username: id },
      data: { password: hashedPassword },
    });

    return { message: 'password berhasil diupdate' };
  }

  async setRedis(token: string, data: any) {
    this.redisSession.setSession(token, data);
  }
  async deleteRedis(token: string) {
    const existingAdmin = await this.redisSession.getSession(token);
    if (!existingAdmin) {
      throw new HttpException('admin tidak ditemukan', HttpStatus.NOT_FOUND);
    }
    return this.redisSession.deleteSession(token);
  }
}
