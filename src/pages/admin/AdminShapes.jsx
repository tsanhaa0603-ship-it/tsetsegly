import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  fetchAllShapes, createShape, updateShape, deleteShape,
  clearToken, getToken, AuthError,
} from '../../lib/api'
import { ShapeSVG, SHAPE_DESIGNS } from '../../components/builder/BouquetShapes'

const EMPTY = { id: '', design: 'round', name: '', desc: '', en: '', active: true, order: 0 }
const inputCls = 'w-full rounded-lg border border-gold-mid/20 bg-black/40 text-cream font-cormorant text-base px-3 py-2 focus:outline-none focus:border-gold-mid placeholder-cream/25'

/* Нэмэх / засах маягт */
function ShapeForm({ initial, isNew, onSave, onCancel }) {
  const [f, setF] = useState({ ...EMPTY, ...initial })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const set = (k, v) => { setF((p) => ({ ...p, [k]: v })); setErr('') }

  async function submit() {
    if (!f.name.trim()) { setErr('Нэр оруулна уу'); return }
    if (isNew && !f.id.trim()) { setErr('id оруулна уу (жишээ: heart1)'); return }
    setSaving(true)
    try {
      await onSave({ ...f, order: Number(f.order) || 0 })
    } catch (e) {
      setErr(e.message || 'Алдаа гарлаа')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-2xl border border-gold-mid/30 p-5 mb-4" style={{ background: 'linear-gradient(160deg, #2A2A2A, #1A1A1A)' }}>
      <div className="flex gap-5 mb-4">
        {/* Урьдчилан харах */}
        <div className="flex-shrink-0 text-center">
          <div className="w-28 h-36 rounded-xl border border-gold-mid/20 flex items-center justify-center" style={{ background: '#1F1F1F' }}>
            <ShapeSVG design={f.design} bloom="#DDACAB" wrap="#EFE5D0" ribbon="#C9A961" style={{ width: 84, height: 105 }} />
          </div>
          <p className="font-cormorant text-xs text-cream/35 mt-1.5">Урьдчилан харах</p>
        </div>

        <div className="flex-1 grid sm:grid-cols-2 gap-3">
          {isNew && (
            <div>
              <label className="font-cormorant text-sm text-cream/50 mb-1 block">id (латинаар, давхардахгүй)</label>
              <input className={inputCls} value={f.id} onChange={(e) => set('id', e.target.value.trim())} placeholder="heart1" />
            </div>
          )}
          <div>
            <label className="font-cormorant text-sm text-cream/50 mb-1 block">Нэр</label>
            <input className={inputCls} value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Бөөрөнхий" />
          </div>
          <div>
            <label className="font-cormorant text-sm text-cream/50 mb-1 block">SVG загвар</label>
            <select className={inputCls} value={f.design} onChange={(e) => set('design', e.target.value)}>
              {SHAPE_DESIGNS.map((d) => (
                <option key={d.key} value={d.key} style={{ background: '#1A1A1A' }}>{d.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-cormorant text-sm text-cream/50 mb-1 block">Англи нэр</label>
            <input className={inputCls} value={f.en} onChange={(e) => set('en', e.target.value)} placeholder="Round bouquet" />
          </div>
          <div>
            <label className="font-cormorant text-sm text-cream/50 mb-1 block">Дараалал</label>
            <input type="number" className={inputCls} value={f.order} onChange={(e) => set('order', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="font-cormorant text-sm text-cream/50 mb-1 block">Товч тайлбар</label>
            <input className={inputCls} value={f.desc} onChange={(e) => set('desc', e.target.value)} placeholder="Сонгодог дугариг хэлбэр" />
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

export default function AdminShapes() {
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
    try { setList(await fetchAllShapes()) }
    catch (err) { if (!guard(err)) setError(err.message || 'Алдаа') }
  }

  useEffect(() => {
    if (!getToken()) { navigate('/admin/login', { replace: true }); return }
    let active = true
    ;(async () => {
      try {
        const data = await fetchAllShapes()
        if (active) setList(data)
      } catch (err) {
        if (active && !guard(err)) setError(err.message || 'Алдаа')
      }
    })()
    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleCreate(f) { await createShape(f); setAdding(false); load() }
  async function handleUpdate(mongoId, f) { await updateShape(mongoId, f); setEditId(null); load() }
  async function toggleActive(s) {
    try { await updateShape(s._id, { active: !s.active }); load() } catch (e) { guard(e) }
  }
  async function handleDelete(s) {
    if (!window.confirm(`"${s.name}" хэлбэрийг устгах уу?`)) return
    try { await deleteShape(s._id); load() } catch (e) { guard(e) }
  }

  return (
    <div className="min-h-screen" style={{ background: '#161616', color: '#F5EFE0' }}>
      <header className="border-b border-gold-mid/15 sticky top-0 z-20 backdrop-blur-sm" style={{ background: 'rgba(22,22,22,0.9)' }}>
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span className="font-playfair italic text-2xl" style={{
              background: 'linear-gradient(135deg, #F4EBD3, #C9A961, #8A6E2F)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Tsetsegly</span>
            <span className="font-cormorant tracking-[0.3em] text-xs uppercase text-cream/40">Хэлбэр</span>
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
            <h1 className="font-playfair italic text-3xl text-cream">Баглааны хэлбэр</h1>
            <p className="font-cormorant text-cream/45 mt-1">
              {list ? `${list.length} хэлбэр` : 'Уншиж байна…'} — нэр, тайлбар, SVG загварыг засна
            </p>
          </div>
          {!adding && (
            <button onClick={() => { setAdding(true); setEditId(null) }}
              className="font-cormorant text-sm tracking-wide uppercase text-ink rounded-lg px-5 py-2 hover:opacity-85 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #C9A961, #8A6E2F)' }}>
              + Шинэ хэлбэр
            </button>
          )}
        </div>

        {adding && <ShapeForm isNew initial={EMPTY} onSave={handleCreate} onCancel={() => setAdding(false)} />}

        {error ? (
          <div className="text-center py-16 font-cormorant text-red-400">⚠ {error}</div>
        ) : !list ? (
          <div className="text-center py-16 font-cormorant text-cream/40 animate-pulse">Уншиж байна…</div>
        ) : list.length === 0 ? (
          <div className="text-center py-16 font-cormorant text-cream/40">Хэлбэр алга байна.</div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {list.map((s) => (
              editId === s._id ? (
                <div key={s._id} className="sm:col-span-2">
                  <ShapeForm initial={s} onSave={(f) => handleUpdate(s._id, f)} onCancel={() => setEditId(null)} />
                </div>
              ) : (
                <div key={s._id}
                  className={`rounded-2xl border p-3 flex items-center gap-4 ${s.active ? 'border-gold-mid/20' : 'border-cream/10 opacity-50'}`}
                  style={{ background: 'linear-gradient(160deg, #232323, #1A1A1A)' }}>
                  <div className="w-16 h-20 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: '#1F1F1F' }}>
                    <ShapeSVG id={s.id} design={s.design} bloom="#DDACAB" wrap="#EFE5D0" ribbon="#C9A961" style={{ width: 52, height: 65 }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-playfair text-base text-cream truncate">{s.name}</p>
                      {!s.active && <span className="font-cormorant text-[10px] text-cream/40 border border-cream/20 rounded-full px-1.5 flex-shrink-0">идэвхгүй</span>}
                    </div>
                    <p className="font-cormorant text-xs text-cream/45 truncate">{s.desc}</p>
                    <p className="font-cormorant text-xs text-gold-mid/70 mt-0.5">{s.en}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <button onClick={() => { setEditId(s._id); setAdding(false) }}
                      className="font-cormorant text-xs tracking-wide uppercase text-gold-mid border border-gold-mid/30 rounded-lg px-2.5 py-1 hover:bg-gold-mid/10">Засах</button>
                    <button onClick={() => toggleActive(s)}
                      className="font-cormorant text-xs tracking-wide uppercase text-cream/55 border border-gold-mid/20 rounded-lg px-2.5 py-1 hover:bg-gold-mid/10">
                      {s.active ? 'Нуух' : 'Гаргах'}
                    </button>
                    <button onClick={() => handleDelete(s)}
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
