import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify')
  async verifyToken(@Body() body: { token: string }) {
    return this.authService.verifyToken(body.token);
  }

  @Post('google/token')
  async googleAuthWithToken(@Body() body: { idToken: string }) {
    try {
      const { user, customToken } = await this.authService.googleLoginWithToken(body.idToken);
      return { user, customToken };
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }
} 