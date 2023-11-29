import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { ResetPasswordDto } from './dtos/ResetPassword.dto';
import { LoginDto } from './dtos/Login.dto';
import { RegistrationDto } from './dtos/Registration.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: LoginDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(userDto: RegistrationDto) {
    const existingByEmail = await this.usersService.getUserByEmail(
      userDto.email,
    );

    if (existingByEmail) {
      throw new HttpException(
        'This email is already registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingByUserName = await this.usersService.getUserByUsername(
      userDto.username,
    );

    if (existingByUserName) {
      throw new HttpException(
        'This username is already registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await bcrypt.hash(userDto.password, 3);
    const user = await this.usersService.createUser({
      ...userDto,
      password: hashPassword,
    });
    return this.generateToken(user);
  }
  private generateToken(user: User) {
    const payload = { id: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: LoginDto) {
    const user = await this.usersService.getUserByEmail(userDto.email);
    if (!user) {
      throw new UnauthorizedException({ message: 'Invalid Email' });
    }
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (!passwordEquals) {
      throw new UnauthorizedException({ message: 'Invalid password' });
    }
    return user;
  }

  async resetPassword(userId: number, resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const hashPassword = await bcrypt.hash(resetPasswordDto.password, 3);
    user.password = hashPassword;

    await this.usersService.updatePassword(user);
  }
}
