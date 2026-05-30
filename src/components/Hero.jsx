import { Link } from 'react-router-dom'

/* Decorative gold foil orbs */
function GoldOrb({ className }) {
  return (
    <div
      className={`absolute rounded-full blur-2xl opacity-40 pointer-events-none ${className}`}
      style={{
        background: 'radial-gradient(circle at 40% 40%, #F4EBD3, #C9A961, #8A6E2F)',
      }}
    />
  )
}

/* Thin gold divider line */
function GoldLine() {
  return (
    <div
      className="w-20 h-px mx-auto my-6"
      style={{
        background: 'linear-gradient(90deg, transparent, #C9A961, transparent)',
      }}
    />
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background orbs */}
      <GoldOrb className="w-96 h-96 -top-32 -right-32" />
      <GoldOrb className="w-72 h-72 bottom-10 -left-24" />
      <GoldOrb className="w-48 h-48 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />

      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 50% at 70% 30%, rgba(201,169,97,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {/* Eyebrow label */}
        <p className="font-cormorant tracking-[0.4em] text-sm uppercase text-gold-dark/70 mb-4">
          Цэцгийн дэлгүүр · Улаанбаатар
        </p>

        {/* Main heading */}
        <h1 className="font-playfair italic text-5xl md:text-7xl leading-tight text-ink mb-2">
          Made-to-order
        </h1>
        <h1 className="font-playfair italic text-5xl md:text-7xl leading-tight gold-text">
          flowers
        </h1>

        <GoldLine />

        {/* Subtext */}
        <p className="font-cormorant text-xl md:text-2xl text-ink/70 leading-relaxed max-w-xl mx-auto">
          Таны мэдрэмж, таны өнгө, таны түүх —<br />
          бид бүгдийг нэг баглаанд хувиргана.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/build"
            className="group relative px-10 py-4 font-cormorant text-lg tracking-widest uppercase text-cream overflow-hidden"
          >
            {/* Gold button background */}
            <span
              className="absolute inset-0 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(135deg, #F4EBD3 0%, #C9A961 50%, #8A6E2F 100%)',
              }}
            />
            {/* Hover shimmer */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(135deg, #8A6E2F 0%, #C9A961 50%, #F4EBD3 100%)',
              }}
            />
            <span className="relative text-ink font-medium">Баглаа бүтээх</span>
          </Link>

          <Link
            to="/about"
            className="font-cormorant text-lg tracking-widest uppercase text-ink/60 hover:text-ink border-b border-gold-mid/50 pb-0.5 transition-colors duration-200"
          >
            Бидний тухай
          </Link>
        </div>

        {/* Bottom badge */}
        <div className="mt-16 flex items-center justify-center gap-3">
          <span className="w-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, #C9A961)' }} />
          <p className="font-cormorant text-sm tracking-[0.25em] text-ink/40 uppercase">
            Гар хийцийн · Захиалгаар
          </p>
          <span className="w-8 h-px" style={{ background: 'linear-gradient(90deg, #C9A961, transparent)' }} />
        </div>
      </div>
    </section>
  )
}
