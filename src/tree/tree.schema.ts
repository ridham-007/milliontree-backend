import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema  } from 'mongoose';
export type TreeDocument = Tree & Document;

interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

@Schema()
export class Tree {
  _id?: MongooseSchema.Types.ObjectId;

  @Prop()
  userId: string

  @Prop()
  treeName?: string;

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

  @Prop({
    day: { type: Number, enum: [1, 60, 90], required: false },
    url: { type: String, required: false }
  })
  images?: { day: number; url: string }[];
}

export const TreeSchema = SchemaFactory.createForClass(Tree);
