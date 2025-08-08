'use client'

import { FC } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ToastContainer } from 'react-toastify'

const queryClient = new QueryClient()

type ProvidersProps = {
	children: React.ReactNode
}

export const Providers: FC<ProvidersProps> = ({ children }) => {
	return (
		<QueryClientProvider client={queryClient}>
			{children} <ToastContainer />
		</QueryClientProvider>
	)
}