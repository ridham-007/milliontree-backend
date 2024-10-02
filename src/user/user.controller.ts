import { Controller, Post, Body, } from '@nestjs/common';
import { UsersService } from './user.service';
import { Public } from 'src/decorator/public.decorator';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

 @Public()
 @Post('login')
 async login(@Body() userDto: any) {
   return this.usersService.login(userDto);
 }
 
 @Public()
 @Post('signup')
 async signUp(@Body() userDto: any) {
   return this.usersService.signUp(userDto);
 }
}
