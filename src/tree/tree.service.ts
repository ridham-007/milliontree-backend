// src/users/users.service.ts
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Tree, TreeDocument } from './tree.schema';

@Injectable()
export class TreeService {
  constructor(@InjectModel(Tree.name) private treeModel: Model<TreeDocument>) { }

  async create(tree: Tree): Promise<{ message: string, success: boolean, data?: Tree }> {
    try {
      const eligibleDays = [1, 60, 90]
      const { images } = tree;

      const inValidKeys = images?.find((image: any) => !eligibleDays.includes(image.day));
      if (inValidKeys) {
        return { message: 'Day is not valid.', success: false };
      }

      const newTree = new this.treeModel(tree);
      const treeSaved = await newTree.save();

      return {
        message: 'Tree registered successfully!',
        data: treeSaved,
        success: true
      };
    } catch (error) {
      console.error('Error creating tree:', error);
      return { message: 'Failed to register tree.', success: false };
    }
  }

   async findById(id: any): Promise<Tree> {
    return this.treeModel.findById(id).exec();
  }

  async deleteTreeById(id: string): Promise<{ message: string; success: boolean }> {
    try {
      const result = await this.treeModel.findByIdAndDelete(id);
      if (!result) {
        return { message: 'Tree not found!', success: false };
      }
      return { message: 'Tree deleted successfully!', success: true };
    } catch (error) {
      console.error('Error deleting tree:', error);
      throw new InternalServerErrorException('Failed to delete tree.');
    }
  }

  async findByUserId(userId: string): Promise<any> {
    try {
      const tree = await this.treeModel.find({ userId }).exec();
      if (!tree) {
        return { message: `Tree not found.`, success: false };
      }
      return {tree, success: true }
    } catch (error) {
      console.error("Error finding user by userId:", error.message);
    }
  }

  async update(id: string, tree: any): Promise<{ message: string; success: boolean; data?: Tree }> {
    try {
      const eligibleDays = [1, 60, 90]
      const existingTree = await this.treeModel.findById(id);
      if (!existingTree) {
        return { message: "Tree not found!", success: false };
      }

      const inValidKeys = tree?.images?.find((image: any) => !eligibleDays.includes(image.day));
      if (inValidKeys) {
        return { message: 'Day is not valid.', success: false };
      }

      const updatedTree: any = await this.treeModel.findByIdAndUpdate(id, { $set: tree }, { new: true });

      return {
        message: 'Tree updated successfully!',
        data: updatedTree,
        success: true,
      };
    } catch (error) {
      console.error('Error updating tree:', error);
      return { message: 'Failed to update tree.', success: false };
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
  
      const locations = await this.treeModel.find({}, { location: 1, _id: 0 });
  
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
  
      const groupedTrees = allPlantedTrees.reduce((acc, tree) => {
        const { latitude, longitude } = tree.location;
        const key = `${latitude},${longitude}`;
  
        if (!acc[key]) {
          acc[key] = { location: { latitude, longitude }, trees: [] };
        }
  
        acc[key].trees.push(tree?.name.trim().split('Trees in ')[1]);
  
        return acc;
      }, {} as Record<string, { location: { latitude: number; longitude: number }; trees: string[] }>);
  
      const groupedArray = Object.values(groupedTrees);
  
      return {
        data: groupedArray,
        success: true,
      };
    } catch (error) {
      console.error(error);
      return { message: 'Failed to fetch planted tree data', success: false };
    }
  }
}
