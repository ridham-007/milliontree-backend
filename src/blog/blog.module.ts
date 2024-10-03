import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { Blog, BlogSchema } from './blog.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogController } from './blog.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Blog.name, schema: BlogSchema }]
    ),
  ],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
