import { Controller, Post, Body, Get, Query, Patch, Param } from '@nestjs/common';
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

 @Public()
  @Get('list')
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    try {
      const usersData = await this.usersService.getUsers(page, limit);
      return {
        data: usersData,
        success: true,
        message: 'Users fetched successfully',
      };
    } catch (error) {
      return { data: null, success: false, message: error.message };
    }
  }

  @Public()
  @Patch('update/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: any,
  ): Promise<any> {
    
    try {
      const updatedUser = await this.usersService.updateUser(id, updateUserDto);
      return {
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
