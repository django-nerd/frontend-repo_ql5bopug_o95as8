import React, { useEffect, useState } from 'react'
import { useAuth } from './AuthProvider'

// Shared celebratory styles
const gradientMain = 'from-[#FF6B6B] via-[#FFD56B] to-[#48CFCB]'
const btnGradient = 'bg-gradient-to-r from-[#FF6B6B] via-[#FFD56B] to-[#48CFCB]'

const AuthShell = ({ children, title = 'PixFlow • Secure Admin', subtitle = 'Joyful control for your event photos' }) => (
  <div className="min-h-screen relative flex items-center justify-center px-6 py-10 text-white">
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1528605105345-5344ea20e269?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
      <div className="absolute inset-0 backdrop-blur-[6px] bg-black/30"></div>
      <div className={`absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br ${gradientMain} opacity-40 blur-3xl rounded-full`}></div>
      <div className={`absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-br ${gradientMain} opacity-30 blur-3xl rounded-full`}></div>
    </div>

    <div className="w-full max-w-xl">
      <div className="flex flex-col items-center text-center mb-6">
        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${gradientMain} shadow-xl shadow-white/10`} />
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] font-poppins">{title}</h1>
        <p className="mt-1 text-white/90 font-nunito">{subtitle}</p>
      </div>
      <div className="w-full rounded-3xl bg-white/15 border border-white/30 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] p-6">
        {children}
      </div>
      <p className="mt-6 text-center text-sm text-white/80">PixFlow © 2025 — Secure Admin Access.</p>
    </div>
  </div>
)

const Field = ({ children }) => (
  <div className="relative">
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
      className="w-full rounded-xl px-4 py-3 bg-white/80 text-slate-800 placeholder-slate-500 border border-white/60 shadow-inner focus:outline-none focus:ring-4 focus:ring-[#FFD56B]/40"
      required
    />
  )
}

export function AdminLogin() {
  const { adminCreated, setToken } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

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

  if (adminCreated === false) {
    return (
      <AuthShell title="PixFlow • Admin Login">
        <div className="text-center text-white/90">
          <p className="mb-2">An admin account has not been created yet.</p>
          <a href="/admin-register" className={`inline-flex items-center justify-center rounded-full px-5 py-2 font-semibold text-slate-900 ${btnGradient} shadow-lg hover:scale-[1.01] transition-transform`}>
            Create Admin Account
          </a>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="PixFlow • Admin Login">
      <form onSubmit={submit} className="grid gap-3">
        <Field>
          <TextInput placeholder="Username" value={username} onChange={setUsername} />
        </Field>
        <Field>
          <TextInput type="password" placeholder="Password" value={password} onChange={setPassword} />
        </Field>
        {error && <div className="text-red-200 text-sm">{error}</div>}
        <button className={`mt-1 rounded-full px-4 py-2.5 text-sm font-semibold text-slate-900 ${btnGradient} shadow-lg shadow-black/20 hover:shadow-black/30 hover:brightness-[1.02] transition-all`}>
          Login
        </button>
        <a href="/reset-password" className="text-xs text-white/90 hover:text-white">Forgot password?</a>
      </form>
    </AuthShell>
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
      setAdminCreated(true)
      setInfo('Account created successfully! Redirecting to login…')
      setTimeout(() => { window.location.href = '/admin-login' }, 900)
    } catch (err) {
      setError(err.message || 'Registration failed. This may be disabled or already completed.')
    }
  }

  return (
    <AuthShell title="Create Admin Account" subtitle="First-time setup">
      <form onSubmit={submit} className="grid gap-3">
        <TextInput placeholder="Full Name" value={fullName} onChange={setFullName} />
        <TextInput placeholder="Username" value={username} onChange={setUsername} />
        <TextInput type="email" placeholder="Email" value={email} onChange={setEmail} />
        <TextInput type="password" placeholder="Password" value={password} onChange={setPassword} />
        <TextInput type="password" placeholder="Confirm Password" value={confirm} onChange={setConfirm} />
        {error && <div className="text-red-200 text-sm">{error}</div>}
        {info && <div className="text-emerald-100 text-sm">{info}</div>}
        <div className="flex items-center gap-2 mt-1">
          <button className={`rounded-full px-4 py-2.5 text-sm font-semibold text-slate-900 ${btnGradient} shadow-lg shadow-black/20 hover:shadow-black/30 hover:brightness-[1.02] transition-all`}>Create Account</button>
          <a href="/admin-login" className="text-xs text-white/90 hover:text-white">I already have an account</a>
        </div>
      </form>
    </AuthShell>
  )
}

export function ResetPasswordRequest() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      if (!res.ok) {
        let msg = 'No account found with this email.'
        try { const d = await res.json(); msg = d.detail || msg } catch {}
        throw new Error(msg)
      }
      setInfo('If the email exists, a reset link has been sent. Please check your inbox.')
    } catch (err) {
      setError(err.message || 'No account found with this email.')
    }
  }

  return (
    <AuthShell title="Password Reset" subtitle="We\'ll email you a link valid for 15 minutes">
      <form onSubmit={submit} className="grid gap-3">
        <TextInput type="email" placeholder="Email" value={email} onChange={setEmail} />
        {error && <div className="text-red-200 text-sm">{error}</div>}
        {info && <div className="text-emerald-100 text-sm">{info}</div>}
        <button className={`mt-1 rounded-full px-4 py-2.5 text-sm font-semibold text-slate-900 ${btnGradient} shadow-lg hover:brightness-[1.02] transition-all`}>Send Reset Link</button>
      </form>
      <div className="mt-4 text-center">
        <a href="/admin-login" className="text-xs text-white/90 hover:text-white">Back to Login</a>
      </div>
    </AuthShell>
  )
}

export function NewPasswordPage() {
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [validating, setValidating] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('token') || ''
    setToken(t)
    const verify = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/auth/reset/verify?token=${encodeURIComponent(t)}`)
        const data = await res.json()
        if (!res.ok || !data.valid) throw new Error(data.message || 'Invalid or expired token')
        setValidating(false)
      } catch (e) {
        setError(e.message || 'Invalid or expired token')
        setValidating(false)
      }
    }
    if (t) verify(); else { setError('Invalid or missing token'); setValidating(false) }
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    if (!password || !confirm) return setError('Please fill all fields')
    if (password !== confirm) return setError('Passwords do not match')
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/auth/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: password })
      })
      if (!res.ok) {
        let msg = 'Could not reset password.'
        try { const d = await res.json(); msg = d.detail || msg } catch {}
        throw new Error(msg)
      }
      setInfo('Password successfully reset. Redirecting to login…')
      setTimeout(() => { window.location.href = '/admin-login' }, 1200)
    } catch (err) {
      setError(err.message || 'Could not reset password')
    }
  }

  return (
    <AuthShell title="Set New Password" subtitle="Enter and confirm your new password">
      {validating ? (
        <p className="text-white/90">Validating link…</p>
      ) : (
        <form onSubmit={submit} className="grid gap-3">
          <TextInput type="password" placeholder="New Password" value={password} onChange={setPassword} />
          <TextInput type="password" placeholder="Confirm Password" value={confirm} onChange={setConfirm} />
          {error && <div className="text-red-200 text-sm">{error}</div>}
          {info && <div className="text-emerald-100 text-sm">{info}</div>}
          <button disabled={!!error} className={`mt-1 rounded-full px-4 py-2.5 text-sm font-semibold text-slate-900 ${btnGradient} shadow-lg hover:brightness-[1.02] transition-all`}>Save New Password</button>
        </form>
      )}
    </AuthShell>
  )
}

// Dedicated pages aligning with routes from the prompt
export function AdminRegisterPage() {
  const { adminCreated } = useAuth()
  const [messageShown, setMessageShown] = useState(false)
  useEffect(() => {
    if (adminCreated === true) {
      setMessageShown(true)
      const t = setTimeout(() => { window.location.href = '/admin-login' }, 3000)
      return () => clearTimeout(t)
    }
  }, [adminCreated])

  if (adminCreated === true) {
    return (
      <AuthShell title="Create Admin Account">
        <div className="text-center">
          <p className="text-white/90">An admin account already exists. Please log in.</p>
          <p className="text-white/70 text-sm mt-1">Redirecting to login…</p>
        </div>
      </AuthShell>
    )
  }
  if (adminCreated === null) {
    return (
      <AuthShell title="Create Admin Account">
        <p className="text-white/90">Checking setup…</p>
      </AuthShell>
    )
  }
  return <AdminRegisterInline />
}

export function AdminLoginPage() {
  return <AdminLogin />
}
