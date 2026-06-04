import { Link } from 'react-router-dom'

function GoldOrb({ className }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-30 pointer-events-none ${className}`}
      style={{ background: 'radial-gradient(circle at 40% 40%, #F4EBD3, #C9A961, #8A6E2F)' }}
    />
  )
}

const VALUES = [
  { icon: '🌸', title: 'Гар хийц', desc: 'Захиалга бүрт өөр мэдрэмж. Бид баглаа бүрийг гараараа, анхааралтайгаар бүтээнэ.' },
  { icon: '💝', title: 'Мэдрэмж', desc: 'Таны төсөөллийг бодитоор. Өнгө, цэцэг, хэлбэр — бүгдийг та өөрөө сонгоно.' },
  { icon: '✨', title: 'NFC технологи', desc: 'Мэдрэмжээ илэрхийл. Баглаандаа захидал, дуу, зураг шингээж дижитал бэлэг үлдээ.' },
]

const FEATURES = [
  { label: 'Улаанбаатар хот дахь online цэцгийн дэлгүүр' },
  { label: 'Захиал — бид бүтээнэ (made-to-order)' },
  { label: 'NFC chip-тэй ухаалаг баглаа' },
]

export default function About() {
  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 px-6">
        <GoldOrb className="w-96 h-96 -top-32 -right-24" />
        <GoldOrb className="w-72 h-72 bottom-0 -left-24" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="font-cormorant tracking-[0.4em] text-sm uppercase text-gold-dark/70 mb-4">
            Tsetsegly · Танилцуулга
          </p>
          <h1 className="font-playfair italic text-5xl md:text-6xl text-ink mb-4">
            Бидний тухай
          </h1>
          <div className="w-16 h-px mx-auto my-6"
            style={{ background: 'linear-gradient(90deg, transparent, #C9A961, transparent)' }} />
          <p className="font-cormorant text-xl md:text-2xl text-ink/70 leading-relaxed max-w-2xl mx-auto">
            Tsetsegly бол гар хийцийн цэцгийн баглааны студи.
            Бид бэлэн баглаа зардаггүй — таны мэдрэмж, түүх, өнгийг сонсож,
            <span className="italic"> made-to-order</span> зарчмаар тус бүрд нь зориулж бүтээдэг.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-playfair italic text-3xl text-ink text-center mb-10">
            Бидний үнэт зүйлс
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-gold-light/70 p-7 text-center transition-transform duration-200 hover:-translate-y-1"
                style={{ background: 'linear-gradient(160deg, #FFFDF8, #FAF7F2)' }}
              >
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-playfair text-xl text-ink mb-2">{v.title}</h3>
                <p className="font-cormorant text-base text-ink/60 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-12">
        <div className="max-w-3xl mx-auto rounded-3xl border border-gold-light/70 px-8 py-10"
          style={{ background: 'linear-gradient(160deg, #FFFDF8, #FBF6EC)' }}>
          <h2 className="font-playfair italic text-3xl text-ink text-center mb-8">
            Бидний онцлог
          </h2>
          <div className="flex flex-col gap-5 max-w-xl mx-auto">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <span
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-cream font-playfair"
                  style={{ background: 'linear-gradient(135deg, #C9A961, #8A6E2F)' }}
                >
                  {i + 1}
                </span>
                <p className="font-cormorant text-lg text-ink/75">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 text-center">
        <p className="font-cormorant text-xl text-ink/60 mb-6">
          Өөрийн гараар онцгой баглаа бүтээхэд бэлэн үү?
        </p>
        <Link
          to="/build"
          className="group relative inline-block px-10 py-4 font-cormorant text-lg tracking-widest uppercase overflow-hidden"
        >
          <span className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #F4EBD3, #C9A961, #8A6E2F)' }} />
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(135deg, #8A6E2F, #C9A961, #F4EBD3)' }} />
          <span className="relative text-ink font-medium">Баглаа бүтээх</span>
        </Link>
      </section>
    </div>
  )
}
