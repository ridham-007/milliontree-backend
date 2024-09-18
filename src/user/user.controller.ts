import { Controller, Get, Post, Body } from '@nestjs/common';
import { User } from './user.schema';
import { UsersService } from './user.service';
import { Public } from 'src/decorator/public.decorator';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('/register')
  create(@Body() user: User) {
    return this.usersService.create(user);
  }
}
