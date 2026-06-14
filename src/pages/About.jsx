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
  { icon: '🌸', title: 'Гар хийц', desc: 'Цэцэг бүрийг гар аргаар, таны захиалгаар бүтээнэ' },
  { icon: '💝', title: 'Мэдрэмжтэй', desc: 'Таны түүхийг цэцгийн баглаагаар илэрхийлнэ' },
  { icon: '✨', title: 'NFC технологи', desc: 'Баглаанд NFC chip суулгаж мэндчилгээ, дуу, зураг хавсаргах боломжтой' },
]

const STATS = [
  { value: '58+', label: 'цэцгийн зүйл' },
  { value: '15+', label: 'ангилал' },
  { value: '100%', label: 'гар хийц' },
  { value: 'NFC', label: 'технологитой' },
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
            Tsetsegly бол Улаанбаатар хотод үйл ажиллагаа явуулдаг made-to-order
            цэцгийн дэлгүүр. Бид таны мэдрэмж, өнгө, түүхийг цэцгээр илэрхийлнэ.
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

      {/* Бидний онцлог — 2 багана */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto rounded-3xl border border-gold-light/70 overflow-hidden grid md:grid-cols-2"
          style={{ background: 'linear-gradient(160deg, #FFFDF8, #FBF6EC)' }}>
          {/* Зүүн тал — текст */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <h2 className="font-playfair italic text-3xl text-ink mb-5">Бидний онцлог</h2>
            <p className="font-cormorant text-lg text-ink/70 leading-relaxed">
              Бид 2024 оноос хойш Улаанбаатарт үйл ажиллагаагаа явуулж байна.
              Made-to-order гэдэг нь таны захиалгыг хүлээн авсны дараа л цэцгийг
              бэлтгэнэ гэсэн үг. 15 гаруй төрлийн, 58 зүйлийн цэцэгтэй.
            </p>
          </div>
          {/* Баруун тал — статистик */}
          <div className="p-8 md:p-10 grid grid-cols-2 gap-5 border-t md:border-t-0 md:border-l border-gold-light/60">
            {STATS.map((s) => (
              <div key={s.label} className="text-center py-4">
                <p className="font-playfair text-4xl md:text-5xl gold-text leading-none">{s.value}</p>
                <p className="font-cormorant text-base text-ink/55 mt-2">{s.label}</p>
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
