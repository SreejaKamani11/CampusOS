import { useEffect, useState } from 'react'
import { getProducts } from '../../services/stationery.service'
import { addToCart } from '../../services/cart.service'
function StationeryPage() {
  const [products, setProducts] = useState([])
const handleAddToCart = async (productId) => {
  try {
    const response = await addToCart(productId, 1)

    console.log(response)

    alert("Added to Cart")
  } catch (error) {
    console.error(error.response?.data || error.message)

    alert("Failed to add item to cart")
  }
}
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getProducts()
      console.log(response)
      setProducts(response?.data ?? response ?? [])
    }

    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-3xl border border-blue-100 bg-white/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">CampusOS</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Stationery Store
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Browse and order stationery products
          </p>
        </header>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-blue-100 bg-white/90 shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(37,99,235,0.18)]"
            >
              <div className="flex h-48 items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100 text-sm font-semibold uppercase tracking-[0.3em] text-blue-500">
                Product Image
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-900">{product.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{product.description}</p>
                </div>

                <div className="mt-5 space-y-2 text-sm text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-900">Price:</span> {product.price}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Stock:</span> {product.stock}
                  </p>
                </div>

               <button
  onClick={() => handleAddToCart(product.id)}
  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
>
  Add to Cart
</button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}

export default StationeryPage
