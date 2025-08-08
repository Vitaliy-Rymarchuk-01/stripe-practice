'use client'

import { axiosDefault } from '@/config/axios.config'
import { getProducts, Product } from '@/services/api/products.api'
import { loadStripe } from '@stripe/stripe-js'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { FC } from 'react'

const page: FC = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  if (isLoading) return <p className="text-center mt-10 text-gray-500">Loading products...</p>

  const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  
    if(!NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY){
      throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must be provide in .env variables')
    }
  
    const stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

    const handleBuyClick = async (product: Product) => {
    const stripe = await stripePromise

    const response = await axiosDefault.post("/stripe/create-checkout-session", product)

    const session = await response.data

    if (!stripe || !session.id) {
      console.error('Stripe or session ID not available')
      return
    }

    await stripe.redirectToCheckout({ sessionId: session.id })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products?.map((product: Product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md p-5 hover:scale-105 transform transition-transform"
        >
          <h2 className="text-lg text-black font-semibold mb-2">{product.name}</h2>
          <p className="text-gray-700 mb-1">
            <span className="font-medium">Price:</span> ${product.price / 10}
          </p>
          <p className="text-gray-700 mb-4">
            <span className="font-medium">Quantity:</span> {product.quantity}
          </p>
          <button
            onClick={() => handleBuyClick(product)}
            className="cursor-pointer  w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          >
            Buy
          </button>
        </div>
      ))}
    </div>
  )
}

export default page
