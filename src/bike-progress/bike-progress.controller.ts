// import { Controller, Get, Post, Put, Body, Param, ValidationPipe } from '@nestjs/common';
// import { BikeProgressService } from './bike-progress.service';
// import { CreateBikeProgressDto, UpdateBikeProgressDto, LockBikeProgressDto } from './dto/bike-progress';

// @Controller('bike-progress')
// export class BikeProgressController {
//     constructor(private readonly BikeProgressService: BikeProgressService) {}

//     @Get(':bikeId/getRealTimeData')
//     async getRealTimeData(@Param('bikeId') bikeId: string) {
//         return this.BikeProgressService.getRealTimeData(bikeId);
//     }

//     @Post(':bikeId/realtime')
//     async saveRealTimeData(@Param('bikeId') bikeId: string, @Body(new ValidationPipe({ whitelist: true }))  data: CreateBikeProgressDto) {
//         return this.BikeProgressService.saveRealTimeData(bikeId, data);
//     }
    
//     @Put(':bikeId/update')
//     async updateRealTimeData(@Param('bikeId') bikeId: string, @Body(new ValidationPipe({ whitelist: true }))  data: UpdateBikeProgressDto) {
//         return this.BikeProgressService.updateRealTimeData(bikeId, data);
//     }

//     @Post(':bikeId/lock')
//     async lockBike(@Param('bikeId') bikeId: string, @Body(new ValidationPipe({ whitelist: true }))  data: LockBikeProgressDto) {
//         return this.BikeProgressService.lockBike(bikeId, data);
//     }
// }
