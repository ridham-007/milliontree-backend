import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async signIn(@Body() userDto: any) {
    return await this.authService.signIn(userDto);
  }

  @Public()
  @Post('signup')
  async signUn(@Body() userDto: any) {
    return await this.authService.signUp(userDto);
  }

}