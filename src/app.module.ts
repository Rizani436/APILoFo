import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MyRedisModule } from './my-redis/my-redis.module';
// import { BikeProgressService } from './bike-progress/bike-progress.service';
// import { BikeProgressController } from './bike-progress/bike-progress.controller';
// import { adminController } from './admin-web/admin-controller';
// import { adminService } from './admin-web/admin-service';
import { userController } from './user/user-controller';
import { userService } from './user/user-service';
import { userModule } from './user/user-module';
// import { adminModule } from './admin-web/admin-module';
import { BarangTemuanController } from './barang-temuan/barang-temuan.controller';
import { BarangTemuanService } from './barang-temuan/barang-temuan.service';
import { BarangHilangController } from './barang-hilang/barang-hilang.controller';
import { BarangHilangService } from './barang-hilang/barang-hilang.service';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { NotifikasiController } from './notifikasi/notifikasi.controller';
import { NotifikasiService } from './notifikasi/notifikasi.service';
import { JawabanPertanyaanController } from './jawaban-pertanyaan/jawaban-pertanyaan.controller';
import { JawabanPertanyaanService } from './jawaban-pertanyaan/jawaban-pertanyaan.service';
import * as cookieParser from 'cookie-parser';

@Module({
  imports: [
    MyRedisModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '6h' },
    }),
    ScheduleModule.forRoot(),
    userModule,
    // adminModule,
  ],
  controllers: [
    AppController,
    // BikeProgressController,
    // adminController,
    userController,
    BarangTemuanController,
    BarangHilangController,
    AdminController,
    NotifikasiController,
    JawabanPertanyaanController,
  ],
  providers: [
    AppService,
    // BikeProgressService,
    // adminService,
    userService,
    BarangTemuanService,
    BarangHilangService,
    AdminService,
    NotifikasiService,
    JawabanPertanyaanService,
  ],
})
export class AppModule {}
