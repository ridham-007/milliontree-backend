// src/users/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type UserDocument = User & Document;

interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  cohort?: string;

  @Prop()
  datePlanted?: Date;

  @Prop({
    required: false, type: {
      name: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  })
  location?: Location;

  @Prop({ default: null })
  stripeCustomerId?: string;

  @Prop({
    day: { type: Number, enum: [1, 60, 90], required: true },
    url: { type: String, required: true }
  })
  images?: { day: number; url: string }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
