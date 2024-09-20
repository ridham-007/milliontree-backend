// src/users/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  cohort?: string;

  @Prop()
  datePlanted?: Date;

  @Prop()
  location?: string;

  @Prop({ default: null })
  stripeCustomerId?: string;

  @Prop({
    day: { type: Number, enum: [1, 60, 90], required: true },
    url: { type: String, required: true }
  })
  images?: { day: number; url: string }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
