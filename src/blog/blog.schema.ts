import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import Mongoose, { Document, Schema as MongooseSchema } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema({ timestamps: true })
export class Blog {
  _id?: MongooseSchema.Types.ObjectId;

  @Prop()
  userId?: string;

  @Prop({ default: null })
  title: string;
  
  @Prop()
  createDate?: Date;

  @Prop({ default: null })
  content: string;

  @Prop({ default: null })
  description: string;

  @Prop({ default: null })
  slug?: string;

  @Prop({ default: null })
  creditBy?: string;

  @Prop({ default: null })
  featureImage?: string;

  @Prop({ default: null })
  location?: string;

  @Prop()
  status?: boolean;

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  jsonContent: Record<string, any>;
        
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
