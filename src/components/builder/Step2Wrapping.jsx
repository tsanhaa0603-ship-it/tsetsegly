/* eslint-disable react-refresh/only-export-components */
import WizardNav from './WizardNav'
import { SHAPES, ShapeSVG } from './BouquetShapes'

export const WRAPPINGS = [
  {
    id: 'cream',
    name: 'Крем цагаан',
    desc: 'Цэвэр, дэгжин',
    price: 5000,
    bg: 'linear-gradient(135deg, #FBF7F0, #EFE5D0)',
    dot: '#E8DCC4',
    text: '#5C4A2A',
    svgWrap: '#EFE5D0',
  },
  {
    id: 'pink',
    name: 'Ягаан хөрс',
    desc: 'Романтик аяс',
    price: 5000,
    bg: 'linear-gradient(135deg, #FDE8E8, #F9C8D0)',
    dot: '#F0A8B4',
    text: '#8C3A50',
    svgWrap: '#F9C8D0',
  },
  {
    id: 'black',
    name: 'Хар тансаг',
    desc: 'Зоригтой контраст',
    price: 8000,
    bg: 'linear-gradient(135deg, #2A2A2A, #1A1A1A)',
    dot: '#C9A961',
    text: '#C9A961',
    svgWrap: '#2A2A2A',
  },
  {
    id: 'green',
    name: 'Ногоон байгаль',
    desc: 'Шинэлэг, тайван',
    price: 6000,
    bg: 'linear-gradient(135deg, #D4E8C2, #B0CFA0)',
    dot: '#6A9950',
    text: '#2D5A1B',
    svgWrap: '#B0CFA0',
  },
]

/* ─── Live Preview Panel ─── */
function LivePreview({ shapeId, wrappingId }) {
  const shape   = SHAPES.find((s) => s.id === shapeId)
  const wrap    = WRAPPINGS.find((w) => w.id === wrappingId)

  return (
    <div
      className="rounded-2xl border border-gold-light/70 overflow-hidden h-full flex flex-col"
      style={{ background: 'linear-gradient(160deg, #FEFCF7, #FAF7F2)' }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2 border-b border-gold-light/60">
        <p className="font-cormorant tracking-widest text-xs uppercase text-ink/40 text-center">
          Таны баглаа
        </p>
      </div>

      {/* Bouquet SVG */}
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

      {/* Info chips */}
      <div className="px-4 pb-4 flex flex-col gap-2">
        {shapeId && (
          <div className="flex items-center gap-2 rounded-lg px-3 py-1.5"
            style={{ background: 'rgba(201,169,97,0.1)' }}>
            <span className="text-gold-dark text-xs">◆</span>
            <span className="font-cormorant text-sm text-ink/70">{shape?.name}</span>
            <span className="font-cormorant text-xs text-ink/35 ml-auto">{shape?.en}</span>
          </div>
        )}
        {wrappingId && (
          <div className="flex items-center gap-2 rounded-lg px-3 py-1.5"
            style={{ background: 'rgba(201,169,97,0.08)' }}>
            <span
              className="w-3 h-3 rounded-full border border-white/60 shadow-sm flex-shrink-0"
              style={{ background: wrap?.dot }}
            />
            <span className="font-cormorant text-sm text-ink/70">{wrap?.name}</span>
            <span className="font-cormorant text-xs text-ink/35 ml-auto">+₮{wrap?.price?.toLocaleString()}</span>
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
export default function Step2Wrapping({ selectedShape, onChangeShape, selected, onChange, onNext, onPrev }) {
  const canProceed = selectedShape && selected

  return (
    <div>
      {/* ── Desktop: two-column, Mobile: stacked ── */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* Left column: selectors */}
        <div className="flex-1 min-w-0 flex flex-col gap-8">

          {/* ── Section 1: Shape ── */}
          <div>
            <div className="mb-4">
              <h2 className="font-playfair italic text-2xl text-ink">Баглааны хэлбэр</h2>
              <p className="font-cormorant text-ink/50 mt-0.5">Баглаагаа яаж зохиолгохыг сонгоно уу</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
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
                    style={{
                      background: active
                        ? 'linear-gradient(160deg, #FFFDF8, #FEF6E4)'
                        : '#FDFAF5',
                    }}
                  >
                    {/* Selected badge */}
                    {active && (
                      <div
                        className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-cream z-10"
                        style={{ background: 'linear-gradient(135deg, #C9A961, #8A6E2F)' }}
                      >
                        ✓
                      </div>
                    )}

                    {/* Shape SVG */}
                    <ShapeSVG
                      id={shape.id}
                      bloom={active ? '#D4948E' : '#CDAAAA'}
                      wrap={active ? '#E0D0B8' : '#DDD4C2'}
                      ribbon={active ? '#C9A961' : '#C9A96180'}
                      style={{ width: 52, height: 65 }}
                    />

                    {/* Name + desc */}
                    <p className={`font-playfair text-xs mt-1.5 text-center leading-tight transition-colors ${active ? 'text-ink' : 'text-ink/60'}`}>
                      {shape.name}
                    </p>
                    <p className="font-cormorant text-[10px] text-ink/35 text-center leading-tight mt-0.5 hidden sm:block">
                      {shape.desc}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Section 2: Wrapping ── */}
          <div>
            <div className="mb-4">
              <h2 className="font-playfair italic text-xl text-ink">Боолтын цаас</h2>
              <p className="font-cormorant text-ink/50 mt-0.5">Баглааны гадна боодлоо сонгоно уу</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {WRAPPINGS.map((w) => {
                const active = selected === w.id
                return (
                  <button
                    key={w.id}
                    onClick={() => onChange(w.id)}
                    className={`relative rounded-2xl border-2 p-4 text-left transition-all duration-200 overflow-hidden ${
                      active
                        ? 'border-gold-mid shadow-md shadow-gold-mid/20 scale-[1.02]'
                        : 'border-transparent hover:border-gold-light/80'
                    }`}
                    style={{ background: w.bg }}
                  >
                    {active && (
                      <div
                        className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-cream"
                        style={{ background: 'linear-gradient(135deg, #C9A961, #8A6E2F)' }}
                      >
                        ✓
                      </div>
                    )}
                    {/* Paper texture */}
                    <div className="mb-3 flex gap-1.5">
                      {[0.5, 0.75, 1].map((op, i) => (
                        <div key={i} className="w-2.5 h-8 rounded-full" style={{ backgroundColor: w.dot, opacity: op }} />
                      ))}
                    </div>
                    <p className="font-playfair text-sm" style={{ color: w.text }}>{w.name}</p>
                    <p className="font-cormorant text-xs mt-0.5 opacity-65" style={{ color: w.text }}>{w.desc}</p>
                    <p className="font-cormorant text-xs font-medium mt-1.5" style={{ color: w.dot === '#C9A961' ? '#C9A961' : w.text }}>
                      +₮{w.price.toLocaleString()}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right column: live preview (desktop) / bottom (mobile) */}
        <div className="md:w-48 md:sticky md:top-24 md:self-start">
          <p className="font-cormorant tracking-widest text-xs uppercase text-ink/40 mb-2 text-center md:hidden">
            Урьдчилан харах
          </p>
          <LivePreview shapeId={selectedShape} wrappingId={selected} />
        </div>
      </div>

      <WizardNav
        onNext={onNext}
        onPrev={onPrev}
        nextDisabled={!canProceed}
        nextLabel="Туузаа сонгох →"
      />
    </div>
  )
}
