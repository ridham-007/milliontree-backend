// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: User): Promise<{ message: string, success: boolean, data?: User }> {
    const { email } = user;
    const isUserEmailIsAlreadyExist = await this.userModel.find({ email });
    console.log({isUserEmailIsAlreadyExist});
    
    if (isUserEmailIsAlreadyExist?.length) {
      return { message: "Email is already exist!", success: false }
    }
    const newUser = new this.userModel(user);
    const userSaved = await newUser.save();

    return {
      message: 'User registered successfully!',
      data: userSaved,
      success: true
    }
  }
}
