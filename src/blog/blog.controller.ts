import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Delete,
    Put,
  } from '@nestjs/common';
  import { BlogService } from './blog.service';
  import { Blog } from './blog.schema';
  import { Public } from 'src/decorator/public.decorator';
  
  @Controller('blog')
  export class BlogController {
    constructor(private readonly blogService: BlogService) {}

    @Public()
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Blog> {
      return this.blogService.remove(id);
    }
  
    @Post()
    async create(@Body() blog: Blog): Promise<Blog> {        
      return this.blogService.create(blog);
    }
  
    @Put(':id')
    async update(@Param('id') id: string, @Body() blog: Blog): Promise<Blog> {
      return this.blogService.update(id, blog);
    }
  
    @Public()
    @Post('add-update-blog')
    async createOrUpdateBlog(@Body('addUpdateBlog') addUpdateBlog: any) {
      try {
        const document = await this.blogService.createOrUpdateBLog(addUpdateBlog);
        return { data: document, success: true };
      } catch (error) {
        return {
          data: null,
          success: false,
          message: error.message,
        };
      }
    }
  
    @Public()
    @Get('all-blogs')
    async getAllBlogs() {
      try {
        const blogs = await this.blogService.getAllBlogs();
        return { data: blogs, success: true };
      } catch (error) {
        return {
          data: null,
          success: false,
          message: error.message,
        };
      }
    }
  
    @Public()
    @Post('paginate-blog')
    async paginateQueries(@Body() filter: any) {
      try {
        const document = await this.blogService.paginationBlog(filter);
        return { data: document, success: true };
      } catch (error) {
        return {
          data: null,
          success: false,
          message: error.message,
        };
      }
    }
  
    // @Delete('delete-all-blogs')
    // async deleteAllBlogs() {
    //   try {
    //     await this.blogService.deleteAllBlogs();
    //     return { success: true, message: 'All blogs deleted successfully' };
    //   } catch (error) {
    //     return {
    //       success: false,
    //       message: error.message,
    //     };
    //   }
    // }
  
    @Public()
    @Get('get-by-id/:id')
    async getBlogById(@Param('id') id: string): Promise<any> {
      try {
        const blog = await this.blogService.getBlogById(id);
        return { data: blog, success: true };
      } catch (error) {
        return {
          data: null,
          success: false,
          message: 'Failed to fetch blog',
        };
      }
    }
  }
  