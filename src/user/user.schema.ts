import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema  } from 'mongoose';
export type UserDocument = User & Document;

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

  @Prop({ default: null })
  stripeCustomerId?: string;

  @Prop({ default: null })
  userRole?: string;

  @Prop({ default: null })
  resetCode: string;

  @Prop({ default: null })
  resetCodeExpires: number;

}

export const UserSchema = SchemaFactory.createForClass(User);
