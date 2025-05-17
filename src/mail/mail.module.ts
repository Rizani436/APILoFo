import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService], // agar bisa diinject di service lain
})
export class MailModule {} // atau module sesuai strukturmu
