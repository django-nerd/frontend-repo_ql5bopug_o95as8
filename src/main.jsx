import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import Test from './Test'
import EventDetail from './components/EventDetail'
import { AuthProvider, useAuth } from './components/AuthProvider'
import { AdminLogin, AdminRegisterInline, ResetPasswordRequest, NewPasswordPage } from './components/AdminAuth'
import './index.css'

function AdminLayout() {
  const { isAuthed } = useAuth()
  if (!isAuthed) return <Navigate to="/admin/login" replace />
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,rgba(186,230,253,0.5),rgba(191,219,254,0.6)_30%,rgba(224,242,254,0.7)_60%,white)] text-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-400 to-teal-400 shadow-inner"></div>
            <span className="text-xl font-extrabold tracking-tight text-slate-800">PixFlow • Admin</span>
          </div>
          <a href="/" className="text-slate-600 hover:text-slate-900">Public Site</a>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <div className="rounded-3xl bg-white/80 backdrop-blur border border-white/60 p-6 shadow">
            <h3 className="font-bold mb-2">Upload</h3>
            <p className="text-sm text-slate-600">Upload new event photos.</p>
          </div>
          <div className="rounded-3xl bg-white/80 backdrop-blur border border-white/60 p-6 shadow">
            <h3 className="font-bold mb-2">Settings</h3>
            <p className="text-sm text-slate-600">Manage site title, theme, links.</p>
          </div>
          <AdminSubscribersCard />
        </div>
        <footer className="mt-10 text-sm text-slate-600">PixFlow © 2025 — Secure Access.</footer>
      </div>
    </div>
  )
}

function AdminSubscribersCard() {
  const { token } = useAuth()
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/subscribers`, { headers: { Authorization: `Bearer ${token}` }})
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        setItems(data.items || [])
      } catch (e) {
        setError('Could not load subscribers')
      } finally {
        setLoading(false)
      }
    }
    if (token) load()
  }, [token])
  return (
    <div className="rounded-3xl bg-white/80 backdrop-blur border border-white/60 p-6 shadow">
      <h3 className="font-bold mb-2">Subscribers</h3>
      {loading ? <p className="text-sm text-slate-600">Loading…</p> : error ? <p className="text-sm text-red-600">{error}</p> : (
        <ul className="text-sm text-slate-700 space-y-1">
          {items.length === 0 && <li className="text-slate-500">No subscribers yet.</li>}
          {items.map((s) => (
            <li key={s.id}>{s.name || 'Anonymous'} — {s.email}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

function AdminAuthRouter() {
  const { adminCreated } = useAuth()
  if (adminCreated === null) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,rgba(186,230,253,0.5),rgba(191,219,254,0.6)_30%,rgba(224,242,254,0.7)_60%,white)] flex items-center justify-center text-slate-700">
        Loading…
      </div>
    )
  }
  // If no admin exists -> show full registration page
  if (adminCreated === false) {
    return <AdminRegisterInline />
  }
  // Else show normal login page
  return <AdminLogin />
}

function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,rgba(186,230,253,0.5),rgba(191,219,254,0.6)_30%,rgba(224,242,254,0.7)_60%,white)] text-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        <AdminAuthRouter />
      </div>
    </div>
  )
}

function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,rgba(186,230,253,0.5),rgba(191,219,254,0.6)_30%,rgba(224,242,254,0.7)_60%,white)] text-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        <ResetPasswordRequest />
      </div>
    </div>
  )
}

function NewPasswordRoute() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,rgba(186,230,253,0.5),rgba(191,219,254,0.6)_30%,rgba(224,242,254,0.7)_60%,white)] text-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        <NewPasswordPage />
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/test" element={<Test />} />
          <Route path="/event/:slug" element={<EventDetail />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/new-password" element={<NewPasswordRoute />} />
          <Route path="/admin" element={<AdminLayout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)
