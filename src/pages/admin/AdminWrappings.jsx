import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  fetchAllWrappings, createWrapping, updateWrapping, deleteWrapping,
  clearToken, getToken, AuthError,
} from '../../lib/api'
import { WRAP_CATEGORIES } from '../../lib/wrappings'

function fmt(n) {
  return '₮' + Number(n || 0).toLocaleString('mn-MN')
}

const EMPTY = { id: '', name: '', desc: '', price: 5000, category: 'matte', image: '', dot: '#C9A961', svgWrap: '#EFE5D0', active: true, order: 0 }

const inputCls = 'w-full rounded-lg border border-gold-mid/20 bg-black/40 text-cream font-cormorant text-base px-3 py-2 focus:outline-none focus:border-gold-mid placeholder-cream/25'

/* Нэмэх / засах маягт */
function WrapForm({ initial, isNew, onSave, onCancel }) {
  const [f, setF] = useState({ ...EMPTY, ...initial })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const set = (k, v) => { setF((p) => ({ ...p, [k]: v })); setErr('') }

  async function submit() {
    if (!f.name.trim()) { setErr('Нэр оруулна уу'); return }
    if (isNew && !f.id.trim()) { setErr('id оруулна уу (жишээ: myWrap1)'); return }
    setSaving(true)
    try {
      await onSave({ ...f, price: Number(f.price) || 0, order: Number(f.order) || 0 })
    } catch (e) {
      setErr(e.message || 'Алдаа гарлаа')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-2xl border border-gold-mid/30 p-5 mb-4" style={{ background: 'linear-gradient(160deg, #2A2A2A, #1A1A1A)' }}>
      <div className="flex gap-4 mb-4">
        {/* Зургийн урьдчилан харах */}
        <div className="w-28 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-gold-mid/20" style={{ background: f.dot }}>
          {f.image && <img src={f.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />}
        </div>

        <div className="flex-1 grid sm:grid-cols-2 gap-3">
          {isNew && (
            <div>
              <label className="font-cormorant text-sm text-cream/50 mb-1 block">id (латинаар, давхардахгүй)</label>
              <input className={inputCls} value={f.id} onChange={(e) => set('id', e.target.value.trim())} placeholder="myWrap1" />
            </div>
          )}
          <div>
            <label className="font-cormorant text-sm text-cream/50 mb-1 block">Нэр</label>
            <input className={inputCls} value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Боолтын нэр" />
          </div>
          <div>
            <label className="font-cormorant text-sm text-cream/50 mb-1 block">Үнэ (₮)</label>
            <input type="number" className={inputCls} value={f.price} onChange={(e) => set('price', e.target.value)} />
          </div>
          <div>
            <label className="font-cormorant text-sm text-cream/50 mb-1 block">Ангилал</label>
            <select className={inputCls} value={f.category} onChange={(e) => set('category', e.target.value)}>
              {WRAP_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key} style={{ background: '#1A1A1A' }}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-cormorant text-sm text-cream/50 mb-1 block">Дараалал</label>
            <input type="number" className={inputCls} value={f.order} onChange={(e) => set('order', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="font-cormorant text-sm text-cream/50 mb-1 block">Товч тайлбар</label>
            <input className={inputCls} value={f.desc} onChange={(e) => set('desc', e.target.value)} placeholder="Жишээ: Цэвэр, дэгжин" />
          </div>
          <div className="sm:col-span-2">
            <label className="font-cormorant text-sm text-cream/50 mb-1 block">Зургийн зам</label>
            <input className={inputCls} value={f.image} onChange={(e) => set('image', e.target.value)} placeholder="/wrappings/matte-cream.jpg" />
          </div>
          <div className="flex items-center gap-3">
            <label className="font-cormorant text-sm text-cream/50">Нөөц өнгө</label>
            <input type="color" value={/^#[0-9a-fA-F]{6}$/.test(f.dot) ? f.dot : '#C9A961'} onChange={(e) => set('dot', e.target.value)} className="w-10 h-8 rounded cursor-pointer bg-transparent" />
          </div>
          <div className="flex items-center gap-3">
            <label className="font-cormorant text-sm text-cream/50">Баглаа дээрх өнгө</label>
            <input type="color" value={/^#[0-9a-fA-F]{6}$/.test(f.svgWrap) ? f.svgWrap : '#EFE5D0'} onChange={(e) => set('svgWrap', e.target.value)} className="w-10 h-8 rounded cursor-pointer bg-transparent" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer font-cormorant text-cream/70">
          <input type="checkbox" checked={f.active} onChange={(e) => set('active', e.target.checked)} className="w-4 h-4 accent-amber-600" />
          Идэвхтэй
        </label>
        {err && <span className="font-cormorant text-sm text-red-400">⚠ {err}</span>}
        <div className="flex-1" />
        <button onClick={onCancel} className="font-cormorant text-sm tracking-wide uppercase text-cream/50 hover:text-cream px-3 py-1.5">Болих</button>
        <button onClick={submit} disabled={saving}
          className="font-cormorant text-sm tracking-wide uppercase text-ink rounded-lg px-5 py-1.5 hover:opacity-85"
          style={{ background: 'linear-gradient(135deg, #C9A961, #8A6E2F)' }}>
          {saving ? 'Хадгалж…' : 'Хадгалах'}
        </button>
      </div>
    </div>
  )
}

export default function AdminWrappings() {
  const navigate = useNavigate()
  const [list, setList] = useState(null)
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState(null)
  const [filter, setFilter] = useState('all')

  function guard(err) {
    if (err instanceof AuthError) { navigate('/admin/login', { replace: true }); return true }
    return false
  }

  async function load() {
    try {
      setList(await fetchAllWrappings())
    } catch (err) {
      if (!guard(err)) setError(err.message || 'Алдаа')
    }
  }

  useEffect(() => {
    if (!getToken()) { navigate('/admin/login', { replace: true }); return }
    let active = true
    ;(async () => {
      try {
        const data = await fetchAllWrappings()
        if (active) setList(data)
      } catch (err) {
        if (active && !guard(err)) setError(err.message || 'Алдаа')
      }
    })()
    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleCreate(f) {
    await createWrapping(f)
    setAdding(false)
    load()
  }
  async function handleUpdate(mongoId, f) {
    await updateWrapping(mongoId, f)
    setEditId(null)
    load()
  }
  async function toggleActive(w) {
    try { await updateWrapping(w._id, { active: !w.active }); load() } catch (e) { guard(e) }
  }
  async function handleDelete(w) {
    if (!window.confirm(`"${w.name}" боолтыг устгах уу?`)) return
    try { await deleteWrapping(w._id); load() } catch (e) { guard(e) }
  }

  const visible = list && (filter === 'all' ? list : list.filter((w) => w.category === filter))

  return (
    <div className="min-h-screen" style={{ background: '#161616', color: '#F5EFE0' }}>
      <header className="border-b border-gold-mid/15 sticky top-0 z-20 backdrop-blur-sm" style={{ background: 'rgba(22,22,22,0.9)' }}>
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span className="font-playfair italic text-2xl" style={{
              background: 'linear-gradient(135deg, #F4EBD3, #C9A961, #8A6E2F)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Tsetsegly</span>
            <span className="font-cormorant tracking-[0.3em] text-xs uppercase text-cream/40">Боолт</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin" className="font-cormorant text-sm tracking-widest uppercase text-cream/50 hover:text-cream transition-colors">← Захиалга</Link>
            <button onClick={() => { clearToken(); navigate('/admin/login', { replace: true }) }}
              className="font-cormorant text-sm tracking-widest uppercase text-cream/50 hover:text-cream border border-gold-mid/25 rounded-lg px-4 py-1.5 transition-colors">Гарах</button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-8">
        <div className="flex items-center justify-between mb-5 gap-3">
          <div>
            <h1 className="font-playfair italic text-3xl text-cream">Боолтын цаас</h1>
            <p className="font-cormorant text-cream/45 mt-1">
              {list ? `${list.length} боолт` : 'Уншиж байна…'} — нэр, үнэ, зураг, ангиллыг засна
            </p>
          </div>
          {!adding && (
            <button onClick={() => { setAdding(true); setEditId(null) }}
              className="font-cormorant text-sm tracking-wide uppercase text-ink rounded-lg px-5 py-2 hover:opacity-85 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #C9A961, #8A6E2F)' }}>
              + Шинэ боолт
            </button>
          )}
        </div>

        {adding && <WrapForm isNew initial={EMPTY} onSave={handleCreate} onCancel={() => setAdding(false)} />}

        {/* Ангиллын шүүлт */}
        {list && (
          <div className="flex flex-wrap gap-2 mb-5">
            {[{ key: 'all', label: 'Бүгд' }, ...WRAP_CATEGORIES].map((c) => {
              const n = c.key === 'all' ? list.length : list.filter((w) => w.category === c.key).length
              if (n === 0 && c.key !== 'all') return null
              const active = filter === c.key
              return (
                <button key={c.key} onClick={() => setFilter(c.key)}
                  className={`font-cormorant text-sm rounded-full px-3.5 py-1.5 transition-colors ${
                    active ? 'text-ink font-medium' : 'text-cream/60 border border-gold-mid/25 hover:text-cream'
                  }`}
                  style={active ? { background: 'linear-gradient(135deg, #F4EBD3, #C9A961)' } : undefined}>
                  {c.label} <span className="opacity-60 text-xs">{n}</span>
                </button>
              )
            })}
          </div>
        )}

        {error ? (
          <div className="text-center py-16 font-cormorant text-red-400">⚠ {error}</div>
        ) : !list ? (
          <div className="text-center py-16 font-cormorant text-cream/40 animate-pulse">Уншиж байна…</div>
        ) : visible.length === 0 ? (
          <div className="text-center py-16 font-cormorant text-cream/40">Энэ ангилалд боолт алга.</div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {visible.map((w) => (
              editId === w._id ? (
                <div key={w._id} className="sm:col-span-2">
                  <WrapForm initial={w} onSave={(f) => handleUpdate(w._id, f)} onCancel={() => setEditId(null)} />
                </div>
              ) : (
                <div key={w._id}
                  className={`rounded-2xl border p-3 flex items-center gap-3 ${w.active ? 'border-gold-mid/20' : 'border-cream/10 opacity-50'}`}
                  style={{ background: 'linear-gradient(160deg, #232323, #1A1A1A)' }}>
                  <div className="w-24 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ background: w.dot || '#2A2A2A' }}>
                    {w.image && <img src={w.image} alt={w.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-playfair text-base text-cream truncate">{w.name}</p>
                      {!w.active && <span className="font-cormorant text-[10px] text-cream/40 border border-cream/20 rounded-full px-1.5 flex-shrink-0">идэвхгүй</span>}
                    </div>
                    <p className="font-cormorant text-xs text-cream/45 truncate">{w.desc}</p>
                    <p className="font-cormorant text-sm text-gold-mid mt-0.5">{fmt(w.price)}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <button onClick={() => { setEditId(w._id); setAdding(false) }}
                      className="font-cormorant text-xs tracking-wide uppercase text-gold-mid border border-gold-mid/30 rounded-lg px-2.5 py-1 hover:bg-gold-mid/10">Засах</button>
                    <button onClick={() => toggleActive(w)}
                      className="font-cormorant text-xs tracking-wide uppercase text-cream/55 border border-gold-mid/20 rounded-lg px-2.5 py-1 hover:bg-gold-mid/10">
                      {w.active ? 'Нуух' : 'Гаргах'}
                    </button>
                    <button onClick={() => handleDelete(w)}
                      className="font-cormorant text-xs tracking-wide uppercase text-red-400/70 border border-red-500/25 rounded-lg px-2.5 py-1 hover:bg-red-500/10">Устгах</button>
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
