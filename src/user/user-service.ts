import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from 'src/user/dto/user';
import { JwtService } from '@nestjs/jwt';
import { MyRedisService } from '../my-redis/my-redis.module';
import * as bcrypt from 'bcrypt';
import { Http2ServerRequest } from 'http2';


@Injectable()
export class userService {
  private prisma = new PrismaClient();

  constructor(
    private readonly jwtService: JwtService,
    private readonly redisSession: MyRedisService,
  ) {}

  async register(dataData: CreateUserDto){
    const hashedPassword = await bcrypt.hash(dataData.password, 10);
    const existingUser = await this.prisma.user.findFirst({
      where: { email: dataData.email },
    });
    const existingUsername = await this.prisma.user.findFirst({
      where: { username: dataData.username },
    });
    if (existingUser && existingUsername) {
      throw new HttpException(
        'Username and Email already exists',
        HttpStatus.BAD_REQUEST,
      );
    } else if (existingUsername) {
      throw new HttpException(
        'Username already exists',
        HttpStatus.BAD_REQUEST,
      );
    } else if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    const newUser = await this.prisma.user.create({
      data: {
        username: dataData.username,
        email: dataData.email,
        password: hashedPassword,
        namaLengkap: dataData.namaLengkap,
        jenisKelamin: dataData.jenisKelamin,
        alamat: dataData.alamat,
        noHP: dataData.noHP,
        pictUrl: dataData.pictUrl,
      },
    });

    return {
      username: newUser.username,
      email: newUser.email,
      password: hashedPassword,
    };
  }

  async login(username: string, password: string) {
    const User = await this.prisma.user.findFirst({
      where: { username: username },
    });
    if (!User) {
      throw new Error('user tidak ditemukan');
    }
    const isPasswordValid = await bcrypt.compare(password, User.password);
    if (!isPasswordValid) {
      throw new Error('password tidak valid');
    }

    const token = this.jwtService.sign({ id: User.username });
    this.setRedis(token, User);
    return { token };
  }

  async logout(token: string){
    this.deleteRedis(token);
    return { message: 'Logged out successfully' };
  }

  async create(dataData: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dataData.password, 10);
    const existingUser = await this.prisma.user.findFirst({
      where: { email: dataData.email },
    });
    const existingUsername = await this.prisma.user.findFirst({
      where: { username: dataData.username },
    });
    if (existingUser && existingUsername) {
      throw new HttpException(
        'Username and Email already exists',
        HttpStatus.BAD_REQUEST,
      );
    } else if (existingUsername) {
      throw new HttpException(
        'Username already exists',
        HttpStatus.BAD_REQUEST,
      );
    } else if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    return this.prisma.user.create({
      data: {
        username: dataData.username,
        email: dataData.email,
        password: hashedPassword,
        namaLengkap: dataData.namaLengkap,
        jenisKelamin: dataData.jenisKelamin,
        alamat: dataData.alamat,
        noHP: dataData.noHP,
        pictUrl: dataData.pictUrl,
      },
    });
  }

  async getAll() {
    const user = await this.prisma.user.findMany();
    if (user.length == 0) {
      throw new HttpException('user tidak ada', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: id,
      },
    });
    if (!user) {
      throw new HttpException(
        'user tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async update(id: string, dataData: UpdateUserDto) {
    return this.prisma.user.update({
      where: { username: id },
      data: {
        username: dataData.username,
        email: dataData.email,
        password: dataData.password,
        namaLengkap: dataData.namaLengkap,
        jenisKelamin: dataData.jenisKelamin,
        alamat: dataData.alamat,
        noHP: dataData.noHP,
        pictUrl: dataData.pictUrl,
      },
    });
  }

  async delete(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: id,
      },
    });
    if (!user) {
      throw new HttpException(
        'User tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.prisma.user.delete({
      where: {
        username: id,
      },
    });
  }

  async changePassword(id: string, password: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: id },
    });

    if (!user) {
      throw new Error('user tidak ditemukan');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('password saat ini tidak valid');
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new Error(
        'password baru tidak boleh sama dengan password saat ini',
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { username: id },
      data: { password: hashedPassword },
    });

    return { message: 'password berhasil diupdate' };
  }

  
  async setRedis(token: string, data: any) {
    this.redisSession.setSession(token, data);
  }
  async deleteRedis(token: string) {
    const existingUser = await this.redisSession.getSession(token);
    if (!existingUser) {
      throw new Error('User not found');
    }
    return this.redisSession.deleteSession(token);
  }
}
