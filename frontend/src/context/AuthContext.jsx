import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AUTH_STORAGE_KEY = 'campusos_auth'

export const AuthContext = createContext(null)

function readStoredAuth() {
  if (typeof window === 'undefined') {
    return { user: null, accessToken: null }
  }

  try {
    const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY)
    if (!storedValue) {
      return { user: null, accessToken: null }
    }

    const parsedValue = JSON.parse(storedValue)

    return {
      user: parsedValue.user ?? null,
      accessToken: parsedValue.accessToken ?? null,
    }
  } catch {
    return { user: null, accessToken: null }
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredAuth().user)
  const [accessToken, setAccessToken] = useState(() => readStoredAuth().accessToken)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (user && accessToken) {
      window.localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ user, accessToken }),
      )
      return
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY)
  }, [user, accessToken])

  const login = (nextUser, nextAccessToken) => {
    setUser(nextUser)
    setAccessToken(nextAccessToken)
  }

  const logout = () => {
    setUser(null)
    setAccessToken(null)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }

  const value = useMemo(
    () => ({
      user,
      accessToken,
      login,
      logout,
    }),
    [user, accessToken],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}