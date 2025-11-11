import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [adminCreated, setAdminCreated] = useState(null) // null=loading, boolean afterwards
  const [token, setToken] = useState(null)

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/admin/status`)
        const data = await res.json()
        setAdminCreated(Boolean(data?.admin_created))
      } catch (e) {
        setAdminCreated(true) // fallback to login mode if API unreachable
      }
    }
    check()
  }, [])

  const value = { adminCreated, setAdminCreated, token, setToken }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
