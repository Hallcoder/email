import { Controller,Post,Body} from '@nestjs/common';
import { AppService } from './app.service';
import { EmailService } from './email/email.service';

@Controller()
export class AppController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  sendMail(@Body() body) {
    console.log(process.env.EMAIL_USER);
    return this.emailService.sendEmail(body.email,body.name,body.text);
  }
}
