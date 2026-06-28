import { useNavigate } from 'react-router-dom'

function DashboardPage() {
  const navigate = useNavigate()

  const handleNavigation = (title) => {
    switch (title) {
      case 'Stationery':
        navigate('/stationery')
        break

      case 'Canteen':
        navigate('/canteen')
        break

      case 'Cart':
        navigate('/cart')
        break

      case 'Orders':
        navigate('/orders')
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
      icon: '🖨',
      title: 'Printout',
      description: 'Upload files for printing.',
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
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100 px-4 py-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-3xl bg-white p-6 shadow">
          <h1 className="text-4xl font-bold text-slate-800">
            Welcome to CampusOS
          </h1>

          <p className="mt-3 text-slate-500">
            Choose a service to continue.
          </p>
        </header>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <button
              key={card.title}
              onClick={() => handleNavigation(card.title)}
              className="rounded-3xl bg-white p-6 text-left shadow transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-5xl">{card.icon}</div>

              <h2 className="mt-5 text-2xl font-semibold">
                {card.title}
              </h2>

              <p className="mt-2 text-slate-500">
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