import React, { useState } from 'react'

export default function Contact() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('Sending...')
    // Placeholder: would POST to backend later
    setTimeout(() => {
      setStatus('Message sent! We will get back to you soon.')
    }, 800)
  }

  return (
    <section id="contact" className="max-w-3xl mx-auto px-6 mt-16">
      <div className="rounded-3xl bg-white/80 backdrop-blur border border-white/60 p-6 shadow-[10px_10px_30px_rgba(30,64,175,0.08),-10px_-10px_30px_rgba(56,189,248,0.08)]">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">Can’t find your photo?</h3>
          <button onClick={() => setOpen(!open)} className="rounded-full px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-teal-400 shadow-lg hover:from-sky-600 hover:to-teal-500 transition-all">
            Send Message
          </button>
        </div>
        {open && (
          <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-4">
            <input required type="text" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="w-full rounded-xl px-4 py-3 bg-white/70 border border-white/60 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300" />
            <input required type="email" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} className="w-full rounded-xl px-4 py-3 bg-white/70 border border-white/60 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300" />
            <textarea required rows="4" placeholder="Message" value={form.message} onChange={(e)=>setForm({...form, message:e.target.value})} className="w-full rounded-xl px-4 py-3 bg-white/70 border border-white/60 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300" />
            <div className="flex items-center gap-3">
              <button type="submit" className="rounded-full px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-teal-400 shadow-lg hover:from-sky-600 hover:to-teal-500 transition-all">Send</button>
              {status && <span className="text-slate-600 text-sm">{status}</span>}
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
