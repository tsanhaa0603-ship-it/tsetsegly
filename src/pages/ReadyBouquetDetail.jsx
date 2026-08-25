import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { fetchReadyBouquet, fetchReadyBouquets } from '../lib/api'
import { CITY_DELIVERY_FEE, FREE_DELIVERY_MIN, LAST_SAME_DAY_HOUR } from '../lib/delivery'
import { trackViewItem, trackPageView } from '../lib/analytics'
import { flattenCatalog } from '../lib/flowers'
import { DEFAULT_CATALOG } from '../lib/flowers'
import { DEFAULT_WRAPPINGS } from '../lib/wrappings'
import { DEFAULT_SHAPES } from '../lib/shapes'

function fmt(n) {
  return '₮' + Number(n || 0).toLocaleString('mn-MN')
}

/* Бэлэн баглааны дэлгэрэнгүй хуудас — /ready/:slug
   Урт сүүлтэй хайлтын гол буух цэг. */
export default function ReadyBouquetDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  /* { slug, data } хэлбэрээр хадгална — ингэснээр өөр баглаа руу шилжихэд
     хуучин өгөгдөл харагдахгүй, effect дотор setState дуудах ч шаардлагагүй. */
  const [loaded, setLoaded] = useState(null)
  const [others, setOthers] = useState([])

  useEffect(() => {
    let active = true
    fetchReadyBouquet(slug).then((b) => { if (active) setLoaded({ slug, data: b }) })
    fetchReadyBouquets().then((list) => { if (active) setOthers(list) })
    return () => { active = false }
  }, [slug])

  // undefined = уншиж байна, null = олдсонгүй
  const bouquet = loaded && loaded.slug === slug ? loaded.data : undefined

  /* Хуудас бүр өөрийн гарчигтай байх — build үед статик HTML үүсдэг ч
     хуудас хооронд шилжихэд client талд ч зөв байлгана. */
  useEffect(() => {
    if (!bouquet) return
    const prev = document.title
    const title = `${bouquet.name} — ${fmt(bouquet.price)} | Tsetsegly`
    document.title = title

    /* Гарчиг тодорсны дараа илгээнэ — ScrollToTop энэ маршрутыг алгасдаг */
    trackPageView(`/ready/${bouquet.slug}`, title)
    trackViewItem({ id: bouquet.slug, name: bouquet.name, price: bouquet.price })

    return () => { document.title = prev }
  }, [bouquet])

  if (bouquet === undefined) {
    return (
      <div className="bg-cream min-h-screen pt-32 text-center font-cormorant text-ink/40 animate-pulse">
        Уншиж байна…
      </div>
    )
  }

  if (bouquet === null) {
    return (
      <div className="bg-cream min-h-screen pt-32 pb-20 px-6 text-center">
        <div className="text-5xl mb-4">💐</div>
        <h1 className="font-playfair italic text-3xl text-ink mb-3">Баглаа олдсонгүй</h1>
        <p className="font-cormorant text-lg text-ink/55 mb-6">
          Энэ баглаа устсан эсвэл хаяг нь буруу байна.
        </p>
        <Link
          to="/ready"
          className="font-cormorant text-sm tracking-widest uppercase text-gold-dark border-b border-gold-mid/50 hover:border-gold-mid pb-0.5"
        >
          Бүх бэлэн баглаа үзэх →
        </Link>
      </div>
    )
  }

  /* preset-ээс цэцгийн жагсаалт гаргана */
  const flat = flattenCatalog(DEFAULT_CATALOG)
  const flowers = Object.entries(bouquet.preset?.flowers || {})
    .filter(([, qty]) => qty > 0)
    .map(([key, qty]) => ({ ...(flat[key] || { name: key, emoji: '🌸' }), qty, key }))

  const shape = DEFAULT_SHAPES.find((s) => s.id === bouquet.preset?.shape)
  const wrapping = DEFAULT_WRAPPINGS.find((w) => w.id === bouquet.preset?.wrapping)
  const freeDelivery = bouquet.price >= FREE_DELIVERY_MIN

  const related = others.filter((b) => b.slug && b.slug !== bouquet.slug).slice(0, 3)

  return (
    <div className="bg-cream min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Замын мөр */}
        <nav aria-label="Замын мөр" className="font-cormorant text-sm text-ink/40 mb-6">
          <Link to="/" className="hover:text-ink/70 transition-colors">Нүүр</Link>
          <span className="mx-2">/</span>
          <Link to="/ready" className="hover:text-ink/70 transition-colors">Бэлэн баглаа</Link>
          <span className="mx-2">/</span>
          <span className="text-ink/60">{bouquet.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Зураг */}
          <div
            className="rounded-2xl border border-gold-light/70 overflow-hidden aspect-square"
            style={{ background: '#FAF7F2' }}
          >
            {bouquet.image ? (
              <img
                src={bouquet.image}
                alt={`${bouquet.name} — ${bouquet.contents}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-7xl">💐</div>
            )}
          </div>

          {/* Мэдээлэл */}
          <div>
            <p className="font-cormorant tracking-[0.3em] text-xs uppercase text-gold-dark/70 mb-3">
              Бэлэн баглаа
            </p>
            <h1 className="font-playfair italic text-4xl md:text-5xl text-ink mb-4">
              {bouquet.name}
            </h1>
            <p className="font-cormorant text-lg text-ink/65 leading-relaxed mb-6">
              {bouquet.contents}
            </p>

            <p className="font-playfair text-3xl mb-6" style={{ color: '#8A6E2F' }}>
              {fmt(bouquet.price)}
            </p>

            {/* Бүрэлдэхүүн */}
            {flowers.length > 0 && (
              <div className="rounded-2xl border border-gold-light/70 px-5 py-4 mb-4"
                style={{ background: 'linear-gradient(160deg, #FFFDF8, #FAF7F2)' }}>
                <p className="font-cormorant tracking-widest text-xs uppercase text-ink/40 mb-3">
                  Бүрэлдэхүүн
                </p>
                <ul className="flex flex-col gap-1.5">
                  {flowers.map((f) => (
                    <li key={f.key} className="flex items-center justify-between font-cormorant text-base text-ink">
                      <span className="flex items-center gap-2">
                        {f.image
                          ? <img src={f.image} alt="" className="w-6 h-6 rounded-md object-cover" />
                          : <span aria-hidden="true">{f.emoji}</span>}
                        {f.name}
                      </span>
                      <span className="text-ink/45">× {f.qty}</span>
                    </li>
                  ))}
                </ul>
                {(shape || wrapping) && (
                  <p className="font-cormorant text-sm text-ink/45 mt-3 pt-3 border-t border-gold-light/60">
                    {shape && <>Хэлбэр: {shape.name}</>}
                    {shape && wrapping && ' · '}
                    {wrapping && <>Боолт: {wrapping.name}</>}
                  </p>
                )}
              </div>
            )}

            {/* Хүргэлт */}
            <div className="rounded-2xl border border-gold-light/70 px-5 py-4 mb-6 bg-white/40">
              <p className="font-cormorant tracking-widest text-xs uppercase text-ink/40 mb-2">
                Хүргэлт
              </p>
              <p className="font-cormorant text-base text-ink/70 leading-relaxed">
                {freeDelivery
                  ? <>Улаанбаатар даяар <span className="text-gold-dark font-medium">хүргэлт үнэгүй</span>.</>
                  : <>Улаанбаатарын 6 дүүрэгт {fmt(CITY_DELIVERY_FEE)}. {fmt(FREE_DELIVERY_MIN)}-аас дээш захиалгад үнэгүй.</>}
                {' '}{LAST_SAME_DAY_HOUR}:00 цагаас өмнө захиалвал өнөөдөртөө хүргэнэ.
              </p>
            </div>

            {/* Үйлдэл */}
            <button
              onClick={() => navigate('/build', { state: { preset: bouquet.preset, startStep: 3 } })}
              className="group relative w-full py-4 font-cormorant text-base tracking-widest uppercase overflow-hidden rounded-xl"
            >
              <span className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #F4EBD3, #C9A961, #8A6E2F)' }} />
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, #8A6E2F, #C9A961, #F4EBD3)' }} />
              <span className="relative text-ink font-medium">Энэ баглааг захиалах</span>
            </button>

            <p className="font-cormorant text-sm text-ink/45 text-center mt-3">
              Захиалахын өмнө туузаа, захидлаа нэмж, өөрчилж болно.
            </p>
          </div>
        </div>

        {/* Бусад баглаа */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-playfair italic text-2xl text-ink mb-6">Бусад баглаа</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((b) => (
                <Link
                  key={b._id}
                  to={`/ready/${b.slug}`}
                  className="group rounded-2xl border border-gold-light/70 overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                  style={{ background: 'linear-gradient(160deg, #FFFDF8, #FAF7F2)' }}
                >
                  <div className="aspect-[4/3] overflow-hidden" style={{ background: '#FAF7F2' }}>
                    {b.image
                      ? <img src={b.image} alt={b.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      : <div className="w-full h-full flex items-center justify-center text-5xl">💐</div>}
                  </div>
                  <div className="p-4">
                    <h3 className="font-playfair italic text-lg text-ink">{b.name}</h3>
                    <span className="font-playfair text-base" style={{ color: '#8A6E2F' }}>{fmt(b.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
