import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { Public } from 'src/decorator/public.decorator';
import { EventService } from './event.service';
import { Event } from './event.schema';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Public()
  @Post('addupdate-event')
  async createOrUpdateEvent(@Body('addUpdateEvent') addUpdateEvent: any) {
    try {
      const document = await this.eventService.createOrUpdateEvent(
        addUpdateEvent,
      );
      return document;
    } catch (error) {
      console.log({error})
      return {
        data: null,
        success: false,
        message: error.message,
      };
    }
  }

  @Public()
  @Get('events-by-region')
  async getEventsByRegion(@Query('region') region: string) {
    try {
      const events = await this.eventService.findEventsByRegion(region);
      return { data: events };
    } catch (error) {
      return {
        data: null,
        success: false,
        message: error.message,
      };
    }
  }

  @Public()
  @Delete(':id')
  async deleteEvent(@Param('id') id: string): Promise<any> {
    try {
      const deletedEvent = await this.eventService.deleteEvent(id);
      if (!deletedEvent) {
        return { data: null, success: false, message: 'Event not found' };
      }
      return {
        data: deletedEvent,
        success: true,
        message: 'Event deleted successfully',
      };
    } catch (error) {
      return { data: null, success: false, message: error.message };
    }
  }

  @Public()
  @Get('list')
  async getEvents(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    try {
      const eventsData = await this.eventService.getEvents(page, limit);
      return {
        data: eventsData,
        success: true,
        message: 'Events fetched successfully',
      };
    } catch (error) {
      return { data: null, success: false, message: error.message };
    }
  }

  @Public()
  @Get('completed')
  async getCompletedEvents(): Promise<any> {
    try {
      const completedEvents = await this.eventService.getCompletedEvents();
      return {
        data: completedEvents,
        success: true,
        message: 'Completed events fetched successfully',
      };
    } catch (error) {
      return { data: null, success: false, message: error.message };
    }
  }

  @Public()
  @Get('grouped-by-month')
  async getEventsGroupedByMonth(): Promise<any> {
    try {
      const upcomingEvents =
        await this.eventService.getEventsGroupedByMonth();
      return {
        data: upcomingEvents,
        success: true,
        message: 'Upcoming events grouped by month fetched successfully',
      };
    } catch (error) {
      return { data: null, success: false, message: error.message };
    }
  }

  @Public()
  @Get('upcoming-grouped-by-month')
  async getUpcomingEventsGroupedByMonth(): Promise<any> {
    try {
      const upcomingEvents =
        await this.eventService.getUpcomingEventsGroupedByMonth();
      return {
        data: upcomingEvents,
        success: true,
        message: 'Upcoming events grouped by month fetched successfully',
      };
    } catch (error) {
      return { data: null, success: false, message: error.message };
    }
  }

  @Public()
  @Get('completed-grouped-by-month')
  async getCompletedEventsGroupedByMonth(): Promise<any> {
    try {
      const completedEvents =
        await this.eventService.getCompletedEventsGroupedByMonth();
      return {
        data: completedEvents,
        success: true,
        message: 'Completed events grouped by month fetched successfully',
      };
    } catch (error) {
      return { data: null, success: false, message: error.message };
    }
  }

  @Public()
  @Get('all-events')
  async getAllEvents(): Promise<any> {
    try {
      const allEvents =
        await this.eventService.getAllEvents();
      return {
        data: allEvents,
        success: true,
        message: 'All events fetched successfully',
      };
    } catch (error) {
      return { data: null, success: false, message: error.message };
    }
  }
}
