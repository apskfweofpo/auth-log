import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { ChangePasswordDto } from './dtos/change-password.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('change-password')
    changePassword(@Body() changePasswordDto: ChangePasswordDto) {
        this.usersService.changePassword(changePasswordDto);
    }
}
