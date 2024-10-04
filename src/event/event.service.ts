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
  ): Promise<Event | { message: string; data: Event; success: boolean }> {
    const { _id } = createEventDto;
    try {
      if (_id) {
        const existingEvent = await this.eventModel.findByIdAndUpdate(
          _id,
          createEventDto,
          { new: true },
        );
        if (!existingEvent) {
          throw new NotFoundException(`Event with id ${_id} not found`);
        }
        return {
          data: existingEvent,
          message: 'Event Updated Successfully',
          success: true,
        };
      } else {
        const newEvent = await this.eventModel.create(createEventDto);
        return {
          data: newEvent,
          message: 'Event Created Successfully',
          success: true,
        };
      }
    } catch (error) {
      console.log({error})
      throw new InternalServerErrorException(
        'Failed to create or update event',
      );
    }
  }

  async findEventsByRegion(
    region: string,
  ): Promise<{ data: Event[]; success: boolean; message: string }> {
    try {
      const events = await this.eventModel
        .find({
          region: { $regex: new RegExp(region, 'i') },
        })
        .exec();
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

  // Event Service
  async deleteEvent(eventId: string): Promise<Event> {
    return this.eventModel.findByIdAndDelete(eventId).exec();
  }

  async getEvents(
    page: number,
    limit: number,
  ): Promise<{ events: Event[]; total: number }> {
    const skip = (page - 1) * limit;
    const events = await this.eventModel.find().skip(skip).limit(limit).exec();
    const total = await this.eventModel.countDocuments().exec(); // Total number of records
    return { events, total };
  }

  async getCompletedEvents(): Promise<Event[]> {
    const currentDate = new Date();
    return this.eventModel
      .find({ startDate: { $lt: currentDate } })
      .sort({ startDate: -1 })
      .exec();
  }

  // Event Service
async getUpcomingEventsGroupedByMonth(): Promise<any> {
  const currentDate = new Date();
  const events = await this.eventModel
    .find({ startDate: { $gte: currentDate } })
    .sort({ startDate: -1 })
    .exec();

  return this.groupEventsByMonth(events);
}

private groupEventsByMonth(events: Event[]): Record<string, Event[]> {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const groupedEvents = months.reduce((acc, month) => {
    acc[month] = [];
    return acc;
  }, {} as Record<string, Event[]>);

  events.forEach(event => {
    const month = months[new Date(event.startDate).getMonth()];
    groupedEvents[month].push(event);
  });

  return groupedEvents;
}

  async getCompletedEventsGroupedByMonth(): Promise<any> {
    const currentDate = new Date();
    const events = await this.eventModel
      .find({ startDate: { $lt: currentDate } })
      .sort({ startDate: -1 })
      .exec();
    return this.groupEventsByMonth(events)
  }

  async getEventsGroupedByMonth(): Promise<any> {
    const currentDate = new Date();
  
    // Fetch upcoming events
    const upcomingEventsPromise = this.eventModel
      .find({ startDate: { $gte: currentDate } })
      .sort({ startDate: -1 })
      .exec();
  
    // Fetch completed events
    const completedEventsPromise = this.eventModel
      .find({ startDate: { $lt: currentDate } })
      .sort({ startDate: -1 })
      .exec();
  
    // Wait for both promises to resolve
    const [upcomingEvents, completedEvents] = await Promise.all([upcomingEventsPromise, completedEventsPromise]);
  
    // Group events by month
    const upcomingGroupedByMonth = this.groupEventsByMonth(upcomingEvents);
    const completedGroupedByMonth = this.groupEventsByMonth(completedEvents);
  
    // Combine both into a single response
    return {
      upcoming: upcomingGroupedByMonth,
      completed: completedGroupedByMonth,
    };
  }

  async getAllEvents(): Promise<any> {
    const events = await this.eventModel
      .find() // Fetches all events without filtering
      .sort({ startDate: -1 }) // Sort by start date (latest first)
      .exec();
  
    return events;
  }
}
