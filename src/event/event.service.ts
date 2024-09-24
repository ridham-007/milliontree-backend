import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { Event, EventDocument } from './event.schema';
  
  @Injectable()
  export class EventService {
    constructor(
      @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    ) {}
  
    async createOrUpdateEvent(
      createEventDto: any,
    ): Promise<Event| {message:string, data: Event, success:boolean}> {
      const {_id} = createEventDto
        try {
          if (_id) {
            const existingEvent = await this.eventModel.findByIdAndUpdate(_id, createEventDto, {new:true});
            if (!existingEvent) {
              throw new NotFoundException(`Event with id ${_id} not found`);
          }
          return existingEvent
        } else {
          const newEvent = await this.eventModel.create(createEventDto);          
          return {data:newEvent, message:"Event Created Successfully", success: true}
        }
      } catch (error) {
        throw new InternalServerErrorException(
          'Failed to create or update event',
        );
      }
    }

    async findEventsByRegion(region: string): Promise<{ data: Event[]; success: boolean; message: string }> {
      try {
        const events = await this.eventModel.find({
          region: { $regex: new RegExp(region, 'i') }, 
        }).exec();
        if (events.length === 0) {
          return {
            data: [],
            success: false,
            message: `No events found for region: ${region}`,
          };
        }
    
        return {
          data: events,
          success: true,
          message: null,
        };
      } catch (error) {
        throw new Error(`Error retrieving events by region: ${error.message}`);
      }
    }
  }