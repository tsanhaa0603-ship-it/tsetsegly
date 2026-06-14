import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchReadyBouquets } from '../lib/api'

function GoldOrb({ className }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-30 pointer-events-none ${className}`}
      style={{ background: 'radial-gradient(circle at 40% 40%, #F4EBD3, #C9A961, #8A6E2F)' }}
    />
  )
}

function fmt(n) {
  return '₮' + Number(n || 0).toLocaleString('mn-MN')
}

export default function ReadyBouquets() {
  const navigate = useNavigate()
  const [bouquets, setBouquets] = useState(null)

  useEffect(() => {
    let active = true
    fetchReadyBouquets().then((b) => { if (active) setBouquets(b) })
    return () => { active = false }
  }, [])

  function choose(b) {
    // Баглааны тохиргоог configurator-т дамжуулж, алхам 3 руу шилжинэ
    navigate('/build', { state: { preset: b.preset, startStep: 3 } })
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-12 px-6">
        <GoldOrb className="w-96 h-96 -top-32 -right-24" />
        <GoldOrb className="w-72 h-72 bottom-0 -left-24" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="font-cormorant tracking-[0.4em] text-sm uppercase text-gold-dark/70 mb-4">
            Tsetsegly · Бэлэн цуглуулга
          </p>
          <h1 className="font-playfair italic text-5xl md:text-6xl text-ink mb-4">Бэлэн баглаа</h1>
          <div className="w-16 h-px mx-auto my-6"
            style={{ background: 'linear-gradient(90deg, transparent, #C9A961, transparent)' }} />
          <p className="font-cormorant text-xl text-ink/70 leading-relaxed max-w-xl mx-auto">
            Манай гар хийцийн бэлэн баглаануудаас сонгоорой.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          {bouquets === null ? (
            <div className="text-center py-16 font-cormorant text-ink/40 animate-pulse">Уншиж байна…</div>
          ) : bouquets.length === 0 ? (
            <div className="text-center py-16 font-cormorant text-ink/40">Одоогоор бэлэн баглаа алга байна.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bouquets.map((b) => (
                <div
                  key={b._id}
                  className="group rounded-2xl border border-gold-light/70 overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                  style={{ background: 'linear-gradient(160deg, #FFFDF8, #FAF7F2)' }}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden" style={{ background: '#FAF7F2' }}>
                    {b.image ? (
                      <img src={b.image} alt={b.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">💐</div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-playfair italic text-2xl text-ink mb-1.5">{b.name}</h3>
                    <p className="font-cormorant text-base text-ink/55 leading-relaxed flex-1">{b.contents}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="font-playfair text-xl" style={{ color: '#8A6E2F' }}>{fmt(b.price)}</span>
                      <button
                        onClick={() => choose(b)}
                        className="group/btn relative px-6 py-2.5 font-cormorant text-sm tracking-widest uppercase overflow-hidden rounded-xl"
                      >
                        <span className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #F4EBD3, #C9A961, #8A6E2F)' }} />
                        <span className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                          style={{ background: 'linear-gradient(135deg, #8A6E2F, #C9A961, #F4EBD3)' }} />
                        <span className="relative text-ink font-medium">Сонгох</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
