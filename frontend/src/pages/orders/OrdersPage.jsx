import { useEffect, useState } from 'react'
import api from '../../api/axios'

function OrdersPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await api.get('/orders')

        console.log(response.data)

        setOrders(response.data.data || [])
      } catch (error) {
        console.error(error.response?.data || error.message)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800">My Orders</h1>
          <p className="mt-2 text-slate-500">
            View all your placed orders.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow">
            <h2 className="text-2xl font-semibold">
              No Orders Yet
            </h2>

            <p className="mt-2 text-slate-500">
              Your placed orders will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-3xl bg-white p-6 shadow"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {order.order_number}
                  </h2>

                  <span className="rounded-full bg-blue-100 px-4 py-1 text-blue-700">
                    {order.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <p>
                    <strong>Total :</strong> ₹{order.total}
                  </p>

                  <p>
                    <strong>Items :</strong> {order.item_count}
                  </p>

                  <p>
                    <strong>Service :</strong> {order.service_type}
                  </p>

                  <p>
                    <strong>Created :</strong>{' '}
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage