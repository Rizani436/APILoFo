import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { userService } from 'src/user/user-service';
import { userController } from 'src/user/user-controller';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module'; // sesuaikan path
import { MyRedisModule } from 'src/my-redis/my-redis.module';


@Module({
  imports: [
      JwtModule.register({
        secret: process.env.JWT_SECRET || 'default_secret',
        signOptions: { expiresIn: '1h' },
      }),
      MyRedisModule,
      MailModule,
    ],
    
  controllers: [userController],
  providers: [userService],
})
export class userModule {}