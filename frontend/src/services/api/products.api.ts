import { axiosDefault } from "@/config/axios.config"

export type Product  = {
  id: string
  name: string
  price: number
  quantity: number
}



 export const getProducts = async () => {
  const res = await axiosDefault.get<Product[]>('/stripe/products')
  console.log(res.data)
  return res.data
 }