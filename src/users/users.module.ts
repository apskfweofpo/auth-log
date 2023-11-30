import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MyLoggerModule } from 'src/my-logger/my-logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    MyLoggerModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
