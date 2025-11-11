import React, { useEffect, useState } from 'react'
import { useAuth } from './AuthProvider'

const Card = ({ children }) => (
  <div className="w-full max-w-md rounded-2xl bg-white/80 backdrop-blur border border-white/60 p-6 shadow-[10px_10px_30px_rgba(30,64,175,0.08),-10px_-10px_30px_rgba(56,189,248,0.08)]">
    {children}
  </div>
)

function TextInput({ type = 'text', placeholder, value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl px-4 py-3 bg-white/70 border border-white/60 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300"
      required
    />
  )
}

export function AdminLogin() {
  const { adminCreated, setToken } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => {
    // If admin already exists, briefly show an info message
    if (adminCreated === true) {
      setShowInfo(true)
      const t = setTimeout(() => setShowInfo(false), 3000)
      return () => clearTimeout(t)
    }
  }, [adminCreated])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      if (!res.ok) throw new Error('Invalid credentials')
      const data = await res.json()
      setToken(data.token)
      window.location.href = '/admin'
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  if (adminCreated === false) return null // Registration form will render instead

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-400 to-teal-400 shadow-inner" />
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">PixFlow</h2>
            <p className="text-slate-500 text-sm">Administrator Access Portal</p>
          </div>
        </div>

        {showInfo && (
          <div className="mb-3 text-sm text-slate-700 bg-sky-50 border border-sky-200 rounded-xl p-3">
            An administrator account already exists. Please log in instead.
          </div>
        )}

        <form onSubmit={submit} className="grid gap-3">
          <TextInput placeholder="Username" value={username} onChange={setUsername} />
          <TextInput type="password" placeholder="Password" value={password} onChange={setPassword} />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="mt-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-teal-400 shadow-lg hover:brightness-110 transition-all">Login</button>
          <p className="text-xs text-center text-slate-500">Forgot password? (inactive)</p>
        </form>
      </Card>
    </div>
  )
}

export function AdminRegisterInline() {
  const { setAdminCreated } = useAuth()
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    if (!fullName || !username || !email || !password || !confirm) return setError('Please fill all fields')
    if (password !== confirm) return setError('Passwords do not match')
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/admin/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, username, email, password })
      })
      if (!res.ok) {
        let msg = 'Registration failed.'
        try { const d = await res.json(); msg = d.detail || msg } catch {}
        throw new Error(msg)
      }
      // Success: mark created and send to login page
      setAdminCreated(true)
      setInfo('Account created successfully. Redirecting to login…')
      setTimeout(() => { window.location.href = '/admin/login' }, 800)
    } catch (err) {
      setError(err.message || 'Registration failed. This may be disabled or already completed.')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-400 to-teal-400 shadow-inner" />
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">PixFlow</h2>
            <p className="text-slate-500 text-sm">Create Admin Account</p>
          </div>
        </div>
        <form onSubmit={submit} className="grid gap-3">
          <TextInput placeholder="Full Name" value={fullName} onChange={setFullName} />
          <TextInput placeholder="Username" value={username} onChange={setUsername} />
          <TextInput type="email" placeholder="Email" value={email} onChange={setEmail} />
          <TextInput type="password" placeholder="Password" value={password} onChange={setPassword} />
          <TextInput type="password" placeholder="Confirm Password" value={confirm} onChange={setConfirm} />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {info && <div className="text-slate-700 text-sm bg-sky-50 border border-sky-200 rounded-xl p-3">{info}</div>}
          <div className="flex items-center gap-2 mt-2">
            <button className="rounded-full px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-teal-400 shadow-lg hover:brightness-110 transition-all">Create Account</button>
          </div>
        </form>
        <p className="mt-4 text-xs text-slate-500 text-center">PixFlow © 2025 — Secure Admin Setup.</p>
      </Card>
    </div>
  )
}
