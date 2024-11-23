import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './blog.schema';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name)
    private blogModel: Model<BlogDocument>,
  ) {}

  async create(blog: Blog): Promise<Blog> {
    const createdBlog = new this.blogModel(blog);
    return createdBlog.save();
  }

  async update(id: string, blog: Blog): Promise<Blog> {
    return await this.blogModel
      .findByIdAndUpdate(id, blog, { new: true })
      .exec();
  }

  async getAllBlogs(): Promise<Blog[]> {
    return this.blogModel.find().exec();
  }

  // async deleteAllBlogs(): Promise<void> {
  //   await this.blogModel.deleteMany({});
  // }

  async remove(id: string): Promise<Blog> {
    return this.blogModel.findByIdAndDelete(id).exec();
  }

  // async createOrUpdateBLog(blogDto: any): Promise<Blog> {
  //   const { _id, ...updateData } = blogDto;
  //   if (_id) {
  //     const existingBlog = await this.blogModel.findById(_id).exec();
  //     if (!existingBlog) {
  //       throw new NotFoundException(`Blog with id ${_id} not found`);
  //     }
  //     Object.assign(existingBlog, updateData);
  //     return await existingBlog.save();
  //   } else {
  //     const newBlog = new this.blogModel(updateData);
  //     return await newBlog.save();
  //   }
  // }

  async createOrUpdateBLog(blogDto: any): Promise<Blog> {
    const { _id, ...updateData } = blogDto;
  
    if (_id) {
      const updatedBlog = await this.blogModel.findByIdAndUpdate(_id, updateData, { new: true }).exec();
      if (!updatedBlog) {
        throw new NotFoundException(`Blog with id ${_id} not found`);
      }
      return updatedBlog;
    } else {
      const newBlog = new this.blogModel(updateData);
      return await newBlog.save();
    }
  }

  async getBlogById(id: string): Promise<Blog> {
    const blog = await this.blogModel.findById(id).exec();
    if (!blog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }
    return blog;
  }

  async paginationBlog(query: any): Promise<any> {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 4;
    const skip = (page - 1) * limit;
  
    // Get the total count of documents
    const total = await this.blogModel.countDocuments().exec();
    
    // Fetch the paginated blog documents
    let blogs;
    if (query.status) {
      blogs = await this.blogModel
        .find({ status: true })
        .skip(skip)
        .limit(limit)
        .exec();
    } else {
      blogs = await this.blogModel.find().skip(skip).limit(limit).exec();
    }
    // Return pagination details along with the blogs
    return {
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
      blogs,
    };
  }

}


