import React from 'react'

const placeholders = Array.from({ length: 12 }, (_, i) => `https://images.unsplash.com/photo-152${(i+10)}?auto=format&fit=crop&w=600&q=60`)

export default function Gallery() {
  return (
    <section className="max-w-6xl mx-auto px-6 mt-12">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">Once downloaded, photos are yours to use as you wish.</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {placeholders.map((src, idx) => (
          <div key={idx} className="relative overflow-hidden rounded-xl bg-white/70 backdrop-blur border border-white/60 shadow">
            <img src={`https://picsum.photos/seed/pixflow-${idx}/600/400`} alt={`Gallery ${idx+1}`} className="w-full h-32 sm:h-36 md:h-40 object-cover transform hover:scale-105 transition-transform duration-500" />
          </div>
        ))}
      </div>
    </section>
  )
}
