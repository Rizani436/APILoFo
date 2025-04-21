import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! Get';
  }
  postHello(): string {
    return 'Hello World! Post';
  }
}
