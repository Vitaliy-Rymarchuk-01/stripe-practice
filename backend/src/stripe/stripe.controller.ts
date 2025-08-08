import { Body, Controller, Get, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body()
    product: {
      id: string;
      name: string;
      price: number;
      quantity: number;
    },
  ) {
    return this.stripeService.createCheckoutSession(product);
  }

  @Get('/products')
  async getProducts() {
    return this.stripeService.getProducts();
  }
}
