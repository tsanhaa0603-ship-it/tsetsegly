import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import { fetchReadyBouquets } from '../lib/api'

function fmt(n) {
  return '₮' + Number(n || 0).toLocaleString('mn-MN')
}

/* Нүүр хуудасны "Бэлэн баглаа" хэсэг */
function ReadySection() {
  const navigate = useNavigate()
  const [bouquets, setBouquets] = useState([])

  useEffect(() => {
    let active = true
    fetchReadyBouquets().then((b) => { if (active) setBouquets(b.slice(0, 3)) })
    return () => { active = false }
  }, [])

  if (bouquets.length === 0) return null

  return (
    <section className="px-6 py-20" style={{ background: '#FAF7F2' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-cormorant tracking-[0.4em] text-sm uppercase text-gold-dark/70 mb-3">Бэлэн цуглуулга</p>
          <h2 className="font-playfair italic text-4xl md:text-5xl text-ink">Бэлэн баглаа</h2>
          <div className="w-16 h-px mx-auto mt-5" style={{ background: 'linear-gradient(90deg, transparent, #C9A961, transparent)' }} />
          <p className="font-cormorant text-lg text-ink/60 mt-5 max-w-lg mx-auto">
            Манай гар хийцийн бэлэн баглаануудаас сонгоод, шууд захиалаарай.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {bouquets.map((b) => (
            <div
              key={b._id}
              className="group rounded-2xl border border-gold-light/70 overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
              style={{ background: 'linear-gradient(160deg, #FFFDF8, #FAF7F2)' }}
            >
              <div className="relative aspect-[4/3] overflow-hidden" style={{ background: '#FAF7F2' }}>
                {b.image
                  ? <img src={b.image} alt={b.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                  : <div className="w-full h-full flex items-center justify-center text-5xl">💐</div>}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-playfair italic text-xl text-ink mb-1">{b.name}</h3>
                <p className="font-cormorant text-sm text-ink/55 flex-1">{b.contents}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-playfair text-lg" style={{ color: '#8A6E2F' }}>{fmt(b.price)}</span>
                  <button
                    onClick={() => navigate('/build', { state: { preset: b.preset, startStep: 3 } })}
                    className="font-cormorant text-sm tracking-widest uppercase text-gold-dark border-b border-gold-mid/50 hover:border-gold-mid transition-colors pb-0.5"
                  >
                    Сонгох →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/ready"
            className="font-cormorant text-base tracking-widest uppercase text-ink/70 hover:text-ink border-b border-gold-mid/50 pb-0.5 transition-colors"
          >
            Бүх бэлэн баглаа үзэх →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <main>
      <Hero />
      <ReadySection />
    </main>
  )
}
