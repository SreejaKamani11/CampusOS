import { useNavigate } from 'react-router-dom'
import { useAuth } from "../../context/AuthContext";

function DashboardPage() {
  const navigate = useNavigate()
const { user, logout } = useAuth()
  const handleNavigation = (title) => {
    switch (title) {
      case 'Stationery':
        navigate('/stationery')
        break

      case 'Canteen':
        navigate('/canteen')
        break

      case 'Printout':
        navigate('/printout')
        break

      case 'Cart':
        navigate('/cart')
        break

      case 'Orders':
        navigate('/orders')
        break
      case "Profile":
        navigate("/profile")
        break

      default:
        break
    }
  }

  const cards = [
    {
      icon: '📚',
      title: 'Stationery',
      description: 'Browse and order stationery essentials.',
    },
    {
      icon: '🍔',
      title: 'Canteen',
      description: 'Browse fresh food and beverages.',
    },
    {
      icon: '🖨️',
      title: 'Printout',
      description: 'Upload documents and request printouts.',
    },
    {
      icon: '🛒',
      title: 'Cart',
      description: 'View and manage your shopping cart.',
    },
    {
      icon: '📦',
      title: 'Orders',
      description: 'Track all your placed orders.',
    },
    {
  icon: "👤",
  title: "Profile",
  description: "View your account information.",
}
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100 px-4 py-6">
      <div className="mx-auto max-w-7xl">

        <header className="mb-8 rounded-3xl bg-white p-8 shadow flex justify-between items-center">

  <div>

    <h1 className="text-4xl font-bold text-slate-800">
      Welcome, {user?.name} 👋
    </h1>

    <p className="mt-2 text-slate-500 text-lg">
      Smart Campus Platform
    </p>

    <div className="mt-4 flex gap-6 text-sm text-slate-600">

      <span>
        <strong>Campus ID:</strong> {user?.campus_id}
      </span>

      <span>
        <strong>Role:</strong> {user?.role}
      </span>

    </div>

  </div>

  <button
    onClick={() => {
      logout()
      navigate("/")
    }}
    className="rounded-xl bg-red-600 px-5 py-3 text-white hover:bg-red-700"
  >
    Logout
  </button>

</header>
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <button
              key={card.title}
              onClick={() => handleNavigation(card.title)}
              className="group rounded-3xl bg-white p-8 text-left shadow transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="text-6xl transition-transform duration-300 group-hover:scale-110">
                {card.icon}
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-800">
                {card.title}
              </h2>

              <p className="mt-3 text-slate-500">
                {card.description}
              </p>
            </button>
          ))}
        </section>

      </div>
    </div>
  )
}

export default DashboardPage