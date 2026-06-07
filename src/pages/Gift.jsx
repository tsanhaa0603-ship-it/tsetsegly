import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { loadGift } from '../lib/giftStore'
import { fetchGift, normalizeGift } from '../lib/api'
import { parseMediaUrl } from '../lib/mediaEmbed'
import { getLetterFont } from '../lib/letterFonts'
import { WRAPPINGS } from '../components/builder/Step2Wrapping'
import { SHAPES, ShapeSVG } from '../components/builder/BouquetShapes'
import { RIBBONS } from '../components/builder/Step3Ribbon'
import Confetti from '../components/gift/Confetti'
import PhotoCarousel from '../components/gift/PhotoCarousel'

/* Gradient gold orb (Hero-той ижил аяс) */
function GoldOrb({ className }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-30 pointer-events-none ${className}`}
      style={{ background: 'radial-gradient(circle at 40% 40%, #F4EBD3, #C9A961, #8A6E2F)' }}
    />
  )
}

export default function Gift() {
  const { id } = useParams()
  const [data, setData] = useState(undefined) // undefined=loading, null=not found
  const [opened, setOpened] = useState(false)
  const [confetti, setConfetti] = useState(false)

  // Эхлээд backend-аас, амжилтгүй бол localStorage-аас татна
  useEffect(() => {
    let active = true
    ;(async () => {
      let raw
      try {
        raw = await fetchGift(id)
      } catch {
        raw = null
      }
      if (!raw) raw = loadGift(id)
      if (active) setData(normalizeGift(raw))
    })()
    return () => { active = false }
  }, [id])

  /* ── Loading ── */
  if (data === undefined) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-cormorant text-ink/40 text-lg animate-pulse">Бэлэг уншиж байна…</p>
      </div>
    )
  }

  /* ── Not found ── */
  if (data === null) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">🥀</div>
        <h1 className="font-playfair italic text-3xl text-ink mb-2">Бэлэг олдсонгүй</h1>
        <p className="font-cormorant text-ink/50 max-w-xs mb-6">
          Энэ холбоос хүчингүй болсон эсвэл буруу байж магадгүй.
        </p>
        <Link
          to="/"
          className="font-cormorant text-sm tracking-widest uppercase text-gold-dark border-b border-gold-mid/50 pb-0.5"
        >
          Нүүр хуудас руу
        </Link>
      </div>
    )
  }

  const media = data.music ? parseMediaUrl(data.music) : null
  const font = getLetterFont(data.letterFont)
  const photos = data.photos || []

  const flowerList = data.flowers || []
  const shapeItem = SHAPES.find((s) => s.id === data.shape)
  const wrapItem = WRAPPINGS.find((w) => w.id === data.wrapping)
  const ribbonItem = RIBBONS.find((r) => r.id === data.ribbon)

  function open() {
    setOpened(true)
    setConfetti(true)
  }

  /* ── Envelope intro (gate for music autoplay gesture) ── */
  if (!opened) {
    return (
      <div className="min-h-screen bg-cream relative overflow-hidden flex flex-col items-center justify-center px-6">
        <GoldOrb className="w-80 h-80 -top-20 -right-20" />
        <GoldOrb className="w-72 h-72 -bottom-20 -left-20" />

        <div className="relative z-10 text-center">
          <p className="font-cormorant tracking-[0.4em] text-xs uppercase text-gold-dark/60 mb-6 animate-pulse">
            Tsetsegly
          </p>

          {/* Envelope */}
          <button onClick={open} className="group block mx-auto mb-8" aria-label="Бэлэг нээх">
            <div className="relative w-44 h-32 mx-auto transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1">
              <svg viewBox="0 0 180 130" className="w-full h-full drop-shadow-xl">
                {/* body */}
                <rect x="5" y="25" width="170" height="100" rx="8" fill="#FBF6EC" stroke="#C9A961" strokeWidth="1.5" />
                {/* flap */}
                <path d="M5 33 L90 85 L175 33" fill="none" stroke="#C9A961" strokeWidth="1.5" />
                <path d="M5 30 L90 82 L175 30 L175 25 Q175 21 171 21 L9 21 Q5 21 5 25 Z" fill="#F4EBD3" stroke="#C9A961" strokeWidth="1.2" />
                {/* wax seal */}
                <circle cx="90" cy="70" r="15" fill="url(#seal)" />
                <text x="90" y="76" textAnchor="middle" fontSize="14" fill="#FAF7F2" fontFamily="Playfair Display">T</text>
                <defs>
                  <radialGradient id="seal" cx="40%" cy="35%">
                    <stop offset="0%" stopColor="#F4EBD3" />
                    <stop offset="55%" stopColor="#C9A961" />
                    <stop offset="100%" stopColor="#8A6E2F" />
                  </radialGradient>
                </defs>
              </svg>
              {/* floating hearts */}
              <span className="absolute -top-3 left-6 text-lg opacity-0 group-hover:opacity-100 transition-opacity">💛</span>
              <span className="absolute -top-1 right-8 text-sm opacity-0 group-hover:opacity-100 transition-opacity delay-100">✨</span>
            </div>
          </button>

          <h1 className="font-playfair italic text-3xl md:text-4xl text-ink mb-2">
            {data.recipientName ? `${data.recipientName}, ` : ''}танд бэлэг ирлээ
          </h1>
          <p className="font-cormorant text-lg text-ink/55 mb-8">
            ✉ Нээхийн тулд дарна уу
          </p>

          <button
            onClick={open}
            className="group relative px-10 py-3.5 font-cormorant text-base tracking-widest uppercase overflow-hidden"
          >
            <span className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #F4EBD3, #C9A961, #8A6E2F)' }} />
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(135deg, #8A6E2F, #C9A961, #F4EBD3)' }} />
            <span className="relative text-ink font-medium">Бэлэгээ нээх</span>
          </button>
        </div>
      </div>
    )
  }

  /* ── Opened gift ── */
  return (
    <div className="min-h-screen bg-cream relative overflow-hidden">
      {confetti && <Confetti />}

      {/* Background orbs */}
      <GoldOrb className="w-96 h-96 -top-32 -right-32" />
      <GoldOrb className="w-80 h-80 top-1/3 -left-32" />
      <GoldOrb className="w-72 h-72 -bottom-20 right-0" />

      <div className="relative z-10 max-w-lg mx-auto px-5 py-12 flex flex-col items-center gap-10">

        {/* Intro */}
        <div className="text-center reveal" style={{ animationDelay: '0.1s' }}>
          <p className="font-cormorant tracking-[0.4em] text-xs uppercase text-gold-dark/60 mb-3">
            Tsetsegly · Танд зориулав
          </p>
          <div className="text-4xl mb-3">💐</div>
          <h1 className="font-playfair italic text-4xl md:text-5xl text-ink leading-tight">
            {data.recipientName ? `Хайрт ${data.recipientName}` : 'Танд зориулсан'}
          </h1>
          <div className="w-16 h-px mx-auto mt-5"
            style={{ background: 'linear-gradient(90deg, transparent, #C9A961, transparent)' }} />
        </div>

        {/* Letter */}
        {data.letterText && (
          <div className="w-full reveal" style={{ animationDelay: '0.3s' }}>
            <div className="rounded-3xl border border-gold-light/70 px-7 py-9 shadow-sm"
              style={{ background: 'linear-gradient(160deg, #FFFDF8, #FBF6EC)' }}>
              <p className="text-center text-2xl mb-4">💌</p>
              <p
                className="text-ink/85 text-center leading-relaxed whitespace-pre-wrap"
                style={{
                  ...font.style,
                  fontSize: data.letterFont === 'fun' ? '1.75rem' : '1.35rem',
                  lineHeight: data.letterFont === 'fun' ? '1.5' : '1.7',
                }}
              >
                {data.letterText}
              </p>
              {data.senderName && (
                <p className="font-cormorant text-right text-ink/45 mt-6 text-base">
                  — {data.senderName}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Music */}
        {media && (
          <div className="w-full reveal" style={{ animationDelay: '0.5s' }}>
            <p className="font-cormorant tracking-[0.3em] text-xs uppercase text-gold-dark/50 mb-3 text-center flex items-center justify-center gap-2">
              <span className="animate-pulse">🎵</span> Танд зориулсан аялгуу
            </p>
            <div className="rounded-2xl overflow-hidden shadow-md">
              <iframe
                title="gift-music"
                src={media.embedUrl}
                width="100%"
                height={media.height}
                frameBorder="0"
                allow="autoplay; encrypted-media; clipboard-write; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Photo carousel */}
        {photos.length > 0 && (
          <div className="w-full reveal" style={{ animationDelay: '0.65s' }}>
            <p className="font-cormorant tracking-[0.3em] text-xs uppercase text-gold-dark/50 mb-4 text-center flex items-center justify-center gap-2">
              <span>📸</span> Бидний дурсамжууд
            </p>
            <PhotoCarousel photos={photos} />
          </div>
        )}

        {/* Bouquet info */}
        <div className="w-full reveal" style={{ animationDelay: '0.8s' }}>
          <div className="rounded-3xl border border-gold-light/70 overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #FFFDF8, #FAF7F2)' }}>
            <div className="px-6 pt-6 pb-2 text-center">
              <p className="font-cormorant tracking-[0.3em] text-xs uppercase text-gold-dark/50">
                Таны баглаа
              </p>
            </div>

            <div className="flex items-center gap-5 px-6 py-5">
              {/* Bouquet preview */}
              {data.shape && (
                <div className="flex-shrink-0">
                  <ShapeSVG
                    id={data.shape}
                    bloom="#DDACAB"
                    wrap={wrapItem?.svgWrap ?? '#EFE5D0'}
                    ribbon={ribbonItem?.color ?? '#C9A961'}
                    style={{ width: 90, height: 112 }}
                  />
                </div>
              )}

              {/* Details */}
              <div className="flex-1 min-w-0">
                {flowerList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {flowerList.map((f) => (
                      <span key={f.id} className="text-sm font-cormorant px-2.5 py-1 rounded-full bg-gold-light/40 text-ink/75 flex items-center gap-1.5">
                        {f.image ? (
                          <img src={f.image} alt={f.name} className="w-4 h-4 rounded-full object-cover" />
                        ) : (
                          <span>{f.emoji}</span>
                        )}
                        {f.name}
                        {f.qty > 1 && <span className="text-ink/40">×{f.qty}</span>}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-col gap-1 font-cormorant text-sm text-ink/55">
                  {shapeItem && <p>◆ {shapeItem.name} хэлбэр</p>}
                  {wrapItem && <p>✦ {wrapItem.name} боолт</p>}
                  {ribbonItem && (
                    <p className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full inline-block border border-white/70" style={{ background: ribbonItem.color }} />
                      {ribbonItem.name} туузаа
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 pb-2 reveal" style={{ animationDelay: '1s' }}>
          <div className="w-10 h-px mx-auto mb-4"
            style={{ background: 'linear-gradient(90deg, transparent, #C9A961, transparent)' }} />
          <Link to="/" className="font-playfair italic text-2xl gold-text">Tsetsegly</Link>
          <p className="font-cormorant text-sm text-ink/40 tracking-widest uppercase mt-1">
            Made-to-order flowers
          </p>
          <Link
            to="/build"
            className="inline-block mt-5 font-cormorant text-sm tracking-widest uppercase text-gold-dark border-b border-gold-mid/40 pb-0.5 hover:border-gold-mid transition-colors"
          >
            Өөрөө баглаа бүтээх →
          </Link>
        </div>
      </div>
    </div>
  )
}
