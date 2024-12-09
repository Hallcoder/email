// src/email/email.service.ts

import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface EmailRateLimit {
  count: number;
  firstEmailTimestamp: number;
}

@Injectable()
export class EmailService {
  private transporter;
  private emailLimits: Map<string, EmailRateLimit> = new Map();
  private readonly logger = new Logger(EmailService.name);
  
  // Rate limit constants
  private readonly MAX_EMAILS_PER_HOUR = 5;
  private readonly HOUR_IN_MS = 60 * 60 * 1000; // 1 hour in milliseconds

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail', // Use your email service provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  private getEmailTemplate(text: string) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>FocusBuddy - Email Notification</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: white;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .logo-container {
              max-width: 300px;
              margin: 0 auto;
              padding: 20px 0;
            }
            
            .logo {
              width: 100%;
              height: auto;
            }
            
            .header {
              background-color: #30ad8e;
              color: white;
              padding: 20px;
              text-align: center;
            }

            .tagline {
              font-size: 1.2em;
              margin-top: 10px;
              color: white;
            }
            .content {
              padding: 20px;
              color: #444;
            }
            .footer {
              background-color: #f8f8f8;
              padding: 15px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #30ad8e;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo-container">
                <img src="cid:logo" alt="FocusBuddy" class="logo">
              </div>
              <div class="tagline">Overcome Temptations, Regain Control.</div>
            </div>
            <div class="content">
              ${text}
            </div>
            <div class="footer">
              © ${new Date().getFullYear()} FocusBuddy. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private checkRateLimit(from: string): boolean {
    const now = Date.now();
    const userLimit = this.emailLimits.get(from);

    if (!userLimit) {
      // First email from this user
      this.emailLimits.set(from, {
        count: 1,
        firstEmailTimestamp: now,
      });
      return true;
    }

    if (now - userLimit.firstEmailTimestamp >= this.HOUR_IN_MS) {
      // Reset counter if an hour has passed
      this.emailLimits.set(from, {
        count: 1,
        firstEmailTimestamp: now,
      });
      return true;
    }

    if (userLimit.count >= this.MAX_EMAILS_PER_HOUR) {
      this.logger.warn(`Rate limit exceeded for ${from}`);
      const timeLeft = Math.ceil((this.HOUR_IN_MS - (now - userLimit.firstEmailTimestamp)) / 1000 / 60);
      throw new HttpException(
        `Rate limit exceeded. Please try again in ${timeLeft} minutes.`,
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    // Increment counter
    this.emailLimits.set(from, {
      count: userLimit.count + 1,
      firstEmailTimestamp: userLimit.firstEmailTimestamp,
    });
    return true;
  }

  async sendEmail(from: string, subject: string, text: string) {
    try {
      // Check rate limit before sending email
      this.checkRateLimit(from);

      const mailOptions = {
        from,
        to: "apotremwenedata4@gmail.com",
        subject,
        html: this.getEmailTemplate(text),
        text: text,
        attachments: [{
          filename: 'logo.png',
          path: 'src/assets/logo.png', // Update this path to match your project structure
          cid: 'logo' // This 'cid' matches the src="cid:logo" in the template
        }]
      };

      await this.transporter.sendMail(mailOptions);
      return 'Email sent successfully';
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new Error(`Error sending email: ${error.message}`);
    }
  }

  // Optional: Method to clean up old rate limit entries
  private cleanupOldEntries() {
    const now = Date.now();
    for (const [from, limit] of this.emailLimits.entries()) {
      if (now - limit.firstEmailTimestamp >= this.HOUR_IN_MS) {
        this.emailLimits.delete(from);
      }
    }
  }
}
