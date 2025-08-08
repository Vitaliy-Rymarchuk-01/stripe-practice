'use client'

import { loadStripe } from '@stripe/stripe-js';

export default function Checkout() {
  const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

  if(!NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY){
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must be provide in .env variables')
  }

  const stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const response = await fetch('http://localhost:3000/api/stripe/create-checkout-session', {
      method: 'POST',
    });
    const session = await response.json();
    await stripe?.redirectToCheckout({ sessionId: session.id });
  };
  return (
    <div>
      <h1>Stripe Checkout Example</h1>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
}