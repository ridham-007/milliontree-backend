// src/users/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  cohort: string;

  @Prop()
  datePlanted: Date;

  @Prop()
  location: string;

  @Prop()
  image: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
