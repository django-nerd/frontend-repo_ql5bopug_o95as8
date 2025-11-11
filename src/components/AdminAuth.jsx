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

  useEffect(() => {
    // Auto-open registration if no admin exists yet
    if (adminCreated === false) {
      const dlg = document.getElementById('admin-register')
      if (dlg && typeof dlg.showModal === 'function') dlg.showModal()
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

        <form onSubmit={submit} className="grid gap-3">
          <TextInput placeholder="Username" value={username} onChange={setUsername} />
          <TextInput type="password" placeholder="Password" value={password} onChange={setPassword} />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="mt-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-teal-400 shadow-lg hover:brightness-110 transition-all">Login</button>
          {adminCreated === false && (
            <a href="#" onClick={(e)=>{e.preventDefault(); document.getElementById('admin-register')?.showModal()}} className="text-slate-700 text-sm text-center hover:text-slate-900">Iscriviti / Create Admin Account</a>
          )}
          <p className="text-xs text-center text-slate-500">Forgot password? (inactive)</p>
        </form>
      </Card>
    </div>
  )
}

export function AdminRegisterModal() {
  const { setAdminCreated, setToken } = useAuth()
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!fullName || !username || !email || !password || !confirm) return setError('Please fill all fields')
    if (password !== confirm) return setError('Passwords do not match')
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/admin/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, username, email, password })
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setAdminCreated(true)
      setToken(data.token)
      document.getElementById('admin-register')?.close()
      window.location.href = '/admin'
    } catch (err) {
      setError('Registration failed. This may be disabled or already completed.')
    }
  }

  return (
    <dialog id="admin-register" className="modal">
      <div className="min-h-screen fixed inset-0 flex items-center justify-center bg-black/30 p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white/90 backdrop-blur border border-white/60 p-6 shadow-[10px_10px_30px_rgba(30,64,175,0.10),-10px_-10px_30px_rgba(56,189,248,0.10)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-400 to-teal-400 shadow-inner" />
            <div>
              <h2 className="text-xl font-extrabold text-slate-800">PixFlow</h2>
              <p className="text-slate-500 text-sm">Administrator Registration Portal</p>
            </div>
          </div>
          <form onSubmit={submit} className="grid gap-3">
            <TextInput placeholder="Full Name" value={fullName} onChange={setFullName} />
            <TextInput placeholder="Username" value={username} onChange={setUsername} />
            <TextInput type="email" placeholder="Email" value={email} onChange={setEmail} />
            <TextInput type="password" placeholder="Password" value={password} onChange={setPassword} />
            <TextInput type="password" placeholder="Confirm Password" value={confirm} onChange={setConfirm} />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div className="flex items-center gap-2 mt-2">
              <button className="rounded-full px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-teal-400 shadow-lg hover:brightness-110 transition-all">Create Account</button>
              <button type="button" onClick={()=>document.getElementById('admin-register')?.close()} className="rounded-full px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white/70 border border-white/60 hover:bg-white transition-all">Cancel</button>
            </div>
          </form>
          <p className="mt-4 text-xs text-slate-500 text-center">PixFlow © 2025 — Secure Admin Setup.</p>
        </div>
      </div>
    </dialog>
  )
}
