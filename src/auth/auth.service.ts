import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { UsersService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async signIn(userDto: any): Promise<any> {
    const { user, success, message } = await this.usersService.login(userDto);
    if (user) {
      const payload = { id: user._id, name: user.fName + user.lName };
      const data = {
        user,
        success,
        message,
        accessToken: await this.jwtService.signAsync(payload),}

      return data;
    } else {
      return {
        user,
        success,
        message,
      };
    }
  }

  async signUp(userDto: any): Promise<any> {
    const { user, success, message } = await this.usersService.signUp(userDto);
    
    if (user) {
      const payload = { id: user.id, name: user.firstName, email: user.email };
      const data = {
        accessToken: await this.jwtService.signAsync(payload),
        user,
        success,
        message,
      };
      return data
    } else {
      return {
        user,
        success,
        message,
      };
    }
  }

}
