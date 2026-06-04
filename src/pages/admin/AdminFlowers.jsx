import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { fetchFlowers, updateFlowerType, clearToken, getToken } from '../../lib/api'

const PRESET_HEX = ['#C0392B', '#EFA0B8', '#FBF7EF', '#F2CB4D', '#B9A4D4', '#7D5BA6', '#E8843C']

function FlowerEditor({ flower, onSaved }) {
  const [colors, setColors] = useState(flower.colors.map((c) => ({ ...c })))
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  function setColor(i, field, value) {
    setColors((cs) => cs.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)))
    setMsg('')
  }
  function removeColor(i) {
    setColors((cs) => cs.filter((_, idx) => idx !== i))
    setMsg('')
  }
  function addColor() {
    setColors((cs) => [...cs, { key: `color${cs.length + 1}_${Date.now().toString(36)}`, name: '', hex: '#C9A961', price: 0 }])
    setMsg('')
  }

  async function save() {
    setSaving(true)
    setMsg('')
    try {
      const clean = colors
        .filter((c) => c.name.trim())
        .map((c) => ({ key: c.key, name: c.name.trim(), hex: c.hex, price: Number(c.price) || 0 }))
      const updated = await updateFlowerType(flower.key, { colors: clean })
      onSaved(updated)
      setMsg('✓ Хадгалагдлаа')
      setTimeout(() => setMsg(''), 2000)
    } catch (e) {
      setMsg('⚠ ' + (e.message || 'Алдаа'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-2xl border border-gold-mid/15 p-5" style={{ background: 'linear-gradient(160deg, #232323, #1A1A1A)' }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{flower.emoji}</span>
        <h3 className="font-playfair italic text-xl text-cream">{flower.name}</h3>
        <span className="font-cormorant text-sm text-cream/35">({colors.length} өнгө)</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {colors.map((c, i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-xl border border-gold-mid/15 bg-black/30 px-3 py-2.5">
            {/* Color swatch + picker */}
            <label className="relative flex-shrink-0 cursor-pointer">
              <span className="block w-8 h-8 rounded-full border border-white/20" style={{ background: c.hex }} />
              <input
                type="color"
                value={/^#[0-9a-f]{6}$/i.test(c.hex) ? c.hex : '#C9A961'}
                onChange={(e) => setColor(i, 'hex', e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
            {/* Name */}
            <input
              type="text"
              value={c.name}
              onChange={(e) => setColor(i, 'name', e.target.value)}
              placeholder="Өнгөний нэр"
              className="flex-1 min-w-0 rounded-lg border border-gold-mid/15 bg-black/40 text-cream font-cormorant text-sm px-3 py-1.5 focus:outline-none focus:border-gold-mid"
            />
            {/* Price */}
            <div className="flex items-center gap-1">
              <span className="font-cormorant text-cream/40 text-sm">₮</span>
              <input
                type="number"
                value={c.price}
                onChange={(e) => setColor(i, 'price', e.target.value)}
                className="w-24 rounded-lg border border-gold-mid/15 bg-black/40 text-gold-mid font-cormorant text-sm px-2 py-1.5 focus:outline-none focus:border-gold-mid"
              />
            </div>
            {/* Remove */}
            <button
              onClick={() => removeColor(i)}
              className="flex-shrink-0 w-7 h-7 rounded-full border border-red-500/30 text-red-400/70 hover:bg-red-500/10 transition-colors text-sm"
              aria-label="Устгах"
            >✕</button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={addColor}
          className="font-cormorant text-sm tracking-wide uppercase text-gold-mid border border-gold-mid/30 rounded-lg px-3 py-1.5 hover:bg-gold-mid/10 transition-colors"
        >+ Өнгө нэмэх</button>
        <button
          onClick={save}
          disabled={saving}
          className={`font-cormorant text-sm tracking-wide uppercase text-ink rounded-lg px-5 py-1.5 transition-opacity ${saving ? 'opacity-60' : 'hover:opacity-85'}`}
          style={{ background: 'linear-gradient(135deg, #C9A961, #8A6E2F)' }}
        >{saving ? 'Хадгалж…' : 'Хадгалах'}</button>
        {msg && <span className="font-cormorant text-sm text-cream/60">{msg}</span>}
      </div>

      {/* Preset hint */}
      <div className="flex items-center gap-1.5 mt-3">
        <span className="font-cormorant text-xs text-cream/30">Түргэн өнгө:</span>
        {PRESET_HEX.map((h) => (
          <span key={h} className="w-4 h-4 rounded-full border border-white/15" style={{ background: h }} title={h} />
        ))}
      </div>
    </div>
  )
}

export default function AdminFlowers() {
  const navigate = useNavigate()
  const [catalog, setCatalog] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!getToken()) { navigate('/admin/login', { replace: true }); return }
    let active = true
    fetchFlowers()
      .then((c) => { if (active) setCatalog(c) })
      .catch(() => { if (active) setError('Каталог татахад алдаа гарлаа') })
    return () => { active = false }
  }, [navigate])

  function handleSaved(updated) {
    setCatalog((prev) => prev.map((f) => (f.key === updated.key ? updated : f)))
  }

  function logout() {
    clearToken()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen" style={{ background: '#161616', color: '#F5EFE0' }}>
      <header className="border-b border-gold-mid/15 sticky top-0 z-20 backdrop-blur-sm" style={{ background: 'rgba(22,22,22,0.9)' }}>
        <div className="max-w-4xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span className="font-playfair italic text-2xl" style={{
              background: 'linear-gradient(135deg, #F4EBD3, #C9A961, #8A6E2F)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Tsetsegly</span>
            <span className="font-cormorant tracking-[0.3em] text-xs uppercase text-cream/40">Каталог</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin" className="font-cormorant text-sm tracking-widest uppercase text-cream/50 hover:text-cream transition-colors">← Захиалга</Link>
            <button onClick={logout} className="font-cormorant text-sm tracking-widest uppercase text-cream/50 hover:text-cream border border-gold-mid/25 rounded-lg px-4 py-1.5 transition-colors">Гарах</button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-8">
        <div className="mb-6">
          <h1 className="font-playfair italic text-3xl text-cream">Цэцгийн каталог</h1>
          <p className="font-cormorant text-cream/45 mt-1">Цэцэг бүрийн өнгө, үнийг нэмэх / хасах / тохируулах</p>
        </div>

        {error ? (
          <div className="text-center py-16 font-cormorant text-red-400">⚠ {error}</div>
        ) : !catalog ? (
          <div className="text-center py-16 font-cormorant text-cream/40 animate-pulse">Уншиж байна…</div>
        ) : (
          <div className="flex flex-col gap-5">
            {catalog.map((f) => (
              <FlowerEditor key={f.key} flower={f} onSaved={handleSaved} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
