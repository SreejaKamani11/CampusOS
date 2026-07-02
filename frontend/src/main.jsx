import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>

      <App />

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />

    </AuthProvider>
  </StrictMode>,
)