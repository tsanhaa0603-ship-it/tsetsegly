import WizardNav from './WizardNav'

const FLOWERS = [
  { id: 'rose',        emoji: '🌹', name: 'Сарнай',      price: 25000, hint: 'Хайр дурлалын бэлэг' },
  { id: 'chrysan',     emoji: '🌸', name: 'Хризантем',   price: 15000, hint: 'Цэвэр, нарийн гоо' },
  { id: 'tulip',       emoji: '🌷', name: 'Лали',         price: 20000, hint: 'Хавар, шинэ эхлэл' },
  { id: 'sunflower',   emoji: '🌻', name: 'Наранцэцэг',  price: 18000, hint: 'Баяр хөөр, эрч хүч' },
  { id: 'orchid',      emoji: '💜', name: 'Орхидей',      price: 35000, hint: 'Тансаг, ховор гоо' },
  { id: 'peony',       emoji: '🌺', name: 'Пеони',        price: 30000, hint: 'Элбэг дэлбэг аз жаргал' },
]

function fmt(n) {
  return '₮' + n.toLocaleString('mn-MN')
}

export default function Step1Flowers({ selected, onChange, onNext }) {
  const totalSelected = Object.values(selected).reduce((a, b) => a + b, 0)

  function adjust(id, delta) {
    const current = selected[id] || 0
    const next = Math.max(0, current + delta)
    const updated = { ...selected }
    if (next === 0) delete updated[id]
    else updated[id] = next
    onChange(updated)
  }

  const canProceed = totalSelected > 0

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-playfair italic text-2xl text-ink">Цэцэг сонгох</h2>
          <p className="font-cormorant text-ink/50 mt-0.5">Хүссэн цэцгүүдээ нэмнэ үү</p>
        </div>
        {totalSelected > 0 && (
          <div
            className="px-4 py-1.5 rounded-full font-cormorant text-sm text-ink flex items-center gap-1.5"
            style={{ background: 'linear-gradient(135deg, #F4EBD3, #C9A961)' }}
          >
            <span className="text-base">🌸</span>
            <span className="font-medium">{totalSelected} цэцэг</span>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {FLOWERS.map((f) => {
          const qty = selected[f.id] || 0
          const picked = qty > 0

          return (
            <div
              key={f.id}
              className={`relative rounded-2xl border transition-all duration-200 overflow-hidden group ${
                picked
                  ? 'border-gold-mid shadow-md shadow-gold-mid/20'
                  : 'border-gold-light/60 hover:border-gold-mid/60'
              }`}
              style={{ background: picked ? 'linear-gradient(160deg, #FFFDF8, #FEF6E4)' : '#FDFAF4' }}
            >
              {/* Qty badge */}
              {picked && (
                <div
                  className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-cormorant font-bold text-ink z-10"
                  style={{ background: 'linear-gradient(135deg, #F4EBD3, #C9A961)' }}
                >
                  {qty}
                </div>
              )}

              {/* Emoji */}
              <div className="text-5xl text-center pt-6 pb-2 select-none">{f.emoji}</div>

              {/* Info */}
              <div className="px-3 pb-2 text-center">
                <p className="font-playfair text-base text-ink">{f.name}</p>
                <p className="font-cormorant text-xs text-ink/40 mt-0.5">{f.hint}</p>
                <p
                  className="font-cormorant text-sm font-medium mt-1"
                  style={{ color: '#8A6E2F' }}
                >
                  {fmt(f.price)}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 pb-4 mt-1">
                {picked ? (
                  <>
                    <button
                      onClick={() => adjust(f.id, -1)}
                      className="w-7 h-7 rounded-full border border-gold-mid/60 text-gold-dark font-playfair text-lg leading-none flex items-center justify-center hover:bg-gold-light/50 transition-colors"
                    >
                      −
                    </button>
                    <span className="font-cormorant text-base text-ink w-4 text-center">{qty}</span>
                    <button
                      onClick={() => adjust(f.id, +1)}
                      className="w-7 h-7 rounded-full text-cream flex items-center justify-center text-lg leading-none transition-opacity hover:opacity-80"
                      style={{ background: 'linear-gradient(135deg, #C9A961, #8A6E2F)' }}
                    >
                      +
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => adjust(f.id, +1)}
                    className="font-cormorant text-xs tracking-widest uppercase text-gold-dark/70 hover:text-gold-dark border-b border-gold-mid/40 pb-0.5 transition-colors"
                  >
                    Нэмэх
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Total cost preview */}
      {totalSelected > 0 && (
        <div className="mt-6 p-4 rounded-xl border border-gold-light/80 bg-gradient-to-r from-gold-light/30 to-transparent flex items-center justify-between">
          <span className="font-cormorant text-ink/60">Цэцгийн үнэ нийт:</span>
          <span className="font-playfair text-lg text-ink">
            {fmt(
              FLOWERS.reduce((sum, f) => sum + (selected[f.id] || 0) * f.price, 0)
            )}
          </span>
        </div>
      )}

      <WizardNav onNext={onNext} nextDisabled={!canProceed} nextLabel="Боолт сонгох →" />
    </div>
  )
}

export { FLOWERS }
