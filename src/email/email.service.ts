// src/email/email.service.ts

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail', // Use your email service provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(from: string, subject: string, text: string) {
    try {
      const mailOptions = {
        from,
        to:"apotremwenedata4@gmail.com",
        subject,
        text,
      };

      await this.transporter.sendMail(mailOptions);
      return 'Email sent successfully';
    } catch (error) {
      throw new Error(`Error sending email: ${error.message}`);
    }
  }
}
