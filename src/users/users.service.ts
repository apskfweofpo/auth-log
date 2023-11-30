import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { MyLoggerService } from 'src/my-logger/my-logger.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly logger: MyLoggerService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new User();
    newUser.email = createUserDto.email;
    newUser.username = createUserDto.username;
    newUser.password = createUserDto.password;
    this.logger.warn(`The user has created. Id:${newUser.id}`);
    return await this.userRepository.save(newUser);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user;
  }

  async updatePassword(user: User): Promise<User> {
    const existingUser = await this.findById(user.id);

    if (!existingUser) {
      this.logger.error(`The user not found. Id:${existingUser.id}`);
      throw new NotFoundException('Пользователь не найден');
    }

    existingUser.password = user.password;
    return this.userRepository.save(existingUser);
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}
