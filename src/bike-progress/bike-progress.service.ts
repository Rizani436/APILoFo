// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
// import {
//   CreateBikeProgressDto,
//   UpdateBikeProgressDto,
//   LockBikeProgressDto,
// } from './dto/bike-progress';
// import { BikeService } from '../bike/bike.service';
// import { MyRedisService } from '../my-redis/my-redis.module';
// import { geoJsonToBase64, base64ToGeoJson } from '../utils/geo.utils';

// @Injectable()
// export class BikeProgressService {
//   private prisma = new PrismaClient();
//   constructor(
//     private readonly bikeService: BikeService,
//     private readonly redisBike: MyRedisService,
//   ) {}

//   async saveRealTimeData(bikeId: string, data: CreateBikeProgressDto) {
//     const existingBike = await this.prisma.bike.findUnique({
//       where: { id_bike: bikeId },
//     });
//     const existingUser = await this.prisma.user.findFirst({
//       where: { id_user: data.userId },
//     });
//     const existingData = await this.redisBike
//       .getBikeClient()
//       .get(`progress-${bikeId}`);

//     const existingBikeStatistic = await this.prisma.bikeStatistic.findFirst({ where: { bikeId: bikeId } });
//     if (!existingBike && !existingUser) {
//       throw new HttpException('Bike and User not found', HttpStatus.NOT_FOUND);
//     } else if (!existingUser) {
//       throw new HttpException('User not found', HttpStatus.NOT_FOUND);
//     } else if (!existingBike) {
//       throw new HttpException('Bike not found', HttpStatus.NOT_FOUND);
//     } else if (existingData) {
//       throw new HttpException(
//         'Real-time data already exists for this bike',
//         HttpStatus.CONFLICT,
//       );
//     }
//     data.status = 'unlocked';
//     const now = new Date();
//     const timeNow = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}-${now.getHours()}:${now.getMinutes()}`;
//     data.time = timeNow;
//     data.count = now.getTime();

//     const url = 'https://locker-api.vercel.app/locker/command';
//     this.setCommand(url, 'unlock', existingBikeStatistic.id_bikestatistic);

//     const location = await this.getInfoLocker("https://locker-api.vercel.app/locker/info/"+existingBikeStatistic.id_bikestatistic);

//     data.location_history = [[location.coordinates.longitude, location.coordinates.latitude]];
//     data.temp = [location.coordinates.longitude, location.coordinates.latitude];

//     this.redisBike
//       .getBikeClient()
//       .set(`progress-${bikeId}`, JSON.stringify(data), 'EX', 86400); // TTL 1 hari
//     this.bikeService.unlockBike(bikeId);

//     await this.prisma.bikeStatistic.update({
//       where: { id_bikestatistic: existingBikeStatistic.id_bikestatistic },
//       data: {
//         status: 'used',
//       },
//     });

//     return { message: 'Data saved to temporary storage' };
//   }

//   async getRealTimeData(bikeId: string) {
//     const data = await this.redisBike.getBikeClient().get(`progress-${bikeId}`);
//     return data ? JSON.parse(data) : null;
//   }
//   async updateRealTimeData(bikeId: string, data: UpdateBikeProgressDto) {
//     const existingData = await this.redisBike
//       .getBikeClient()
//       .get(`progress-${bikeId}`);
//     if (!existingData) {
//       throw new HttpException(
//         'No real-time data found for this bike',
//         HttpStatus.NOT_FOUND,
//       );
//     }
//     const redis = JSON.parse(existingData);

//     if (redis.userId != data.userId) {
//       throw new HttpException(
//         'This user id does not have access',
//         HttpStatus.BAD_REQUEST,
//       );
//     }
//     if (data.status == 'locked' && redis.status == 'locked') {
//       throw new HttpException('Bike already locked', HttpStatus.CONFLICT);
//     } else if (data.status == 'unlocked' && redis.status == 'unlocked') {
//       throw new HttpException('Bike already unlocked', HttpStatus.CONFLICT);
//     }
//     const existingBikeStatistic = await this.prisma.bikeStatistic.findFirst({ where: { bikeId: bikeId } });
//     const url = 'https://locker-api.vercel.app/locker/command';
//     if(data.status=="locked"){
//       this.bikeService.lockBike(bikeId);
//       this.setCommand(url, 'lock', existingBikeStatistic.id_bikestatistic);
//     }else if(data.status=="unlocked"){
//         this.bikeService.unlockBike(bikeId);
//         this.setCommand(url, 'unlock', existingBikeStatistic.id_bikestatistic);
//     }

//     const updatedData = { ...JSON.parse(existingData), ...data };
//     const ttl = await this.redisBike.getBikeClient().ttl(`progress-${bikeId}`);
//     this.redisBike
//       .getBikeClient()
//       .set(`progress-${bikeId}`, JSON.stringify(updatedData), 'EX', ttl);

//     return { message: 'Data updated' };
//   }

//   async lockBike(id_bike: string, user: LockBikeProgressDto) {
//     const data = await this.redisBike
//       .getBikeClient()
//       .get(`progress-${id_bike}`);
//     if (!data) {
//       throw new HttpException(
//         'No real-time data found for this bike',
//         HttpStatus.NOT_FOUND,
//       );
//     }

//     const rideData = JSON.parse(data);
//     if (rideData.userId != user.userId) {
//       throw new HttpException(
//         'This user id does not have access',
//         HttpStatus.BAD_REQUEST,
//       );
//     }
//     const now = new Date();

//     const time = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}-${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}`;

//     const timeNow = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}-${now.getHours()}:${now.getMinutes()}`;
//     this.bikeService.lockBike(id_bike);

//     const time_count = Math.round(
//       (new Date().getTime() - rideData.count) / 1000,
//     );
//     const existingBikeStatistic = await this.prisma.bikeStatistic.findFirst({ where: { bikeId: id_bike } });
//     const url = 'https://locker-api.vercel.app/locker/command';
//     this.setCommand(url, 'lock', existingBikeStatistic.id_bikestatistic);

//     const location = {
//       type: 'Polygon',
//       coordinates: [rideData.location_history],
//     }

//     const location_history = geoJsonToBase64(location);
//     await this.prisma.bikeStatistic.update({
//       where: { id_bikestatistic: existingBikeStatistic.id_bikestatistic },
//       data: {
//         status: 'available',
//       },
//     });

//     await this.prisma.rideHistory.create({
//       data: {
//         id_ridehistory: `bikehistory-${time}`,
//         bikeId: id_bike,
//         userId: rideData.userId,
//         locked_status: 'Locked',
//         time_start: rideData.time,
//         time_finish: timeNow,
//         location_history,
//         status: 'finished',
//         time_count,
//       },
//     });

//     // Hapus data dari redisBike.getBikeClient() setelah dipindahkan ke PostgreSQL
//     await this.redisBike.getBikeClient().del(`progress-${id_bike}`);
//     return { message: 'Data moved to permanent storage' };
//   }

//   async setCommand(url: string, command: string, lockerId: string) {
//     const body = {
//       command: command,
//       id: lockerId,
//     };

//     try {
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(body),
//       });

//       const data = await response.json();
//       console.log('Response:', data);
//       return data;
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   }

//   async getInfoLocker(url: string) {
//     try {
//       const response = await fetch(url, {
//         method: 'GET',
//       });

//       const data = await response.json();
//       console.log('Response:', data);
//       return data;
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   }
// }
