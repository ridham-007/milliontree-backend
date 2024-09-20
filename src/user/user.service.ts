// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async create(user: User): Promise<{ message: string, success: boolean, data?: User }> {
    try {
      const eligibleDays = [1, 60, 90]
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

  async update(id: string, user: any): Promise<{ message: string; success: boolean; data?: User }> {
    try {
      const eligibleDays = [1, 60, 90]
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

  async getPlantedTrees(): Promise<{ message?: string; success: boolean; data?: any }> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_EVERTREEN_URL}/tree-models`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          "evertreen-user-apikey": process.env.NEXT_PUBLIC_EVERTREEN_API_KEY,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const { tree_models } = await response.json();
  
      const locations = await this.userModel.find({}, { location: 1, _id: 0 });
  
      let treeLocations: { name: string; location: { latitude: number; longitude: number } }[] = [];
  
      if (locations?.length) {
        treeLocations = locations.map((location: any) => ({
          name: location?.location?.name,
          location: {
            latitude: location?.location?.latitude,
            longitude: location?.location?.longitude,
          },
        })).filter(loc => loc.name);
      }
  
      const allPlantedTrees = [...tree_models, ...treeLocations];
  
      return {
        data: allPlantedTrees,
        success: true,
      };
    } catch (error) {
      console.error(error);
      return { message: 'Failed to fetch planted tree data', success: false };
    }
  }
  
}
