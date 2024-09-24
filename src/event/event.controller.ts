import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    Query
  } from '@nestjs/common';
  import { Public } from 'src/decorator/public.decorator';
import { EventService } from './event.service';
import { Event } from './event.schema';
  
  @Controller('event')
  export class EventController {
    constructor(private readonly eventService: EventService) {}
  
    @Public()
    @Post('addupdate-event')
    async createOrUpdateEvent(
      @Body('addUpdateEvent') addUpdateEvent: any,
    ) {
      try {
        const document = await this.eventService.createOrUpdateEvent(
          addUpdateEvent,
        );
        return { data: document, success: true };
      } catch (error) {
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
      return { data: events};
    } catch (error) {
      return {
        data: null,
        success: false,
        message: error.message,
      };
    }
  }
  }