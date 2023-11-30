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
import { ResetPasswordDto } from './dtos/ResetPassword.dto';
import { LoginDto } from './dtos/Login.dto';
import { RegistrationDto } from './dtos/Registration.dto';
import { MyLoggerService } from 'src/my-logger/my-logger.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly logger: MyLoggerService,
  ) {}

  async login(userDto: LoginDto) {
    const user = await this.validateUser(userDto);
    this.logger.warn(`The user logged in. Id:${user.id}`);
    return this.generateToken(user);
  }

  async registration(userDto: RegistrationDto) {
    const existingByEmail = await this.usersService.getUserByEmail(
      userDto.email,
    );

    if (existingByEmail) {
      this.logger.error(
        `This email is already registered. Email:${existingByEmail}`,
      );
      throw new HttpException(
        'This email is already registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingByUserName = await this.usersService.getUserByUsername(
      userDto.username,
    );

    if (existingByUserName) {
      this.logger.error(
        `This username is already registered. Username:${existingByUserName}`,
      );
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
    this.logger.warn(`The user has registered. Id:${user.id}`);
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
      this.logger.error(`User not found by Email. Email:${user.email}`);
      throw new UnauthorizedException({ message: 'Invalid Email' });
    }
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (!passwordEquals) {
      this.logger.error(`Invalid password Id:${user.id}`);
      throw new UnauthorizedException({ message: 'Invalid password' });
    }
    this.logger.warn(`The user has validated. Id:${user.id}`);
    return user;
  }

  async resetPassword(userId: number, resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      this.logger.error(`The User not find. Id:${user.id}`);
      throw new NotFoundException('User not find');
    }

    const hashPassword = await bcrypt.hash(resetPasswordDto.password, 3);
    user.password = hashPassword;
    this.logger.warn(`The user reset password. Id:${user.id}`);
    await this.usersService.updatePassword(user);
  }
}
