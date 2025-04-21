import { Module, Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';
import { env } from 'node:process';

@Injectable()
export class MyRedisService {
  public cache: Redis.Redis;

  constructor() {
    this.cache = new Redis.default(env.redis_cache); 
  }

  async setCache(email: string, data:any, ttl: number) {

    await this.cache.set(email, JSON.stringify(data), 'EX', ttl); // Simpan dengan TTL (3600 = 1 Jam)
  }

  async getCache(email: string): Promise<any> {
    const cache = await this.cache.get(email);
    if (!cache) return null;
    return JSON.parse(cache);
  }

  async isCacheValid(email: string): Promise<boolean> {
    const result = await this.cache.get(email);
    return result !== null; // Kalau null berarti sudah expired atau tidak ada
  }

  async deletecache(email: string) {
    await this.cache.del(email);
  }


  getcache(): Redis.Redis {
    return this.cache;
  }

  async setSession(token: string, dataData: any) {
    const data = { 
      email: dataData.email,
      username: dataData.username,
      namaLengkap: dataData.namaLengkap,
      jenisKelamin: dataData.jenisKelamin,
      alamat: dataData.alamat,
      noHP: dataData.noHP,
      pictUrl: dataData.pictUrl,
    }
    await this.cache.set(token, JSON.stringify(data));
  }
  async getSession(token: string) {
    const data = await this.cache.get(token);
    if (!data) return null;
    return JSON.parse(data);
  }
  async deleteSession(token: string) {
    await this.cache.del(token);
  }

}

@Module({
  providers: [MyRedisService],
  exports: [MyRedisService],
})
export class MyRedisModule {}