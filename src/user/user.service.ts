// src/users/users.service.ts
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async create(user: User): Promise<{ message: string, success: boolean, data?: User }> {
    try {
      const eligibleDays = [1, 30, 60, 90]
      const { email, images } = user;

      const inValidKeys = images?.find((image: any) => !eligibleDays.includes(image.day));
      if (inValidKeys) {
        return { message: 'Day is not valid.', success: false };
      }

      const isUserEmailIsAlreadyExist = await this.userModel.find({ email });

      if (isUserEmailIsAlreadyExist?.length) {
        return { message: "Email is already exist!", success: false };
      }

      const newUser = new this.userModel(user);
      const userSaved = await newUser.save();

      return {
        message: 'User registered successfully!',
        data: userSaved,
        success: true
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return { message: 'Failed to register user.', success: false };
    }
  }

   async findById(id: any): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async deleteUserById(id: string): Promise<{ message: string; success: boolean }> {
    try {
      const result = await this.userModel.findByIdAndDelete(id);
      if (!result) {
        return { message: 'User not found!', success: false };
      }
      return { message: 'User deleted successfully!', success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new InternalServerErrorException('Failed to delete user.');
    }
  }

  async findByEmail(email: string): Promise<any> {
    try {
      const user = await this.userModel.findOne({ email }).exec();
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found.`);
      }
      return user;
    } catch (error) {
      console.error("Error finding user by email:", error.message);
      // return { message: `User with email ${email} not found.`, success: false };
    }
  }

  async update(id: string, user: any): Promise<{ message: string; success: boolean; data?: User }> {
    try {
      const eligibleDays = [1, 30, 60, 90]
      const existingUser = await this.userModel.findById(id);
      if (!existingUser) {
        return { message: "User not found!", success: false };
      }

      const inValidKeys = user?.images?.find((image: any) => !eligibleDays.includes(image.day));
      if (inValidKeys) {
        return { message: 'Day is not valid.', success: false };
      }

      const updatedUser: any = await this.userModel.findByIdAndUpdate(id, { $set: user }, { new: true });

      return {
        message: 'User updated successfully!',
        data: updatedUser,
        success: true,
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return { message: 'Failed to update user.', success: false };
    }
  }

}
