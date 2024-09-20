import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
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
  @Patch('/update/:id')
  update(@Param() { id }, @Body() user: User) {
    return this.usersService.update(id, user);
  }

  @Public()
  @Get('/planted-trees')
  getPlantedTrees() {
    return this.usersService.getPlantedTrees();
  }
}
