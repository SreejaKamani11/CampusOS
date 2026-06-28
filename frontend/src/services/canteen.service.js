import api from '../api/axios'

export async function getMenu() {
  const response = await api.get('/canteen/menu')
  return response.data
}

export async function addToCart(menuItemId, quantity = 1) {
  const response = await api.post('/cart/items', {
    serviceType: 'canteen',
    referenceId: menuItemId,
    quantity,
  })

  return response.data
}