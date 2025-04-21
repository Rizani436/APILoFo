// import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
// import { adminController } from './admin-controller';
// import { adminService } from './admin-service';
// import { JwtModule } from '@nestjs/jwt';
// // import { ValidateUserMiddleware } from 'src/middleware/validate-user.middleware';
// import { MyRedisModule } from 'src/my-redis/my-redis.module';

// @Module({
//   imports: [
//     JwtModule.register({
//       secret: process.env.JWT_SECRET || 'default_secret',
//       signOptions: { expiresIn: '6h' },
//     }),
//     MyRedisModule
//   ],
//   controllers: [adminController],
//   providers: [adminService],
// })
// export class adminModule {
// }