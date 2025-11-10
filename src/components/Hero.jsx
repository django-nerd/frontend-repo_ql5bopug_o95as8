import React from 'react'
import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/xzUirwcZB9SOxUWt/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/60 backdrop-blur border border-white/50 shadow-sm">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-400 to-teal-400 shadow-inner"></div>
          <span className="text-lg font-extrabold tracking-tight text-slate-800">PixFlow</span>
        </div>

        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 drop-shadow-sm">
          Photos that live for 15 days
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-700 max-w-2xl mx-auto">
          Event photos are available to view and download for 15 days from the day they were taken.
        </p>

        <div className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white/80 backdrop-blur border border-white/60 px-5 py-4 shadow-xl">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <p className="text-slate-800 font-semibold">
            Time remaining: <span id="hero-countdown" className="text-sky-600">Loading…</span>
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/60" />
    </section>
  )
}
