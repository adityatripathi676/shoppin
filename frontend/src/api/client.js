import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

export const getProducts = async (query = {}) => {
  const { data } = await api.get('/products', { params: query })
  return data
}

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`)
  return data
}

export const getOrders = async () => {
  const { data } = await api.get('/orders')
  return data
}

export const getDashboard = async () => {
  const { data } = await api.get('/dashboard')
  return data
}

export const createPaymentIntent = async (amount) => {
  const { data } = await api.post('/payments/intent', { amount, provider: 'DemoPay' })
  return data
}

export const createOrder = async (payload) => {
  const { data } = await api.post('/orders', payload)
  return data
}

export const cancelOrder = async (orderId) => {
  const { data } = await api.patch(`/orders/${orderId}/cancel`)
  return data
}
