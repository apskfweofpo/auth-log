import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ResetPasswordDto } from './dtos/ResetPassword.dto';
import { LoginDto } from './dtos/Login.dto';
import { RegistrationDto } from './dtos/Registration.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('/registration')
  registration(@Body() registrationDto: RegistrationDto) {
    return this.authService.registration(registrationDto);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Post('/reset-password')
  resetPassword(@Request() req, @Body() resetPasswordDto: ResetPasswordDto) {
    const userId: number = req.userId;
    return this.authService.resetPassword(userId, resetPasswordDto);
  }
}
