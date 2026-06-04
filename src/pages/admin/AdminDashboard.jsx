import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { fetchOrders, updateOrderStatus, clearToken, AuthError } from '../../lib/api'
import { STATUSES, getStatus, formatTugrik, formatDate, isToday } from '../../lib/orderStatus'
import OrderDetailModal from '../../components/admin/OrderDetailModal'

/* ── Stat card ── */
function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-gold-mid/15 p-5" style={{ background: 'linear-gradient(160deg, #232323, #1A1A1A)' }}>
      <p className="font-cormorant text-sm text-cream/45 tracking-wide">{label}</p>
      <p className="font-playfair text-3xl mt-1" style={{ color: accent || '#F5EFE0' }}>{value}</p>
    </div>
  )
}

/* ── Status badge ── */
function StatusBadge({ status }) {
  const s = getStatus(status)
  return (
    <span
      className="inline-flex items-center gap-1.5 font-cormorant text-sm px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: `${s.color}1A`, color: s.color, border: `1px solid ${s.color}40` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
      {s.label}
    </span>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  // filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortDesc, setSortDesc] = useState(true)

  function logout() {
    clearToken()
    navigate('/admin/login', { replace: true })
  }

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const data = await fetchOrders()
        if (active) setOrders(data)
      } catch (err) {
        if (err instanceof AuthError) {
          navigate('/admin/login', { replace: true })
          return
        }
        if (active) setError(err.message || 'Алдаа гарлаа')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [navigate])

  async function handleStatusChange(id, status) {
    try {
      const updated = await updateOrderStatus(id, status)
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status: updated.status } : o)))
      setSelected((prev) => (prev && prev._id === id ? { ...prev, status: updated.status } : prev))
    } catch (err) {
      if (err instanceof AuthError) navigate('/admin/login', { replace: true })
    }
  }

  // ── Stats ──
  const stats = useMemo(() => ({
    total: orders.length,
    today: orders.filter((o) => isToday(o.createdAt)).length,
    revenue: orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0),
    fresh: orders.filter((o) => o.status === 'new').length,
  }), [orders])

  // ── Filtered + sorted ──
  const visible = useMemo(() => {
    let list = [...orders]
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (o) =>
          (o.customerName || '').toLowerCase().includes(q) ||
          (o.customerPhone || '').includes(q)
      )
    }
    if (statusFilter !== 'all') {
      list = list.filter((o) => o.status === statusFilter)
    }
    list.sort((a, b) => {
      const da = new Date(a.createdAt).getTime()
      const db = new Date(b.createdAt).getTime()
      return sortDesc ? db - da : da - db
    })
    return list
  }, [orders, search, statusFilter, sortDesc])

  return (
    <div className="min-h-screen" style={{ background: '#161616', color: '#F5EFE0' }}>
      {/* Header */}
      <header className="border-b border-gold-mid/15 sticky top-0 z-20 backdrop-blur-sm" style={{ background: 'rgba(22,22,22,0.9)' }}>
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span className="font-playfair italic text-2xl" style={{
              background: 'linear-gradient(135deg, #F4EBD3, #C9A961, #8A6E2F)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Tsetsegly</span>
            <span className="font-cormorant tracking-[0.3em] text-xs uppercase text-cream/40">Админ</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/flowers"
              className="font-cormorant text-sm tracking-widest uppercase text-cream/50 hover:text-cream transition-colors"
            >
              🌸 Каталог
            </Link>
            <button
              onClick={logout}
              className="font-cormorant text-sm tracking-widest uppercase text-cream/50 hover:text-cream border border-gold-mid/25 hover:border-gold-mid/50 rounded-lg px-4 py-1.5 transition-colors"
            >
              Гарах
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Нийт захиалга" value={stats.total} />
          <StatCard label="Өнөөдрийн захиалга" value={stats.today} accent="#3B82F6" />
          <StatCard label="Нийт орлого" value={formatTugrik(stats.revenue)} accent="#C9A961" />
          <StatCard label="Шинэ захиалга" value={stats.fresh} accent="#EAB308" />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Нэр эсвэл утсаар хайх…"
            className="flex-1 rounded-xl border border-gold-mid/20 bg-black/30 text-cream font-cormorant text-base px-4 py-2.5 placeholder-cream/25 focus:outline-none focus:border-gold-mid transition-colors"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gold-mid/20 bg-black/30 text-cream font-cormorant text-base px-4 py-2.5 focus:outline-none focus:border-gold-mid"
          >
            <option value="all" style={{ background: '#1A1A1A' }}>Бүх статус</option>
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id} style={{ background: '#1A1A1A' }}>{s.emoji} {s.label}</option>
            ))}
          </select>
          <button
            onClick={() => setSortDesc((v) => !v)}
            className="rounded-xl border border-gold-mid/20 bg-black/30 text-cream/70 font-cormorant text-base px-4 py-2.5 hover:border-gold-mid/50 transition-colors whitespace-nowrap"
          >
            Огноо {sortDesc ? '↓ Шинэ' : '↑ Хуучин'}
          </button>
        </div>

        {/* Table / states */}
        {loading ? (
          <div className="text-center py-20 font-cormorant text-cream/40 animate-pulse">Уншиж байна…</div>
        ) : error ? (
          <div className="text-center py-20 font-cormorant text-red-400">⚠ {error}</div>
        ) : visible.length === 0 ? (
          <div className="text-center py-20 font-cormorant text-cream/40">
            {orders.length === 0 ? 'Захиалга алга байна' : 'Хайлтад тохирох захиалга олдсонгүй'}
          </div>
        ) : (
          <div className="rounded-2xl border border-gold-mid/15 overflow-hidden" style={{ background: '#1C1C1C' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gold-mid/15 font-cormorant text-xs uppercase tracking-wider text-cream/40">
                    <th className="px-4 py-3 font-medium">№</th>
                    <th className="px-4 py-3 font-medium">Огноо</th>
                    <th className="px-4 py-3 font-medium">Хэрэглэгч</th>
                    <th className="px-4 py-3 font-medium">Утас</th>
                    <th className="px-4 py-3 font-medium text-right">Нийт үнэ</th>
                    <th className="px-4 py-3 font-medium">Статус</th>
                    <th className="px-4 py-3 font-medium text-right">Үйлдэл</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((o, i) => (
                    <tr
                      key={o._id}
                      onClick={() => setSelected(o)}
                      className="border-b border-gold-mid/8 hover:bg-gold-mid/5 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-cormorant text-cream/40">{i + 1}</td>
                      <td className="px-4 py-3 font-cormorant text-cream/70 text-sm whitespace-nowrap">{formatDate(o.createdAt)}</td>
                      <td className="px-4 py-3 font-cormorant text-cream">{o.customerName}</td>
                      <td className="px-4 py-3 font-cormorant text-cream/70 whitespace-nowrap">{o.customerPhone}</td>
                      <td className="px-4 py-3 font-cormorant text-gold-mid text-right whitespace-nowrap">{formatTugrik(o.totalPrice)}</td>
                      <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelected(o) }}
                          className="font-cormorant text-sm text-gold-mid hover:text-gold-light border-b border-gold-mid/40 hover:border-gold-light transition-colors whitespace-nowrap"
                        >
                          Дэлгэрэнгүй
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && !error && visible.length > 0 && (
          <p className="font-cormorant text-sm text-cream/30 mt-4 text-center">
            {visible.length} / {orders.length} захиалга
          </p>
        )}
      </main>

      {selected && (
        <OrderDetailModal
          order={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}
