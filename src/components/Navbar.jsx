import React from 'react'

export default function Navbar({ onGetStarted }) {
  return (
    <header className="w-full sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/50 bg-white/70 border-b border-white/40">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-400 to-teal-400 shadow-inner"></div>
          <span className="text-xl font-extrabold tracking-tight text-slate-800">PixFlow</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-slate-700">
          <a href="#about" className="hover:text-slate-900 transition-colors">About</a>
          <a href="#contact" className="hover:text-slate-900 transition-colors">Contact</a>
          <a href="/admin/login" className="hover:text-slate-900 transition-colors">Admin</a>
          <button onClick={onGetStarted} className="ml-2 rounded-full px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-teal-400 shadow-lg shadow-sky-200/60 hover:from-sky-600 hover:to-teal-500 transition-all">
            Get Started
          </button>
        </div>
        <div className="sm:hidden flex items-center gap-2">
          <a href="/admin/login" className="text-slate-700">Admin</a>
          <a href="#contact" className="rounded-full px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-teal-400 shadow-lg hover:from-sky-600 hover:to-teal-500 transition-all">Get Started</a>
        </div>
      </nav>
    </header>
  )
}
