// mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail', // atau smtp lain
    auth: {
      user: 'LostNFound.Lombok@gmail.com',
      pass: 'vgbb pwet niha ghrh', // bukan password biasa, tapi app password dari Gmail
    },
  });

  async sendResetCodeEmail(to: string, code: string) {
    const mailOptions = {
      from: '"Admin App Kamu" <your-email@gmail.com>',
      to,
      subject: 'Kode Reset Password',
      text: `Kode verifikasi reset password Anda adalah: ${code}`,
      html: `<p>Kode verifikasi reset password Anda adalah:</p><h2>${code}</h2>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (err) {
      console.error('Gagal mengirim email:', err);
      throw new Error('Gagal mengirim email');
    }
  }
}
