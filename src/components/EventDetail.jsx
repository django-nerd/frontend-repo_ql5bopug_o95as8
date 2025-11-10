import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Instagram, Facebook } from 'lucide-react'

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

function useInView() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      })
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function PhotoTile({ src, alt }) {
  const { ref, visible } = useInView()
  return (
    <div ref={ref} className={`relative overflow-hidden rounded-2xl bg-white/70 border border-white/60 shadow transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
      <img loading="lazy" src={src} alt={alt} className="w-full h-44 sm:h-52 md:h-56 object-cover select-none" />
      {/* Watermark (logo block) */}
      <div className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1 text-[10px] font-semibold text-slate-700/70">
        <div className="h-3.5 w-3.5 rounded-sm bg-gradient-to-br from-sky-400 to-teal-400 opacity-70" />
        <span className="bg-white/60 backdrop-blur px-1.5 py-0.5 rounded">PixFlow</span>
      </div>
      {/* Hover/Tap actions */}
      <div className="absolute inset-0 flex flex-col items-end justify-end gap-1 p-3 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <div className="w-full flex items-center justify-between gap-2">
          <a href={src} target="_blank" rel="noreferrer" className="hidden sm:inline-flex rounded-full px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-teal-400 shadow-lg hover:brightness-110 transition-all">View full size</a>
          <a href={src} download className="inline-flex rounded-full px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-teal-400 shadow-lg hover:brightness-110 transition-all">Download</a>
        </div>
        <span className="w-full text-[10px] text-slate-500">Buy high-resolution version – $2 (Coming Soon)</span>
      </div>
    </div>
  )
}

export default function EventDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()

  // Demo event data (would come from backend later)
  const eventData = useMemo(() => {
    const map = {
      'halloween-party-2023': {
        title: 'Halloween Party 2023',
        date: 'October 31, 2023',
        location: 'Downtown Hall, NYC',
        cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
      },
      'labor-day-party': {
        title: 'Labor Day Party',
        date: 'August 10, 2023',
        location: 'City Park',
        cover: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop',
      },
    }
    return map[slug] || null
  }, [slug])

  // 15-day expiry demo
  const expiry = useMemo(() => Date.now() + 1000*60*60*24*15, [])
  const countdown = useCountdown(expiry)

  const photos = useMemo(() => {
    // 24 sample images
    return Array.from({ length: 24 }, (_, i) => `https://picsum.photos/seed/${slug || 'pixflow'}-${i}/1200/800`)
  }, [slug])

  useEffect(() => {
    if (!eventData) {
      // Fallback back to home if slug unknown
      navigate('/')
    }
  }, [eventData, navigate])

  if (!eventData) return null

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,rgba(186,230,253,0.5),rgba(191,219,254,0.6)_30%,rgba(224,242,254,0.7)_60%,white)] text-slate-800">
      {/* Minimal Nav */}
      <header className="w-full sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/50 bg-white/70 border-b border-white/40">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-400 to-teal-400 shadow-inner"></div>
            <span className="text-xl font-extrabold tracking-tight text-slate-800">PixFlow</span>
          </Link>
          <div className="hidden sm:flex items-center gap-6 text-slate-700">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <a href="#contact" className="hover:text-slate-900 transition-colors">Contact</a>
            <a href="#about" className="hover:text-slate-900 transition-colors">About</a>
          </div>
        </nav>
      </header>

      {/* Header info */}
      <section className="max-w-6xl mx-auto px-6 mt-8 text-center">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">{eventData.title}</h1>
        <p className="mt-2 text-slate-600">{eventData.date} • {eventData.location}</p>
        <div className="mt-5 inline-flex items-center gap-3 rounded-2xl bg-white/90 backdrop-blur border border-white/70 px-5 py-4 shadow-xl md:static sticky top-16 z-20">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <p className="text-slate-800 font-semibold">
            {countdown.days}d {countdown.hours}h {countdown.minutes}m remaining to download these photos
          </p>
        </div>
      </section>

      {/* Cover */}
      <section className="max-w-6xl mx-auto px-6 mt-8">
        <div className="relative overflow-hidden rounded-3xl bg-white/70 border border-white/60 shadow-[10px_10px_30px_rgba(30,64,175,0.08),-10px_-10px_30px_rgba(56,189,248,0.08)]">
          <img src={eventData.cover} alt={`${eventData.title} cover`} className="w-full h-[260px] sm:h-[360px] md:h-[440px] object-cover" />
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-6xl mx-auto px-6 mt-10" id="gallery">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((src, i) => (
            <div key={i} className="group">
              <PhotoTile src={src} alt={`${eventData.title} ${i+1}`} />
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-3xl mx-auto px-6 mt-16">
        <div className="rounded-3xl bg-white/80 backdrop-blur border border-white/60 p-6 shadow-[10px_10px_30px_rgba(30,64,175,0.08),-10px_-10px_30px_rgba(56,189,248,0.08)]">
          <h3 className="text-xl font-bold text-slate-800">Didn’t find your photo?</h3>
          <p className="mt-1 text-slate-600">Send me a message with your name and event details.</p>
          <form className="mt-6 grid grid-cols-1 gap-4" onSubmit={(e)=>{e.preventDefault(); alert('Message sent! (simulated)')}}>
            <input required type="text" placeholder="Name" className="w-full rounded-xl px-4 py-3 bg-white/70 border border-white/60 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300" />
            <input required type="email" placeholder="Email" className="w-full rounded-xl px-4 py-3 bg-white/70 border border-white/60 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300" />
            <textarea required rows="4" placeholder="Message" className="w-full rounded-xl px-4 py-3 bg-white/70 border border-white/60 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300" />
            <button type="submit" className="rounded-full px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-teal-400 shadow-lg hover:brightness-110 transition-all">Submit</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 mt-14 mb-12 text-slate-600">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm">PixFlow — Photos that live for 15 days.</p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Instagram" className="p-2 rounded-full bg-white/70 border border-white/60 hover:bg-white transition-colors"><Instagram size={16} /></a>
            <a href="#" aria-label="Facebook" className="p-2 rounded-full bg-white/70 border border-white/60 hover:bg-white transition-colors"><Facebook size={16} /></a>
            <span className="text-xs">© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
