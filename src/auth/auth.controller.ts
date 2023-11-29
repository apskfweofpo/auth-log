import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ResetPasswordDto } from './dtos/ResetPassword.dto';
import { log } from 'console';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() userDto) {
    return this.authService.login(userDto);
  }

  @Post('/registration')
  registration(@Body() userDto) {
    return this.authService.registration(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/reset-password')
  resetPassword(@Request() req, @Body() resetPasswordDto: ResetPasswordDto) {
    const userId = req.userId;
    return this.authService.resetPassword(userId, resetPasswordDto);
  }
}
