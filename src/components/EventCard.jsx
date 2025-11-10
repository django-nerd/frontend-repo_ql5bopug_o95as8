import React from 'react'
import { Link } from 'react-router-dom'

export default function EventCard({ title, date, imageUrl, slug }) {
  const content = (
    <div className="group rounded-3xl bg-white/80 backdrop-blur border border-white/60 p-3 shadow-[10px_10px_30px_rgba(30,64,175,0.08),-10px_-10px_30px_rgba(56,189,248,0.08)] hover:shadow-[14px_14px_36px_rgba(30,64,175,0.12),-14px_-14px_36px_rgba(56,189,248,0.12)] transition-all">
      <div className="relative overflow-hidden rounded-2xl aspect-[16/10]">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="px-2 pt-3 pb-2">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500">{date}</p>
      </div>
    </div>
  )

  return slug ? (
    <Link to={`/event/${slug}`}>{content}</Link>
  ) : content
}
