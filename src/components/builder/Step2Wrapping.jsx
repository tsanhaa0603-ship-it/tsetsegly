import { useState } from 'react'
import WizardNav from './WizardNav'
import { SHAPES, ShapeSVG } from './BouquetShapes'
import { DEFAULT_WRAPPINGS, WRAP_CATEGORIES } from '../../lib/wrappings'

function fmt(n) {
  return '₮' + Number(n || 0).toLocaleString('mn-MN')
}

/* Боолтын зураг — файл байхгүй бол өнгөт талбар руу шилжинэ */
function WrapVisual({ wrap, className = '', fallbackClassName = '' }) {
  const [failed, setFailed] = useState(false)

  if (wrap?.image && !failed) {
    return (
      <img
        src={wrap.image}
        alt={wrap.name}
        onError={() => setFailed(true)}
        loading="lazy"
        className={className}
      />
    )
  }
  return <div className={`${className} ${fallbackClassName}`} style={{ background: wrap?.dot || '#E8DCC4' }} />
}

/* ─── Live Preview Panel ─── */
function LivePreview({ shapeId, wrappingId, wrappings }) {
  const shape = SHAPES.find((s) => s.id === shapeId)
  const wrap = wrappings.find((w) => w.id === wrappingId)

  return (
    <div
      className="rounded-2xl border border-gold-light/70 overflow-hidden h-full flex flex-col"
      style={{ background: 'linear-gradient(160deg, #FEFCF7, #FAF7F2)' }}
    >
      <div className="px-4 pt-4 pb-2 border-b border-gold-light/60">
        <p className="font-cormorant tracking-widest text-xs uppercase text-ink/40 text-center">
          Таны баглаа
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-6">
        {shapeId ? (
          <ShapeSVG
            id={shapeId}
            bloom="#DDACAB"
            wrap={wrap?.svgWrap ?? '#EFE5D0'}
            ribbon="#C9A961"
            style={{ width: 120, height: 150 }}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-ink/20">
            <svg viewBox="0 0 80 100" style={{ width: 100, height: 125 }}>
              <ellipse cx="40" cy="38" rx="26" ry="23" fill="currentColor" />
              <path d="M30 61 L50 61 L46 91 L34 91 Z" fill="currentColor" opacity="0.5" />
            </svg>
            <p className="font-cormorant text-xs text-center">Хэлбэр сонгоно уу</p>
          </div>
        )}
      </div>

      <div className="px-4 pb-4 flex flex-col gap-2">
        {shapeId && (
          <div className="flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: 'rgba(201,169,97,0.1)' }}>
            <span className="text-gold-dark text-xs">◆</span>
            <span className="font-cormorant text-sm text-ink/70">{shape?.name}</span>
            <span className="font-cormorant text-xs text-ink/35 ml-auto">{shape?.en}</span>
          </div>
        )}
        {wrap && (
          <div className="flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: 'rgba(201,169,97,0.08)' }}>
            <WrapVisual
              wrap={wrap}
              className="w-9 h-6 rounded-md object-cover border border-white/60 shadow-sm flex-shrink-0"
            />
            <span className="font-cormorant text-sm text-ink/70 truncate">{wrap.name}</span>
            <span className="font-cormorant text-xs text-ink/35 ml-auto flex-shrink-0">+{fmt(wrap.price)}</span>
          </div>
        )}
        {!shapeId && !wrappingId && (
          <p className="font-cormorant text-xs text-ink/30 text-center tracking-wide">
            Сонголтоо хийснээр<br />урьдчилан харагдана
          </p>
        )}
      </div>
    </div>
  )
}

/* ─── Main Component ─── */
export default function Step2Wrapping({
  selectedShape, onChangeShape, selected, onChange, onNext, onPrev, wrappings,
}) {
  const catalog = wrappings?.length ? wrappings : DEFAULT_WRAPPINGS
  const [cat, setCat] = useState('all')
  const canProceed = selectedShape && selected

  // Идэвхтэй ангиллын боолтууд
  const visible = cat === 'all' ? catalog : catalog.filter((w) => w.category === cat)
  // Зөвхөн боолт байгаа ангиллыг харуулна
  const cats = WRAP_CATEGORIES.filter((c) => catalog.some((w) => w.category === c.key))

  function countOf(key) {
    return key === 'all' ? catalog.length : catalog.filter((w) => w.category === key).length
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column */}
        <div className="flex-1 min-w-0 flex flex-col gap-8">

          {/* ── Section 1: Shape ── */}
          <div>
            <div className="mb-4">
              <h2 className="font-playfair italic text-2xl text-ink">Баглааны хэлбэр</h2>
              <p className="font-cormorant text-ink/50 mt-0.5">Баглаагаа яаж зохиолгохыг сонгоно уу</p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {SHAPES.map((shape) => {
                const active = selectedShape === shape.id
                return (
                  <button
                    key={shape.id}
                    onClick={() => onChangeShape(shape.id)}
                    className={`group relative rounded-xl border transition-all duration-200 overflow-hidden flex flex-col items-center pt-3 pb-2.5 px-1 ${
                      active
                        ? 'border-gold-mid shadow-md shadow-gold-mid/25 scale-[1.03]'
                        : 'border-gold-light/50 hover:border-gold-mid/50 hover:scale-[1.01]'
                    }`}
                    style={{ background: active ? 'linear-gradient(160deg, #FFFDF8, #FEF6E4)' : '#FDFAF5' }}
                  >
                    {active && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-cream z-10"
                        style={{ background: 'linear-gradient(135deg, #C9A961, #8A6E2F)' }}>
                        ✓
                      </div>
                    )}
                    <ShapeSVG
                      id={shape.id}
                      bloom={active ? '#D4948E' : '#CDAAAA'}
                      wrap={active ? '#E0D0B8' : '#DDD4C2'}
                      ribbon={active ? '#C9A961' : '#C9A96180'}
                      style={{ width: 52, height: 65 }}
                    />
                    <p className={`font-playfair text-xs mt-1.5 text-center leading-tight ${active ? 'text-ink' : 'text-ink/60'}`}>
                      {shape.name}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Section 2: Wrapping ── */}
          <div>
            <div className="flex items-end justify-between mb-4 gap-3">
              <div>
                <h2 className="font-playfair italic text-2xl text-ink">Боолтын цаас</h2>
                <p className="font-cormorant text-ink/50 mt-0.5">{catalog.length} төрлөөс сонгоно уу</p>
              </div>
            </div>

            {/* Ангиллын шүүлт */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[{ key: 'all', label: 'Бүгд' }, ...cats].map((c) => {
                const active = cat === c.key
                return (
                  <button
                    key={c.key}
                    onClick={() => setCat(c.key)}
                    className={`flex items-center gap-1.5 rounded-full font-cormorant text-sm px-3.5 py-2 transition-all duration-200 ${
                      active
                        ? 'text-ink font-medium shadow-md scale-105'
                        : 'text-ink/60 bg-white/60 border border-gold-light/70 hover:border-gold-mid/60 hover:text-ink'
                    }`}
                    style={active ? { background: 'linear-gradient(135deg, #F4EBD3, #C9A961)' } : undefined}
                  >
                    {c.label}
                    <span className={`text-xs ${active ? 'text-ink/50' : 'text-ink/30'}`}>{countOf(c.key)}</span>
                  </button>
                )
              })}
            </div>

            {/* Боолтын карт — зураг дүүрэн */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {visible.map((w) => {
                const active = selected === w.id
                return (
                  <button
                    key={w.id}
                    onClick={() => onChange(w.id)}
                    className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl text-left ${
                      active
                        ? 'border-gold-mid shadow-lg shadow-gold-mid/30 ring-2 ring-gold-mid/30'
                        : 'border-gold-light/50 hover:border-gold-mid/70 shadow-sm'
                    }`}
                  >
                    {/* Зураг — харьцаа нь зурагтай тааруулсан тул бүтнээрээ харагдана */}
                    <div className="relative aspect-[7/5] overflow-hidden" style={{ background: '#FAF7F2' }}>
                      <WrapVisual
                        wrap={w}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Сонгосон тэмдэг */}
                      {active && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs text-cream shadow-md"
                          style={{ background: 'linear-gradient(135deg, #C9A961, #8A6E2F)' }}>
                          ✓
                        </div>
                      )}
                    </div>

                    {/* Нэр, үнэ — зургийн доор (зургийг халхлахгүй) */}
                    <div className="px-3 py-2.5" style={{ background: active ? 'linear-gradient(160deg, #FFFDF8, #FEF6E4)' : '#FFFFFF' }}>
                      <p className="font-playfair text-sm text-ink leading-tight truncate">{w.name}</p>
                      <p className="font-cormorant text-xs mt-0.5" style={{ color: '#8A6E2F' }}>
                        +{fmt(w.price)}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right column: live preview */}
        <div className="lg:w-52 lg:sticky lg:top-24 lg:self-start">
          <p className="font-cormorant tracking-widest text-xs uppercase text-ink/40 mb-2 text-center lg:hidden">
            Урьдчилан харах
          </p>
          <LivePreview shapeId={selectedShape} wrappingId={selected} wrappings={catalog} />
        </div>
      </div>

      <WizardNav onNext={onNext} onPrev={onPrev} nextDisabled={!canProceed} nextLabel="Туузаа сонгох →" />
    </div>
  )
}
