import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [adminCreated, setAdminCreated] = useState(null) // null=loading, boolean afterwards
  const [token, setTokenState] = useState(() => {
    try { return localStorage.getItem('pf_token') } catch { return null }
  })

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

  const setToken = (t) => {
    setTokenState(t)
    try {
      if (t) localStorage.setItem('pf_token', t)
      else localStorage.removeItem('pf_token')
    } catch {}
  }

  const logout = () => setToken(null)

  const value = useMemo(() => ({ adminCreated, setAdminCreated, token, setToken, logout, isAuthed: !!token }), [adminCreated, token])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
