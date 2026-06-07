import { useState } from 'react'
import WizardNav from './WizardNav'
import { variantKey, flattenCatalog, calcTotal } from '../../lib/flowers'

function fmt(n) {
  return '₮' + Number(n).toLocaleString('mn-MN')
}

/* Цайвар өнгөнд хүрээ нэмэх эсэх */
function needsBorder(hex) {
  return /^#?(F|E)/i.test(hex || '')
}

export default function Step1Flowers({ catalog, selected, onChange, onNext }) {
  const [pickedKey, setPickedKey] = useState(null)
  // Идэвхтэй цэцэг: хэрэглэгч сонгоогүй бол эхний цэцэг (effect-гүйгээр derive)
  const activeKey = pickedKey || catalog?.[0]?.key || null
  const setActiveKey = setPickedKey

  const totalSelected = Object.values(selected).reduce((a, b) => a + b, 0)
  const grandTotal = calcTotal(selected, catalog)
  const flat = flattenCatalog(catalog)
  const active = catalog?.find((f) => f.key === activeKey)

  // тухайн цэцгийн төрлийн сонгогдсон тоо
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
          <p className="font-cormorant text-ink/50 mt-0.5">Төрөл сонгоод, өнгийг нь нэмнэ үү</p>
        </div>
        {totalSelected > 0 && (
          <div className="px-4 py-1.5 rounded-full font-cormorant text-sm text-ink flex items-center gap-1.5"
            style={{ background: 'linear-gradient(135deg, #F4EBD3, #C9A961)' }}>
            <span className="text-base">🌸</span>
            <span className="font-medium">{totalSelected} цэцэг</span>
          </div>
        )}
      </div>

      {/* Flower type cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-7">
        {catalog.map((f) => {
          const isActive = activeKey === f.key
          const cnt = typeCount(f.key)
          return (
            <button
              key={f.key}
              onClick={() => setActiveKey(f.key)}
              className={`relative rounded-2xl border transition-all duration-200 flex flex-col items-center pt-4 pb-3 ${
                isActive
                  ? 'border-gold-mid shadow-md shadow-gold-mid/20 scale-[1.03]'
                  : 'border-gold-light/60 hover:border-gold-mid/50'
              }`}
              style={{ background: isActive ? 'linear-gradient(160deg, #FFFDF8, #FEF6E4)' : '#FDFAF4' }}
            >
              {cnt > 0 && (
                <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-ink z-10"
                  style={{ background: 'linear-gradient(135deg, #F4EBD3, #C9A961)' }}>
                  {cnt}
                </span>
              )}
              {(() => {
                const img = f.colors?.find((c) => c.image)?.image
                return img ? (
                  <img src={img} alt={f.name} className="w-10 h-10 object-contain select-none" loading="lazy" />
                ) : (
                  <span className="text-3xl leading-none select-none">{f.emoji}</span>
                )
              })()}
              <span className={`font-playfair text-xs mt-1.5 text-center leading-tight ${isActive ? 'text-ink' : 'text-ink/60'}`}>
                {f.name}
              </span>
            </button>
          )
        })}
      </div>

      {/* Active flower's colors */}
      {active && (
        <div className="rounded-2xl border border-gold-light/70 p-5 mb-6"
          style={{ background: 'linear-gradient(160deg, #FFFDF8, #FAF7F2)' }}>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl">{active.emoji}</span>
            <h3 className="font-playfair italic text-xl text-ink">{active.name}</h3>
            <span className="font-cormorant text-sm text-ink/40">— өнгө сонгох</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {active.colors.map((c) => {
              const vKey = variantKey(active.key, c.key)
              const qty = selected[vKey] || 0
              const picked = qty > 0
              return (
                <div
                  key={c.key}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
                    picked ? 'border-gold-mid bg-gold-light/20' : 'border-gold-light/50'
                  }`}
                >
                  {/* Color image эсвэл тойрог */}
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="flex-shrink-0 w-10 h-10 rounded-lg object-cover shadow-sm" loading="lazy" />
                  ) : (
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full shadow-sm"
                      style={{
                        background: c.hex,
                        border: needsBorder(c.hex) ? '1px solid rgba(0,0,0,0.12)' : 'none',
                      }}
                    />
                  )}
                  {/* Name + price */}
                  <div className="flex-1 min-w-0">
                    <p className="font-cormorant text-base text-ink leading-tight">{c.name}</p>
                    <p className="font-cormorant text-xs" style={{ color: '#8A6E2F' }}>{fmt(c.price)}</p>
                  </div>
                  {/* Stepper */}
                  {picked ? (
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => adjust(vKey, -1)}
                        className="w-7 h-7 rounded-full border border-gold-mid/60 text-gold-dark font-playfair text-lg leading-none flex items-center justify-center hover:bg-gold-light/50 transition-colors"
                      >−</button>
                      <span className="font-cormorant text-base text-ink w-4 text-center">{qty}</span>
                      <button
                        onClick={() => adjust(vKey, +1)}
                        className="w-7 h-7 rounded-full text-cream flex items-center justify-center text-lg leading-none hover:opacity-80 transition-opacity"
                        style={{ background: 'linear-gradient(135deg, #C9A961, #8A6E2F)' }}
                      >+</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => adjust(vKey, +1)}
                      className="font-cormorant text-xs tracking-widest uppercase text-gold-dark/70 hover:text-gold-dark border-b border-gold-mid/40 pb-0.5 transition-colors"
                    >Нэмэх</button>
                  )}
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
                    <img src={m.image} alt={m.name} className="w-4 h-4 rounded-full object-cover" />
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
            <span className="font-playfair text-lg text-ink">{fmt(grandTotal)}</span>
          </div>
        </div>
      )}

      <WizardNav onNext={onNext} nextDisabled={totalSelected === 0} nextLabel="Боолт сонгох →" />
    </div>
  )
}
