import axios, { AxiosInstance } from "axios";


export const axiosDefault : AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
		'Content-Type': 'application/json'
	}
})