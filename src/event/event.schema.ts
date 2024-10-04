import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  _id?: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  eventName: string;

  @Prop({ required: true })
  region: string;

  @Prop({ type: [String], required: false })
  images?: string[];

  @Prop({ required: true })
  latitude: string;

  @Prop({ required: true })
  longitude: string;

  @Prop({ required: true })
  startDate?: Date;

  @Prop({ required: false })
  placeId: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);