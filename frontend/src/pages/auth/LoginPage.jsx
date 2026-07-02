import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { login as authLogin } from '../../services/auth.service'
import { useAuth } from '../../context/AuthContext'
import { toast } from "react-toastify";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()
  const { login } = useAuth()

  const onSubmit = async (data) => {
    try {
      const response = await authLogin(data.email, data.password)
      login(response.data.user, response.data.accessToken)

if (response.data.user.role === "admin") {
  navigate("/admin")
} else {
  navigate("/dashboard")
}

    } catch (error) {
      toast.error(error.response?.data || error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white/85 shadow-[0_24px_80px_rgba(15,23,42,0.14)] ring-1 ring-blue-100 backdrop-blur md:grid-cols-2">
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-10 text-white md:flex md:flex-col md:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.24),_transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.18),_transparent_38%)]" />
            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-100/90">CampusOS</p>
              <h1 className="mt-4 max-w-sm text-4xl font-semibold leading-tight">
                Smart tools for a connected campus experience.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-blue-50/90">
                Access canteen services, orders, stationery, and printout workflows from one place.
              </p>
            </div>
            <div className="relative grid gap-3 text-sm text-blue-50/90">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                Fast campus operations
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                Clean, modern student and staff access
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-md">
              <div className="mb-8 text-center md:text-left">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">CampusOS</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">CampusOS</h2>
                <p className="mt-2 text-sm text-slate-500">Smart Campus Platform</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...register('email')}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="flex items-stretch overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      {...register('password')}
                      className="min-w-0 flex-1 bg-transparent px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="border-l border-slate-200 px-4 text-sm font-medium text-blue-600 transition hover:bg-blue-50 hover:text-blue-700"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <a
                    href="#"
                    className="text-sm font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.99]"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage