import { Controller, Post, Response, Request, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CheckoutSession } from './dto/input/checkoutSession.input';
import { Public } from 'src/decorator/public.decorator';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Public()
  @Post('/create-checkout-session')
  createCheckoutSession(@Body() checkoutSession: CheckoutSession) {
    return this.stripeService.createCheckoutSessionForTickets(checkoutSession);
  }
}
