import { HttpException, HttpStatus, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from 'src/user/dto/user';
import { JwtService } from '@nestjs/jwt';
import { MyRedisService } from '../my-redis/my-redis.module';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { Http2ServerRequest } from 'http2';
import { File as MulterFile } from 'multer';
import * as fs from 'fs';


@Injectable()
export class userService {
  private prisma = new PrismaClient();

  constructor(
    private readonly jwtService: JwtService,
    private readonly redisSession: MyRedisService,
    private readonly mailService: MailService,
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
        'Username and Email sudah ada',
        HttpStatus.BAD_REQUEST,
      );
    } else if (existingUsername) {
      throw new HttpException(
        'Username sudah ada',
        HttpStatus.BAD_REQUEST,
      );
    } else if (existingUser) {
      throw new HttpException('Email sudah ada', HttpStatus.BAD_REQUEST);
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
    const User = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!User) {
      throw new HttpException('user tidak ada', HttpStatus.NOT_FOUND);
    }
    console.log(User);
    const isPasswordValid = await bcrypt.compare(password, User.password);
    if (!isPasswordValid) {
      throw new HttpException(
        'password tidak valid',
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = this.jwtService.sign({ id: User.username });
    this.setRedis(token, User);
    return { User,token };
  }

  async logout(token: string){
    this.deleteRedis(token);
    return { message: 'Logged out berhasil' };
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
        'Username and Email sudah ada',
        HttpStatus.BAD_REQUEST,
      );
    } else if (existingUsername) {
      throw new HttpException(
        'Username sudah ada',
        HttpStatus.BAD_REQUEST,
      );
    } else if (existingUser) {
      throw new HttpException('Email sudah ada', HttpStatus.BAD_REQUEST);
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
    const existingUser = await this.prisma.user.findFirst({
      where: { email: dataData.email },
    });
    const existingUsername = await this.prisma.user.findFirst({
      where: { username: dataData.username },
    });
    if (existingUser && existingUsername&&dataData.username&&dataData.email) {
      throw new HttpException(
        'Username and Email sudah ada',
        HttpStatus.BAD_REQUEST,
      );
    } else if (existingUsername&&dataData.username) {
      throw new HttpException(
        'Username sudah ada',
        HttpStatus.BAD_REQUEST,
      );
    } else if (existingUser&&dataData.email) {
      throw new HttpException('Email sudah ada', HttpStatus.BAD_REQUEST);
    }
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
     if (user.pictUrl) {
      const filename = user.pictUrl.split('/').pop();
      const filePath = `./uploads/userProfile/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File deleted successfully');
        }
      });
    }

    return this.prisma.user.delete({
      where: {
        username: id,
      },
    });
  }

  async changePassword(id: string, password: string, newPassword: string, confirmPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: id },
    });

    if (!user) {
      throw new HttpException('user tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(
        'Password lama salah',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (newPassword !== confirmPassword) {
      throw new HttpException(
        'password baru dan konfirmasi password tidak sama',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new HttpException(
        'password baru tidak boleh sama dengan password saat ini',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { username: id },
      data: { password: hashedPassword },
    });

    return { message: 'password berhasil diupdate' };
  }

  async changeProfile(id: string, file: MulterFile) {
    const user = await this.prisma.user.findUnique({
      where: { username: id },
    });
    if (!user) {
      throw new HttpException('user tidak ditemukan', HttpStatus.NOT_FOUND);
    }
    if (user.pictUrl) {
      const filename = user.pictUrl.split('/').pop();
      const filePath = `./uploads/userProfile/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File deleted successfully');
        }
      });
    }
    const url = `https://backend-web-admin.onrender.com/uploads/userProfile/${file.filename}`;
    return this.prisma.user.update({
      where: { username: id },
      data: {
        pictUrl: url,
      },
    });
  }

  async deleteProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: id },
    });
    if (!user) {
      throw new HttpException('user tidak ditemukan', HttpStatus.NOT_FOUND);
    }
    if (user.pictUrl) {
      const filename = user.pictUrl.split('/').pop();
      const filePath = `./uploads/userProfile/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File deleted successfully');
        }
      });
    }
    return this.prisma.user.update({
      where: { username: id },
      data: {
        pictUrl: "profile/kosong.jpg",
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // auth.service.ts
async sendResetCode(email: string) {
  const user = await this.findByEmail(email);
  if (!user) throw new NotFoundException('User tidak ditemukan');

  const kode = Math.floor(100000 + Math.random() * 900000).toString(); // contoh kode 6 digit
  await this.setCode(user.email, kode, 300 ); // expire dalam 5 menit

  // kirim via email (gunakan nodemailer atau mailgun/sendgrid)
  await this.mailService.sendResetCodeEmail(email, kode);

  return { message: 'Kode reset telah dikirim ke email' };
}


  
  async setCode(email: string, kode: any, ttl: number) {
    await this.redisSession.kodePassword(`reset-code-${email}`, kode, ttl); // Simpan dengan TTL (3600 = 1 Jam)
  }
  async setRedis(token: string, data: any) {
    this.redisSession.setSession(token, data);
  }
  async deleteRedis(token: string) {
    const existingUser = await this.redisSession.getSession(token);
    if (!existingUser) {
      throw new HttpException('user tidak ditemukan', HttpStatus.NOT_FOUND);
    }
    return this.redisSession.deleteSession(token);
  }

  async confirmResetCode(email: string, code: string) {
    const storedCode = await this.getKode(`reset-code-${email}`);
    const user = await this.findByEmail(email);
  if (!user) throw new NotFoundException('User tidak ditemukan');
    if (!storedCode) throw new BadRequestException('Kode tidak valid atau sudah kadaluarsa');
    if (storedCode !== code) throw new BadRequestException('Kode tidak valid');
    return { message: 'Kode valid' };
  }

  async resetPassword(email: string, newPassword: string, confirmPassword: string) {

  const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException('user tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    if (newPassword !== confirmPassword) {
      throw new HttpException(
        'password baru dan konfirmasi password tidak sama',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new HttpException(
        'password baru tidak boleh sama dengan password saat ini',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

  await this.deleteKode(`reset-code-${email}`); // hapus setelah dipakai

  return { message: 'Password berhasil diubah' };
}
async deleteKode(token: string) {
    return this.redisSession.deleteSession(token);
  }
  async getKode(token: string) {
    const data = await this.redisSession.getKode(token);
    if (!data) return null;
    return data;
  }

}
