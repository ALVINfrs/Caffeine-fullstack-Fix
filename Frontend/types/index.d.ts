interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
}

interface Order {
  id: string
  order_number: string
  order_date: string
  customer_name: string
  email: string
  phone: string
  address: string
  subtotal: number
  shipping_fee: number
  total: number
  payment_method: string
  status: string
  item_count: number
}

interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  price: number
  quantity: number
  subtotal: number
}
