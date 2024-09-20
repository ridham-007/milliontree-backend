import { Controller, Get, Post, Body, Param, Patch, Delete} from '@nestjs/common';
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

  @Public()
  @Delete('/:id')
  deleteUserById(@Param('id') id: string) {
    return this.usersService.deleteUserById(id);
  }
 
  @Public()
  @Patch('/update/:id')
  update(@Param() { id }, @Body() user: User) {
    return this.usersService.update(id, user);
  }

  @Public()
  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Public()
  @Post('/:email')
  getUserByEmail(@Param('email') email: string) {
  return this.usersService.findByEmail(email);
}
}
