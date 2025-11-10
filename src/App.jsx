import React, { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import EventCard from './components/EventCard'
import Gallery from './components/Gallery'
import Contact from './components/Contact'

function useCountdown(targetDate) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  return useMemo(() => {
    const diff = Math.max(0, targetDate - now)
    const days = Math.floor(diff / (1000*60*60*24))
    const hours = Math.floor((diff % (1000*60*60*24))/(1000*60*60))
    const minutes = Math.floor((diff % (1000*60*60))/(1000*60))
    return { days, hours, minutes }
  }, [now, targetDate])
}

function App() {
  const event1End = useMemo(() => new Date().getTime() + 1000*60*60*24*7 + 1000*60*33, [])
  const event2End = useMemo(() => new Date().getTime() + 1000*60*60*24*12 + 1000*60*12, [])
  const heroCountdown = useCountdown(event1End)

  const scrollToContact = () => {
    const el = document.getElementById('contact')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,rgba(186,230,253,0.5),rgba(191,219,254,0.6)_30%,rgba(224,242,254,0.7)_60%,white)] text-slate-800">
      <Navbar onGetStarted={scrollToContact} />

      <Hero />

      <section className="-mt-10 relative z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-white/90 backdrop-blur border border-white/70 px-5 py-4 shadow-xl">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <p className="text-slate-800 font-semibold">
                Time remaining: <span className="text-sky-600">{heroCountdown.days}d {heroCountdown.hours}h {heroCountdown.minutes}m</span>
              </p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <EventCard title="Halloween Party 2023" date="October 31" imageUrl="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop" slug="halloween-party-2023" />
            <EventCard title="Labor Day Party" date="August 10" imageUrl="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1400&auto=format&fit=crop" slug="labor-day-party" />
          </div>
        </div>
      </section>

      <Gallery />

      <section id="about" className="max-w-6xl mx-auto px-6 mt-16">
        <div className="rounded-3xl bg-white/80 backdrop-blur border border-white/60 p-6 shadow-[10px_10px_30px_rgba(30,64,175,0.08),-10px_-10px_30px_rgba(56,189,248,0.08)]">
          <h2 className="text-2xl font-bold mb-2">About PixFlow</h2>
          <p className="text-slate-600">PixFlow lets visitors browse and download event photos that remain available for 15 days. Each event shows a live countdown so you know how long photos are available. Elegant, soft, and intuitive by design.</p>
        </div>
      </section>

      <Contact />

      <footer className="max-w-6xl mx-auto px-6 mt-12 mb-10">
        <p className="text-sm text-slate-600">Photo watermark appears automatically in the bottom-right corner. Advertising options will be available later.</p>
      </footer>
    </div>
  )
}

export default App
