// import {
//   Controller,
//   Get,
//   Post,
//   Put,
//   Delete,
//   Param,
//   Body,
//   Res,
//   Req,
//   HttpStatus,
//   UseGuards,
//   UseInterceptors,
//   UploadedFile,
// } from '@nestjs/common';
// import { Request } from 'express';
// import { Response } from 'express';
// import { adminService } from 'src/admin-web/admin-service';
// import { createAdmin } from 'src/admin-web/dto/create-admin';
// import { updateAdmin } from 'src/admin-web/dto/update-admin';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { multerConfig } from '../config/multer.config';
// import { File as MulterFile } from 'multer';

// @Controller('admin')
// export class adminController {
//   constructor(private readonly adminService: adminService) {}

//   @Post('/admin/signup')
//   async signup(@Body() createAdminDto: createAdmin, @Res() res: Response) {
//     try {
//       const existingAdmin = await this.adminService.findOne(
//         createAdminDto.username,
//       );
//       if (existingAdmin) {
//         return res
//           .status(HttpStatus.BAD_REQUEST)
//           .json({ message: 'Username already in use, try another username' });
//       }
//       const newAdmin = await this.adminService.signup(createAdminDto);
//       return res
//         .status(HttpStatus.CREATED)
//         .json({ message: 'Admin created', newAdmin });
//     } catch (error) {
//       return res
//         .status(HttpStatus.INTERNAL_SERVER_ERROR)
//         .json({ message: error.message });
//     }
//   }

//   @Post('/admin/login')
//   async login(
//     @Body('username') username: string,
//     @Body('password') password: string,
//     @Res() res: Response,
//   ) {
//     try {
//       if (!username || !password) {
//         return res
//           .status(HttpStatus.BAD_REQUEST)
//           .json({ message: 'Username dan password wajib diisi!' });
//       }

//       const detik = 21600;
//       const token = await this.adminService.login(username, password, detik);

//       res.cookie('SESSIONID', token, {
//         secure: false,
//         maxAge: detik * 1000,
//       });

//       return res.status(HttpStatus.OK).json({ message: 'Login successful' });
//     } catch (error) {
//       return res
//         .status(HttpStatus.UNAUTHORIZED)
//         .json({ message: error.message });
//     }
//   }

//   @Post('/admin/logout')
//   async logout(@Req() req: Request, @Res() res: Response) {
//     const token = req.cookies?.SESSIONID;

//     if (!token) {
//       return res
//         .status(403)
//         .json({ message: 'No authentication token provided' });
//     }

//     await this.adminService.logout(token);

//     res.clearCookie('SESSIONID', {
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//     });

//     return res.json({ message: 'Logout successful' });
//   }

//   @Post('/admin/create')
//   async create(@Body() createadminDto: createAdmin) {
//     return this.adminService.create(createadminDto);
//   }

//   @Get('/admin/getAll')
//   async findAll() {
//     return this.adminService.findAll();
//   }

//   @Get('/admin/getByUsername/:username')
//   async findOne(@Param('username') username: string) {
//     return this.adminService.findOne(username);
//   }

//   @Put('/admin/update/:id')
//   async update(@Param('id') id: string, @Body() updateadminDto: updateAdmin) {
//     return this.adminService.update(id, updateadminDto);
//   }

//   @Put('/admin/change-password/:id')
//   async changePassword(
//     @Param('id') id: string,
//     @Body('password') password: string,
//     @Body('newPassword') newPassword: string,
//     @Res() res: Response,
//   ) {
//     try {
//       const result = await this.adminService.changePassword(
//         id,
//         password,
//         newPassword,
//       );
//       return res.status(HttpStatus.OK).json(result);
//     } catch (error) {
//       return res
//         .status(HttpStatus.BAD_REQUEST)
//         .json({ message: error.message });
//     }
//   }

//   @Delete('/admin/delete/:id')
//   async remove(@Param('id') id: string) {
//     return this.adminService.remove(id);
//   }

//   @Post('/admin/import')
//   @UseInterceptors(FileInterceptor('file', multerConfig))
//   async import(@UploadedFile() file: MulterFile) {
//     return this.adminService.importAdmin(file);
//   }

//   @Get('/admin/export')
//   async export(@Res() res: Response) {
//     return this.adminService.exportAdmin(res);
//   }
// }
