import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getCart,
  updateCartItem,
  removeFromCart,
  checkout,
} from '../../services/cart.service'

function CartPage() {
  const navigate = useNavigate()

  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchCart = async () => {
    try {
      const response = await getCart()
      setCartItems(response.data?.items || [])
    } catch (error) {
      console.error(error.response?.data || error.message)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const handleIncrease = async (item) => {
    try {
      await updateCartItem(item.id, item.quantity + 1)
      fetchCart()
    } catch (error) {
      console.error(error.response?.data || error.message)
      alert('Failed to increase quantity')
    }
  }

  const handleDecrease = async (item) => {
    if (item.quantity === 1) {
      return handleRemove(item.id)
    }

    try {
      await updateCartItem(item.id, item.quantity - 1)
      fetchCart()
    } catch (error) {
      console.error(error.response?.data || error.message)
      alert('Failed to decrease quantity')
    }
  }

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId)
      fetchCart()
    } catch (error) {
      console.error(error.response?.data || error.message)
      alert('Failed to remove item')
    }
  }

  const handleCheckout = async () => {
    try {
      setLoading(true)

      await checkout()

      alert('Order placed successfully!')

      navigate('/orders')
    } catch (error) {
      console.error(error.response?.data || error.message)
      alert('Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.quantity * Number(item.unit_price),
    0
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100 px-4 py-6">
      <div className="mx-auto max-w-5xl">

        <header className="mb-8 rounded-3xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="mt-2 text-slate-500">
            Review your selected items.
          </p>
        </header>

        {cartItems.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow">
            <h2 className="text-2xl font-semibold">
              Your cart is empty
            </h2>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => {
                const subtotal =
                  item.quantity * Number(item.unit_price)

                const itemName =
                  item.service_type === 'canteen'
                    ? item.menu_item?.name
                    : item.product?.name

                return (
                  <div
                    key={item.id}
                    className="rounded-3xl bg-white p-6 shadow"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">
                        {itemName}
                      </h2>

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 capitalize">
                        {item.service_type}
                      </span>
                    </div>

                    <p className="mt-3">
                      Quantity : {item.quantity}
                    </p>

                    <p>
                      Unit Price : ₹{Number(item.unit_price).toFixed(2)}
                    </p>

                    <p className="font-semibold">
                      Subtotal : ₹{subtotal.toFixed(2)}
                    </p>

                    <div className="mt-5 flex gap-3">

                      <button
                        onClick={() => handleIncrease(item)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                      >
                        +
                      </button>

                      <button
                        onClick={() => handleDecrease(item)}
                        className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                      >
                        -
                      </button>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                      >
                        Remove
                      </button>

                    </div>

                  </div>
                )
              })}
            </div>

            <div className="mt-8 rounded-3xl bg-white p-6 shadow">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Total Price
                  </p>

                  <p className="text-3xl font-bold">
                    ₹{totalPrice.toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Placing Order...' : 'Checkout'}
                </button>

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CartPage