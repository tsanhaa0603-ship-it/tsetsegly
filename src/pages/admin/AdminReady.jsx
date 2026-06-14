import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  fetchAllReadyBouquets, createReadyBouquet, updateReadyBouquet, deleteReadyBouquet,
  clearToken, getToken, AuthError,
} from '../../lib/api'

function fmt(n) {
  return '₮' + Number(n || 0).toLocaleString('mn-MN')
}

const EMPTY = { name: '', contents: '', price: 0, image: '', active: true }

function BouquetForm({ initial, onSave, onCancel }) {
  const [f, setF] = useState({ ...EMPTY, ...initial })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }))

  async function submit() {
    if (!f.name.trim()) return
    setSaving(true)
    try { await onSave(f) } finally { setSaving(false) }
  }

  const inputCls = 'w-full rounded-lg border border-gold-mid/20 bg-black/40 text-cream font-cormorant text-base px-3 py-2 focus:outline-none focus:border-gold-mid placeholder-cream/25'

  return (
    <div className="rounded-2xl border border-gold-mid/25 p-5 mb-5" style={{ background: 'linear-gradient(160deg, #2A2A2A, #1A1A1A)' }}>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="font-cormorant text-sm text-cream/50 mb-1 block">Нэр</label>
          <input className={inputCls} value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Баглааны нэр" />
        </div>
        <div>
          <label className="font-cormorant text-sm text-cream/50 mb-1 block">Үнэ (₮)</label>
          <input type="number" className={inputCls} value={f.price} onChange={(e) => set('price', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="font-cormorant text-sm text-cream/50 mb-1 block">Агуулга</label>
          <input className={inputCls} value={f.contents} onChange={(e) => set('contents', e.target.value)} placeholder="Жишээ: 5 улаан сарнай, 3 пеони, крем боолт" />
        </div>
        <div className="sm:col-span-2">
          <label className="font-cormorant text-sm text-cream/50 mb-1 block">Зургийн URL</label>
          <input className={inputCls} value={f.image} onChange={(e) => set('image', e.target.value)} placeholder="/flowers/rose-red.png" />
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <label className="flex items-center gap-2 cursor-pointer font-cormorant text-cream/70">
          <input type="checkbox" checked={f.active} onChange={(e) => set('active', e.target.checked)} className="w-4 h-4 accent-amber-600" />
          Идэвхтэй
        </label>
        <div className="flex-1" />
        <button onClick={onCancel} className="font-cormorant text-sm tracking-wide uppercase text-cream/50 hover:text-cream px-3 py-1.5">Болих</button>
        <button onClick={submit} disabled={saving} className="font-cormorant text-sm tracking-wide uppercase text-ink rounded-lg px-5 py-1.5 hover:opacity-85"
          style={{ background: 'linear-gradient(135deg, #C9A961, #8A6E2F)' }}>
          {saving ? 'Хадгалж…' : 'Хадгалах'}
        </button>
      </div>
      <p className="font-cormorant text-xs text-cream/30 mt-3">
        💡 Цэцэг/боолт/туузаа тохиргоо (preset) нь жишээ баглаанд урьдчилан суулгасан. Шинэ баглаанд preset хоосон бол configurator-т зөвхөн алхам 3 руу шилжинэ.
      </p>
    </div>
  )
}

export default function AdminReady() {
  const navigate = useNavigate()
  const [list, setList] = useState(null)
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState(null)

  function guard(err) {
    if (err instanceof AuthError) { navigate('/admin/login', { replace: true }); return true }
    return false
  }

  async function load() {
    try {
      const data = await fetchAllReadyBouquets()
      setList(data)
    } catch (err) {
      if (!guard(err)) setError(err.message || 'Алдаа')
    }
  }

  useEffect(() => {
    if (!getToken()) { navigate('/admin/login', { replace: true }); return }
    let active = true
    ;(async () => {
      try {
        const data = await fetchAllReadyBouquets()
        if (active) setList(data)
      } catch (err) {
        if (active && !guard(err)) setError(err.message || 'Алдаа')
      }
    })()
    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleCreate(f) {
    try {
      await createReadyBouquet({ ...f, price: Number(f.price) || 0 })
      setAdding(false)
      load()
    } catch (err) { guard(err) }
  }
  async function handleUpdate(id, f) {
    try {
      await updateReadyBouquet(id, { ...f, price: Number(f.price) || 0 })
      setEditId(null)
      load()
    } catch (err) { guard(err) }
  }
  async function toggleActive(b) {
    try {
      await updateReadyBouquet(b._id, { active: !b.active })
      load()
    } catch (err) { guard(err) }
  }
  async function handleDelete(b) {
    if (!window.confirm(`"${b.name}" баглааг устгах уу?`)) return
    try {
      await deleteReadyBouquet(b._id)
      load()
    } catch (err) { guard(err) }
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
            <span className="font-cormorant tracking-[0.3em] text-xs uppercase text-cream/40">Бэлэн баглаа</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin" className="font-cormorant text-sm tracking-widest uppercase text-cream/50 hover:text-cream transition-colors">← Захиалга</Link>
            <button onClick={() => { clearToken(); navigate('/admin/login', { replace: true }) }} className="font-cormorant text-sm tracking-widest uppercase text-cream/50 hover:text-cream border border-gold-mid/25 rounded-lg px-4 py-1.5 transition-colors">Гарах</button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-playfair italic text-3xl text-cream">Бэлэн баглаа</h1>
            <p className="font-cormorant text-cream/45 mt-1">Бэлэн баглаа нэмэх, засах, идэвхжүүлэх</p>
          </div>
          {!adding && (
            <button onClick={() => { setAdding(true); setEditId(null) }} className="font-cormorant text-sm tracking-wide uppercase text-ink rounded-lg px-5 py-2 hover:opacity-85"
              style={{ background: 'linear-gradient(135deg, #C9A961, #8A6E2F)' }}>
              + Шинэ баглаа
            </button>
          )}
        </div>

        {adding && <BouquetForm onSave={handleCreate} onCancel={() => setAdding(false)} />}

        {error ? (
          <div className="text-center py-16 font-cormorant text-red-400">⚠ {error}</div>
        ) : list === null ? (
          <div className="text-center py-16 font-cormorant text-cream/40 animate-pulse">Уншиж байна…</div>
        ) : list.length === 0 ? (
          <div className="text-center py-16 font-cormorant text-cream/40">Бэлэн баглаа алга байна.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {list.map((b) => (
              editId === b._id ? (
                <BouquetForm key={b._id} initial={b} onSave={(f) => handleUpdate(b._id, f)} onCancel={() => setEditId(null)} />
              ) : (
                <div key={b._id} className={`rounded-2xl border p-4 flex items-center gap-4 ${b.active ? 'border-gold-mid/20' : 'border-cream/10 opacity-55'}`}
                  style={{ background: 'linear-gradient(160deg, #232323, #1A1A1A)' }}>
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ background: '#2A2A2A' }}>
                    {b.image ? <img src={b.image} alt={b.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">💐</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-playfair text-lg text-cream">{b.name}</p>
                      {!b.active && <span className="font-cormorant text-xs text-cream/40 border border-cream/20 rounded-full px-2">идэвхгүй</span>}
                    </div>
                    <p className="font-cormorant text-sm text-cream/50 truncate">{b.contents}</p>
                    <p className="font-cormorant text-base text-gold-mid mt-0.5">{fmt(b.price)}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">
                    <button onClick={() => toggleActive(b)} className="font-cormorant text-xs tracking-wide uppercase text-cream/60 border border-gold-mid/25 rounded-lg px-3 py-1.5 hover:bg-gold-mid/10">
                      {b.active ? 'Идэвхгүй болгох' : 'Идэвхжүүлэх'}
                    </button>
                    <button onClick={() => { setEditId(b._id); setAdding(false) }} className="font-cormorant text-xs tracking-wide uppercase text-gold-mid border border-gold-mid/30 rounded-lg px-3 py-1.5 hover:bg-gold-mid/10">Засах</button>
                    <button onClick={() => handleDelete(b)} className="font-cormorant text-xs tracking-wide uppercase text-red-400/70 border border-red-500/25 rounded-lg px-3 py-1.5 hover:bg-red-500/10">Устгах</button>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
