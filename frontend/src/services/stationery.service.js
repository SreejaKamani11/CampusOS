import api from '../api/axios'

export async function getProducts() {
  const response = await api.get('/stationery/products')

  return response.data
}
