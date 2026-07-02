import { useEffect, useState } from 'react'
import { getMenu, addToCart } from '../../services/canteen.service'
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";

function CanteenPage() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await getMenu()
        setMenuItems(response.data || [])
      } catch (error) {
        console.error(error.response?.data || error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [])

  const handleAddToCart = async (menuItemId) => {
    try {
      const response = await addToCart(menuItemId)

      toast.success('Food added to cart')
    } catch (error) {
      toast.error('Failed to add food')
    }
  }

  if (loading) {
  return <Loading />;
}
if (menuItems.length === 0) {
  return <EmptyState title="No Menu Items Available" />;
}
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-4xl font-bold">
          Campus Canteen
        </h1>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-white p-6 shadow"
            >
              <h2 className="text-2xl font-semibold">
                {item.name}
              </h2>

              <p className="mt-3 text-slate-500">
                {item.description}
              </p>

              <p className="mt-4 text-2xl font-bold">
                ₹{Number(item.price).toFixed(2)}
              </p>

              <button
                onClick={() => handleAddToCart(item.id)}
                className="mt-6 w-full rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
              >
                Order Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CanteenPage