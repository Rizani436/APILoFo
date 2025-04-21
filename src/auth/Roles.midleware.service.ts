import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MyRedisService } from '../my-redis/my-redis.module';
import { IS_PUBLIC_KEY } from './skip-auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private redisService: MyRedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.SESSIONID ?? request.headers['authorization'];

    // 🔹 Cek apakah endpoint ini public (boleh diakses tanpa login)
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException('No token Found');
    }
    // 🔹 Cek apakah sesi masih valid
    // const isValid = await this.redisService.isSessionValid(token);
    // if (!isValid) {
    //   throw new UnauthorizedException('Session expired or invalid');
    // }

    // 🔹 Ambil data sesi dari Redis
    const session = await this.redisService.getSession(token);
    request.user = session; // Simpan data sesi ke request
    
    // 🔹 Ambil daftar role yang diperbolehkan dari metadata `@Roles()`
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles || requiredRoles.length === 0) {
      return session ? true : false; // Hanya user yang login bisa akses
    }
    
    // 🔹 Cek apakah role user sesuai dengan yang diperbolehkan
    const userRole = session.role;
    if (!requiredRoles.includes(userRole)) {
      throw new UnauthorizedException(`You do not have the required role: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
