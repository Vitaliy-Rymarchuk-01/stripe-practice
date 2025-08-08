import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

    if (!STRIPE_SECRET_KEY) {
      throw Error('STRIPE_SECRET_KEY must be provided in .env variables');
    }
    this.stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil',
    });
  }

  async createCheckoutSession(product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }): Promise<{ id: string }> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
            },
            unit_amount: product.price,
          },
          quantity: product.quantity,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3001/success',
      cancel_url: 'http://localhost:3001/cancel',
    });

    return { id: session.id };
  }

  async createPaymentIntent(amount: number, currency: string = 'usd') {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        payment_method_types: ['card'],
      });

      return {
        clientSecret: paymentIntent.client_secret,
      };
    } catch (err) {
      this.handleStripeError(err);
    }
  }

  async getProducts() {
    const products = [
      {
        id: 'prod_1',
        name: 'Vintage Leather Jacket',
        price: 12000,
        quantity: 10,
      },
      {
        id: 'prod_2',
        name: 'Classic White Sneakers',
        price: 8000,
        quantity: 15,
      },
      { id: 'prod_3', name: 'Smartwatch Pro', price: 22000, quantity: 5 },
      {
        id: 'prod_4',
        name: 'Noise Cancelling Headphones',
        price: 15000,
        quantity: 8,
      },
      { id: 'prod_5', name: 'Gaming Keyboard', price: 9000, quantity: 12 },
      { id: 'prod_6', name: 'Wireless Charger', price: 4000, quantity: 20 },
      { id: 'prod_7', name: '4K Monitor', price: 35000, quantity: 4 },
      { id: 'prod_8', name: 'Bluetooth Speaker', price: 7000, quantity: 18 },
      { id: 'prod_9', name: 'Fitness Tracker', price: 6000, quantity: 22 },
      { id: 'prod_10', name: 'E-reader', price: 11000, quantity: 9 },
    ];
    return products;
  }

  private handleStripeError(error: any) {
    if (error.type === 'StripeCardError') {
      throw new BadRequestException(error.message);
    } else if (error.type === 'StripeInvalidRequestError') {
      throw new BadRequestException('Invalid Stripe request: ' + error.message);
    } else if (error.type === 'StripeAuthenticationError') {
      throw new UnauthorizedException('Stripe authentication failed');
    } else if (error.type === 'StripeRateLimitError') {
      throw new BadRequestException(
        'Too many Stripe requests. Try again later.',
      );
    } else if (error.type === 'StripeAPIError') {
      throw new InternalServerErrorException('Stripe internal error');
    } else {
      throw new InternalServerErrorException(
        'Unexpected Stripe error: ' + error.message,
      );
    }
  }
}
