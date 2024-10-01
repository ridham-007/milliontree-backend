// src/users/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema  } from 'mongoose';
export type UserDocument = User & Document;

interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

@Schema()
export class User {
  _id?: MongooseSchema.Types.ObjectId;

  @Prop()
  fName: string;

  @Prop()
  lName: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  // @Prop({ required: true })
  // name: string;

  // @Prop({ required: true })
  // email: string;

  @Prop()
  cohort?: string;

  @Prop()
  datePlanted?: Date;

  @Prop({
    required: false, type: {
      name: { type: String, required: false },
      latitude: { type: Number, required: false },
      longitude: { type: Number, required: false }
    }
  })
  location?: Location;

  @Prop({ default: null })
  stripeCustomerId?: string;

  @Prop({
    day: { type: Number, enum: [1, 60, 90], required: false },
    url: { type: String, required: false }
  })
  images?: { day: number; url: string }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
