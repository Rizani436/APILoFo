// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
// import { createAdmin } from 'src/admin-web/dto/create-admin';
// import { updateAdmin } from 'src/admin-web/dto/update-admin';
// import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
// import { MyRedisService } from '../my-redis/my-redis.module';
// import * as ExcelJS from 'exceljs';
// import { Response } from 'express';
// import * as fs from 'fs';
// import { File as MulterFile } from 'multer';

// interface SignupResponse {
//   id: string;
//   username: string;
//   password: string;
//   role: string;
// }

// @Injectable()
// export class adminService {
//   private prisma = new PrismaClient();
//   constructor(
//     private readonly jwtService: JwtService,
//     private readonly redisSession: MyRedisService,
//   ) {}

//   async signup(payload: createAdmin): Promise<SignupResponse> {
//     const existingAdmin = await this.prisma.admin.findUnique({
//       where: { username: payload.username },
//     });

//     if (existingAdmin) {
//       throw new Error('Admin already exists');
//     }

//     const hashedPassword = await bcrypt.hash(payload.password, 10);
//     const last = await this.prisma.admin.findFirst({
//       orderBy: {
//         id: 'desc',
//       },
//     });

//     const newAdmin = await this.prisma.admin.create({
//       data: {
//         username: payload.username,
//         password: hashedPassword,
//         role: payload.role,
//       },
//     });

//     return {
//       id: newAdmin.id,
//       username: newAdmin.username,
//       password: hashedPassword,
//       role: newAdmin.role,
//     };
//   }

//   async login(username: string, password: string, detik: number) {
//     const admin = await this.prisma.admin.findUnique({
//       where: { username },
//     });
//     if (!admin) {
//       throw new Error('Admin not found');
//     }
//     const isPasswordValid = await bcrypt.compare(password, admin.password);
//     if (!isPasswordValid) {
//       throw new Error('Invalid password');
//     }

//     const token = this.jwtService.sign({
//       id: admin.id,
//       role: admin.role,
//       username: admin.username,
//     });
//     await this.redisSession.setSession(
//       token,
//       { username: admin.username, role: admin.role },
//       detik,
//     );
//     return token;
//   }

//   async logout(sessionId: string): Promise<{ message: string }> {
//     await this.redisSession.deleteSession(sessionId);
//     return { message: 'Logged out successfully' };
//   }

//   async create(createAdminDto: createAdmin) {
//     return this.prisma.admin.create({
//       data: {
//         username: createAdminDto.username,
//         password: createAdminDto.password,
//         role: createAdminDto.role,
//       },
//     });
//   }

//   async findAll() {
//     const admin = await this.prisma.admin.findMany();
//     if (admin.length == 0) {
//       throw new Error('No admin found');
//     }

//     return admin;
//   }

//   async findOne(username: string) {
//     const admin = await this.prisma.admin.findUnique({
//       where: { username: username },
//     });

//     return this.prisma.admin.findUnique({
//       where: { username: username },
//     });
//   }

//   async update(id: string, updateadminDto: updateAdmin) {
//     const admin = await this.prisma.admin.findUnique({
//       where: { id: id },
//     });
//     if (!admin) {
//       throw new Error('Admin not found');
//     }
//     return this.prisma.admin.update({
//       where: { id: id },
//       data: updateadminDto,
//     });
//   }

//   async changePassword(id: string, password: string, newPassword: string) {
//     // Cari admin berdasarkan ID
//     const admin = await this.prisma.admin.findUnique({
//       where: { id },
//     });

//     if (!admin) {
//       throw new Error('Admin not found');
//     }

//     // Cek apakah password lama valid
//     const isPasswordValid = await bcrypt.compare(password, admin.password);
//     if (!isPasswordValid) {
//       throw new Error('Invalid current password');
//     }

//     // Pastikan password baru tidak sama dengan password lama
//     const isSamePassword = await bcrypt.compare(newPassword, admin.password);
//     if (isSamePassword) {
//       throw new Error(
//         'New password cannot be the same as the current password',
//       );
//     }

//     // Hash password baru
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Update password di database
//     await this.prisma.admin.update({
//       where: { id },
//       data: { password: hashedPassword },
//     });

//     return { message: 'Password updated successfully' };
//   }

//   async remove(id: string) {
//     const admin = await this.prisma.admin.findUnique({
//       where: { id: id },
//     });
//     if (!admin) {
//       throw new Error('Admin not found');
//     }
//     return this.prisma.admin.delete({
//       where: { id: id },
//     });
//   }

//   async importAdmin(file: MulterFile) {
//     if (!file) {
//       throw new Error('No file uploaded');
//     }
//     const filePath = file.path;
//     const workbook = new ExcelJS.Workbook();
//     await workbook.xlsx.readFile(filePath);
//     const worksheet = workbook.worksheets[0];
//     const data = [];

//     let headers: string[] = [];
//     worksheet.eachRow((row, rowNumber) => {
//       if (rowNumber === 1) {
//         headers = row.values as string[];
//       } else {
//         const values = row.values as string[];
//         const id = values[headers.indexOf('id')] ?? null;
//         const username = values[headers.indexOf('username')] ?? null;
//         const password = values[headers.indexOf('password')] ?? null;
//         const role = values[headers.indexOf('role')] ?? null;
//         data.push({ id, username, password, role });
//       }
//     });

//     const hasNullValue = data.some((obj) =>
//       Object.values(obj).some((value) => value === null),
//     );

//     if (hasNullValue) {
//       fs.unlinkSync(filePath);
//       throw new HttpException(
//         'Data tidak boleh kosong',
//         HttpStatus.BAD_REQUEST,
//       );
//     }

//     for (const admin of data) {
//       const isi = await this.prisma.admin.findFirst({
//         where: { id: admin.id },
//       });
//       if (isi) {
//         const existingadmin = await this.prisma.admin.findFirst({
//           where: {
//             AND: [{ username: admin.username }, { id: { not: admin.id } }],
//           },
//         });
//         if (existingadmin) {
//           throw new HttpException(
//             'Username already exist',
//             HttpStatus.NOT_ACCEPTABLE,
//           );
//         }
//         await this.prisma.admin.update({
//           where: { id: admin.id },
//           data: admin,
//         });
//       } else {
//         const existingadmin = await this.prisma.admin.findFirst({
//           where: { username: admin.username },
//         });
//         if (existingadmin) {
//           throw new HttpException(
//             'Username already exist',
//             HttpStatus.NOT_ACCEPTABLE,
//           );
//         }
//         await this.prisma.admin.create({
//           data: admin,
//         });
//       }
//     }

//     fs.unlinkSync(filePath);
//     return { message: 'Import berhasil', count: data.length };
//   }
//   async exportAdmin(res: Response) {
//     const admins = await this.prisma.admin.findMany();
//     if (admins.length == 0) {
//       throw new HttpException('No admins found', HttpStatus.NOT_FOUND);
//     }
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('admin');
//     worksheet.addRow(['id', 'username', 'password', 'role']);
//     admins.forEach((admin) => {
//       worksheet.addRow([admin.id, admin.username, admin.password, admin.role]);
//     });
//     res.setHeader(
//       'Content-Type',
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     );
//     res.setHeader('Content-Disposition', 'attachment; filename=admin.xlsx');
//     await workbook.xlsx.write(res);
//     res.end();
//   }
// }
