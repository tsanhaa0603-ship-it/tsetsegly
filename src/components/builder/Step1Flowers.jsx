import { useState } from 'react'
import WizardNav from './WizardNav'
import { variantKey, flattenCatalog, calcTotal } from '../../lib/flowers'

function fmt(n) {
  return '₮' + Number(n).toLocaleString('mn-MN')
}

function needsBorder(hex) {
  return /^#?(F|E)/i.test(hex || '')
}

export default function Step1Flowers({ catalog, selected, onChange, onNext }) {
  const [pickedKey, setPickedKey] = useState(null)
  const activeKey = pickedKey || catalog?.[0]?.key || null
  const setActiveKey = setPickedKey

  const totalSelected = Object.values(selected).reduce((a, b) => a + b, 0)
  const grandTotal = calcTotal(selected, catalog)
  const flat = flattenCatalog(catalog)
  const active = catalog?.find((f) => f.key === activeKey)

  function typeCount(flowerKey) {
    return (catalog?.find((f) => f.key === flowerKey)?.colors || []).reduce(
      (sum, c) => sum + (selected[variantKey(flowerKey, c.key)] || 0),
      0
    )
  }

  function adjust(vKey, delta) {
    const cur = selected[vKey] || 0
    const next = Math.max(0, cur + delta)
    const updated = { ...selected }
    if (next === 0) delete updated[vKey]
    else updated[vKey] = next
    onChange(updated)
  }

  if (!catalog?.length) {
    return <div className="text-center py-16 font-cormorant text-ink/40 animate-pulse">Цэцгүүд ачааллаж байна…</div>
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-playfair italic text-2xl text-ink">Цэцэг сонгох</h2>
          <p className="font-cormorant text-ink/50 mt-0.5">Ангилал сонгоод, өнгийг нь сагсанд нэмнэ үү</p>
        </div>
        {totalSelected > 0 && (
          <div className="px-4 py-2 rounded-full font-cormorant text-base text-ink flex items-center gap-2 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #F4EBD3, #C9A961)' }}>
            <span className="text-lg">🌸</span>
            <span className="font-medium">{totalSelected} цэцэг</span>
          </div>
        )}
      </div>

      {/* ── Category tabs ── */}
      <div className="flex flex-wrap gap-2 mb-7">
        {catalog.map((f) => {
          const isActive = activeKey === f.key
          const cnt = typeCount(f.key)
          return (
            <button
              key={f.key}
              onClick={() => setActiveKey(f.key)}
              className={`relative flex items-center gap-2 rounded-full font-cormorant text-base px-4 py-2.5 transition-all duration-200 ${
                isActive
                  ? 'text-ink font-medium shadow-md scale-105'
                  : 'text-ink/60 bg-white/60 border border-gold-light/70 hover:border-gold-mid/60 hover:text-ink'
              }`}
              style={isActive ? { background: 'linear-gradient(135deg, #F4EBD3, #C9A961)' } : undefined}
            >
              <span className="text-lg leading-none">{f.emoji}</span>
              <span>{f.name}</span>
              {cnt > 0 && (
                <span className={`min-w-5 h-5 px-1 rounded-full flex items-center justify-center text-xs font-bold ${
                  isActive ? 'bg-ink/15 text-ink' : 'text-cream'
                }`}
                  style={!isActive ? { background: 'linear-gradient(135deg, #C9A961, #8A6E2F)' } : undefined}>
                  {cnt}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Active flower's color cards ── */}
      {active && (
        <div className="mb-7">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl">{active.emoji}</span>
            <h3 className="font-playfair italic text-2xl text-ink">{active.name}</h3>
            {active.hint && <span className="font-cormorant text-base text-ink/40">— {active.hint}</span>}
          </div>

          {/* Grid: mobile 2, tablet 3, desktop 4 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {active.colors.map((c) => {
              const vKey = variantKey(active.key, c.key)
              const qty = selected[vKey] || 0
              const picked = qty > 0
              return (
                <div
                  key={c.key}
                  className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                    picked
                      ? 'border-gold-mid shadow-lg shadow-gold-mid/25 ring-2 ring-gold-mid/30'
                      : 'border-gold-light/60 hover:border-gold-mid/70 shadow-sm'
                  }`}
                  style={{ background: picked ? 'linear-gradient(160deg, #FFFDF8, #FEF6E4)' : '#FFFFFF' }}
                >
                  {/* Image area (том) */}
                  <div className="relative aspect-square overflow-hidden" style={{ background: '#FAF7F2' }}>
                    {c.image ? (
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="w-16 h-16 rounded-full" style={{ background: c.hex, border: needsBorder(c.hex) ? '1px solid rgba(0,0,0,0.12)' : 'none' }} />
                      </div>
                    )}
                    {/* Qty badge */}
                    {picked && (
                      <div className="absolute top-2 right-2 min-w-7 h-7 px-1.5 rounded-full flex items-center justify-center text-sm font-bold text-cream shadow-md"
                        style={{ background: 'linear-gradient(135deg, #C9A961, #8A6E2F)' }}>
                        {qty}
                      </div>
                    )}
                    {/* Color dot */}
                    <span className="absolute top-2 left-2 w-4 h-4 rounded-full shadow-sm"
                      style={{ background: c.hex, border: '1.5px solid rgba(255,255,255,0.8)' }} />
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="font-playfair text-base text-ink leading-tight min-h-[2.5rem]">{c.name}</p>
                    <p className="font-cormorant text-lg font-medium mb-2.5" style={{ color: '#8A6E2F' }}>{fmt(c.price)}</p>

                    {/* Stepper / Add */}
                    {picked ? (
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => adjust(vKey, -1)}
                          className="w-9 h-9 rounded-full border-2 border-gold-mid/60 text-gold-dark font-playfair text-xl leading-none flex items-center justify-center hover:bg-gold-light/50 active:scale-95 transition-all"
                          aria-label="Хасах"
                        >−</button>
                        <span className="font-playfair text-xl text-ink font-medium w-8 text-center">{qty}</span>
                        <button
                          onClick={() => adjust(vKey, +1)}
                          className="w-9 h-9 rounded-full text-cream flex items-center justify-center text-xl leading-none hover:opacity-85 active:scale-95 transition-all shadow-sm"
                          style={{ background: 'linear-gradient(135deg, #C9A961, #8A6E2F)' }}
                          aria-label="Нэмэх"
                        >+</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => adjust(vKey, +1)}
                        className="w-full py-2 rounded-xl font-cormorant text-sm tracking-widest uppercase text-gold-dark border-2 border-gold-mid/40 hover:text-cream hover:border-transparent transition-all duration-200 relative overflow-hidden group/btn"
                      >
                        <span className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity"
                          style={{ background: 'linear-gradient(135deg, #C9A961, #8A6E2F)' }} />
                        <span className="relative">+ Нэмэх</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Selected summary */}
      {totalSelected > 0 && (
        <div className="rounded-xl border border-gold-light/80 p-4 mb-2 bg-gradient-to-r from-gold-light/30 to-transparent">
          <p className="font-cormorant tracking-widest text-xs uppercase text-ink/40 mb-2">Сонгосон цэцгүүд</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {Object.entries(selected).map(([vKey, qty]) => {
              const m = flat[vKey]
              if (!m) return null
              return (
                <span key={vKey} className="font-cormorant text-sm px-2.5 py-1 rounded-full bg-white/60 border border-gold-light/70 text-ink/75 flex items-center gap-1.5">
                  {m.image ? (
                    <img src={m.image} alt={m.name} className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <span className="w-3 h-3 rounded-full" style={{ background: m.hex, border: needsBorder(m.hex) ? '1px solid rgba(0,0,0,0.12)' : 'none' }} />
                  )}
                  {m.name} <span className="text-ink/40">×{qty}</span>
                </span>
              )
            })}
          </div>
          <div className="flex items-center justify-between border-t border-gold-light/60 pt-2.5">
            <span className="font-cormorant text-ink/60">Цэцгийн үнэ нийт:</span>
            <span className="font-playfair text-xl text-ink">{fmt(grandTotal)}</span>
          </div>
        </div>
      )}

      <WizardNav onNext={onNext} nextDisabled={totalSelected === 0} nextLabel="Боолт сонгох →" />
    </div>
  )
}
