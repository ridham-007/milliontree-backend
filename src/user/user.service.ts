// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }
  
  async login(userDto: any): Promise<any> {
    const { email, password } = userDto;
  
    const userDetails = await this.userModel.findOne({ email }).lean().exec();
    if (!userDetails) {
      return {
        success: false,
        message: 'User not found',
      };
    }
  
    if (userDetails.password?.length) {
      const isPasswordValid = await bcrypt.compare(
        password,
        userDetails.password,
      );
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }
      return {
        success: true,
        message: 'Login Successfully',
        user: userDetails,
      };
    } else {
      return {
        success: false,
        message: `Email registered with social login`,
        user: userDetails,
      };
    }
  }
  
  async signUp(userDto: any): Promise<any> {
    const { fName, lName, email, userRole, password } = userDto;
   
    const userDetails = await this.userModel.findOne({ email }).exec();
    if (userDetails) {
      return {
        success: false,
        message: 'User already registered',
      };
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      fName,
      lName,
      email,
      userRole,
      password: hashedPassword,
    });

    return {
      success: true, 
      message: 'Registered successfully.',
      user: await user.save(),
    };
  }

  async getUsers(
    page: number,
    limit: number,
  ): Promise<{ users: User[]; total: number }> {
    const skip = (page - 1) * limit;
    const users = await this.userModel.find().skip(skip).limit(limit).exec();
    const total = await this.userModel.countDocuments().exec();
    return { users, total };
  }

  async updateUser(id: string, updateUserDto: any): Promise<any> {
    
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: updateUserDto },
      { new: true }
    ).exec();

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  }
}
