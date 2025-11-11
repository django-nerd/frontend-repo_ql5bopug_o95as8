import React, { useState } from 'react'

const placeholders = Array.from({ length: 12 }, (_, i) => `https://picsum.photos/seed/pixflow-${i}/1200/800`)

export default function Gallery() {
  const [showPopup, setShowPopup] = useState(false)
  const [form, setForm] = useState({ name: '', email: '' })
  const [sent, setSent] = useState(false)

  const download = (src) => {
    // Trigger native download
    const a = document.createElement('a')
    a.href = src
    a.download = 'photo.jpg'
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    a.remove()
    // Offer subscribe popup afterwards
    setTimeout(() => setShowPopup(true), 300)
  }

  const subscribe = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name || undefined, email: form.email })
      })
      if (res.ok) setSent(true)
    } catch {}
  }

  return (
    <section className="max-w-6xl mx-auto px-6 mt-12">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">Once downloaded, photos are yours to use as you wish.</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {placeholders.map((src, idx) => (
          <div key={idx} className="relative overflow-hidden rounded-xl bg-white/70 backdrop-blur border border-white/60 shadow group">
            <img src={src} alt={`Gallery ${idx+1}`} className="w-full h-32 sm:h-36 md:h-40 object-cover transform group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => download(src)} className="mb-2 rounded-full px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-teal-400 shadow-lg">Download</button>
            </div>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={()=>setShowPopup(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white/90 backdrop-blur border border-white/60 p-6 shadow" onClick={(e)=>e.stopPropagation()}>
            {sent ? (
              <div className="text-center">
                <h4 className="text-lg font-bold text-slate-800">Thanks!</h4>
                <p className="text-slate-600 mt-1">Well keep you posted on upcoming events.</p>
                <button onClick={()=>setShowPopup(false)} className="mt-4 rounded-full px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-teal-400">Close</button>
              </div>
            ) : (
              <>
                <h4 className="text-lg font-bold text-slate-800">Want updates for next events?</h4>
                <p className="text-slate-600 text-sm">Leave your name and email (optional name).</p>
                <form onSubmit={subscribe} className="mt-4 grid gap-3">
                  <input type="text" placeholder="Name (optional)" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="w-full rounded-xl px-4 py-3 bg-white/70 border border-white/60 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300" />
                  <input type="email" placeholder="Email" required value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} className="w-full rounded-xl px-4 py-3 bg-white/70 border border-white/60 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300" />
                  <div className="flex items-center gap-2">
                    <button className="rounded-full px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-teal-400">Subscribe</button>
                    <button type="button" onClick={()=>setShowPopup(false)} className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 bg-white/70 border border-white/60">Skip</button>
                  </div>
                </form>
              </>
            )}
            <p className="mt-3 text-xs text-slate-500 text-center">PixFlow © 2025 — Secure Access.</p>
          </div>
        </div>
      )}
    </section>
  )
}
