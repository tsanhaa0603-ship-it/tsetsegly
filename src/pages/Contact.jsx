import { useState } from 'react'

function GoldOrb({ className }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-30 pointer-events-none ${className}`}
      style={{ background: 'radial-gradient(circle at 40% 40%, #F4EBD3, #C9A961, #8A6E2F)' }}
    />
  )
}

const CONTACTS = [
  { icon: '📞', label: 'Утас', value: '8844 4310', href: 'tel:88444310' },
  { icon: '✉', label: 'Имэйл', value: 'tsanhaa0603@gmail.com', href: 'mailto:tsanhaa0603@gmail.com' },
  { icon: '📍', label: 'Байршил', value: 'Улаанбаатар, Монгол', href: null },
]

const SOCIALS = [
  { label: 'Instagram', href: '#' },
  { label: 'Facebook', href: '#' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: '' }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const err = {}
    if (!form.name.trim()) err.name = 'Нэрээ оруулна уу'
    if (!form.phone.trim()) err.phone = 'Утсаа оруулна уу'
    if (!form.message.trim()) err.message = 'Мэдэгдлээ бичнэ үү'
    if (Object.keys(err).length) { setErrors(err); return }
    setSent(true)
  }

  return (
    <div className="bg-cream min-h-screen">
      <section className="relative overflow-hidden pt-28 pb-12 px-6">
        <GoldOrb className="w-96 h-96 -top-32 -left-24" />
        <GoldOrb className="w-72 h-72 bottom-0 -right-24" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="font-cormorant tracking-[0.4em] text-sm uppercase text-gold-dark/70 mb-4">
            Tsetsegly · Холбоо
          </p>
          <h1 className="font-playfair italic text-5xl md:text-6xl text-ink mb-4">
            Холбоо барих
          </h1>
          <div className="w-16 h-px mx-auto my-6"
            style={{ background: 'linear-gradient(90deg, transparent, #C9A961, transparent)' }} />
          <p className="font-cormorant text-xl text-ink/70 leading-relaxed max-w-xl mx-auto">
            Захиалга, асуулт, хамтын ажиллагааны талаар бидэнтэй чөлөөтэй холбогдоорой.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Contact info */}
          <div className="flex flex-col gap-4">
            {CONTACTS.map((c) => {
              const inner = (
                <div className="flex items-center gap-4 rounded-2xl border border-gold-light/70 px-6 py-5 transition-colors hover:border-gold-mid/60"
                  style={{ background: 'linear-gradient(160deg, #FFFDF8, #FAF7F2)' }}>
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <p className="font-cormorant tracking-widest text-xs uppercase text-ink/40">{c.label}</p>
                    <p className="font-cormorant text-lg text-ink">{c.value}</p>
                  </div>
                </div>
              )
              return c.href ? (
                <a key={c.label} href={c.href} className="block">{inner}</a>
              ) : (
                <div key={c.label}>{inner}</div>
              )
            })}

            {/* Socials */}
            <div className="rounded-2xl border border-gold-light/70 px-6 py-5"
              style={{ background: 'linear-gradient(160deg, #FFFDF8, #FAF7F2)' }}>
              <p className="font-cormorant tracking-widest text-xs uppercase text-ink/40 mb-3">Сошиал хаягууд</p>
              <div className="flex gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="font-cormorant text-sm tracking-wide uppercase text-gold-dark border border-gold-mid/40 rounded-full px-4 py-1.5 hover:bg-gold-light/40 transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-gold-light/70 px-7 py-7"
            style={{ background: 'linear-gradient(160deg, #FFFDF8, #FBF6EC)' }}>
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="text-5xl mb-4">🌸</div>
                <h3 className="font-playfair italic text-2xl text-ink mb-2">Баярлалаа!</h3>
                <p className="font-cormorant text-base text-ink/60 max-w-xs">
                  <span className="text-gold-dark font-medium">{form.name}</span>, таны мэдэгдлийг хүлээн авлаа.
                  Удахгүй холбогдох болно.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h3 className="font-playfair italic text-2xl text-ink mb-1">Бидэнд бичих</h3>

                <div>
                  <label className="font-cormorant text-sm text-ink/60 mb-1 block">Нэр</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="Таны нэр"
                    className={`w-full rounded-xl border px-4 py-2.5 font-cormorant text-base text-ink placeholder-ink/30 bg-white/60 focus:outline-none transition-colors ${errors.name ? 'border-red-300' : 'border-gold-light/80 focus:border-gold-mid'}`}
                  />
                  {errors.name && <p className="font-cormorant text-xs text-red-400 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="font-cormorant text-sm text-ink/60 mb-1 block">Утас</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    placeholder="Утасны дугаар"
                    className={`w-full rounded-xl border px-4 py-2.5 font-cormorant text-base text-ink placeholder-ink/30 bg-white/60 focus:outline-none transition-colors ${errors.phone ? 'border-red-300' : 'border-gold-light/80 focus:border-gold-mid'}`}
                  />
                  {errors.phone && <p className="font-cormorant text-xs text-red-400 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="font-cormorant text-sm text-ink/60 mb-1 block">Мэдэгдэл</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                    rows={4}
                    placeholder="Захиалга эсвэл асуултаа бичнэ үү…"
                    className={`w-full rounded-xl border px-4 py-2.5 font-cormorant text-base text-ink placeholder-ink/30 bg-white/60 focus:outline-none resize-none transition-colors ${errors.message ? 'border-red-300' : 'border-gold-light/80 focus:border-gold-mid'}`}
                  />
                  {errors.message && <p className="font-cormorant text-xs text-red-400 mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="group relative mt-1 py-3.5 font-cormorant text-base tracking-widest uppercase overflow-hidden rounded-xl"
                >
                  <span className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #F4EBD3, #C9A961, #8A6E2F)' }} />
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(135deg, #8A6E2F, #C9A961, #F4EBD3)' }} />
                  <span className="relative text-ink font-medium">Илгээх</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
