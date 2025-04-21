import { Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post()
  postHello(): string {
    return this.appService.postHello();
  }
  @Get('tes')
  async tes(@Req() req) {
    const username = req.admin.username;
    return `Hello ${username}`;
  }
}
