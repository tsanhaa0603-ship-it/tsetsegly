import { useEffect, useState } from 'react'
import { SHAPES } from '../builder/BouquetShapes'
import { WRAPPINGS } from '../builder/Step2Wrapping'
import { RIBBONS } from '../builder/Step3Ribbon'
import { giftUrl } from '../../lib/giftStore'
import { STATUSES, getStatus, formatTugrik, formatDate } from '../../lib/orderStatus'

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-gold-mid/10">
      <span className="font-cormorant text-sm text-cream/40 uppercase tracking-wider flex-shrink-0">{label}</span>
      <span className="font-cormorant text-base text-cream/90 text-right">{children}</span>
    </div>
  )
}

export default function OrderDetailModal({ order, onClose, onStatusChange }) {
  const [copied, setCopied] = useState(false)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!order) return null

  const shape = SHAPES.find((s) => s.id === order.bouquetShape)
  const wrap = WRAPPINGS.find((w) => w.id === order.wrapping)
  const ribbon = RIBBONS.find((r) => r.id === order.ribbon)
  const st = getStatus(order.status)
  const url = giftUrl(order._id)

  async function copyLink() {
    try { await navigator.clipboard.writeText(url) } catch { /* ignore */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  async function changeStatus(e) {
    const next = e.target.value
    if (next === order.status) return
    setUpdating(true)
    try {
      await onStatusChange(order._id, next)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-gold-mid/25 shadow-2xl"
        style={{ background: 'linear-gradient(160deg, #232323, #1A1A1A)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 pt-5 pb-4 border-b border-gold-mid/15 backdrop-blur-sm"
          style={{ background: 'rgba(26,26,26,0.92)' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-cormorant tracking-[0.3em] text-xs uppercase text-gold-mid/50 mb-1">Захиалга</p>
              <h3 className="font-playfair italic text-2xl text-cream">{order.customerName}</h3>
              <p className="font-cormorant text-sm text-cream/40 mt-0.5">{formatDate(order.createdAt)}</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full border border-gold-mid/25 flex items-center justify-center text-cream/50 hover:text-cream hover:bg-gold-mid/10 transition-colors"
              aria-label="Хаах"
            >✕</button>
          </div>
        </div>

        <div className="px-6 py-5">
          {/* Flowers */}
          <p className="font-cormorant tracking-widest text-xs uppercase text-gold-mid/50 mb-2">Цэцгүүд</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {(order.flowers || []).map((f, i) => (
              <span key={i} className="font-cormorant text-sm px-3 py-1.5 rounded-full border border-gold-mid/20 text-cream/80 flex items-center gap-1.5"
                style={{ background: 'rgba(201,169,97,0.07)' }}>
                <span>{f.emoji}</span>{f.name}
                {f.qty > 1 && <span className="text-cream/40">×{f.qty}</span>}
              </span>
            ))}
            {(!order.flowers || order.flowers.length === 0) && (
              <span className="font-cormorant text-sm text-cream/30">—</span>
            )}
          </div>

          {/* Bouquet details */}
          <div className="mb-5">
            <Row label="Хэлбэр">{shape?.name || '—'}</Row>
            <Row label="Боолт">{wrap?.name || '—'}</Row>
            <Row label="Туузаа">
              {ribbon ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border border-white/30" style={{ background: ribbon.color }} />
                  {ribbon.name}
                </span>
              ) : '—'}
            </Row>
            {order.recipientName && <Row label="Хүлээн авагч">{order.recipientName}</Row>}
            {order.nfcText && <Row label="NFC текст"><span className="italic text-cream/70">"{order.nfcText}"</span></Row>}
            {order.letterText && (
              <Row label="Захидал"><span className="italic text-cream/60 text-sm">"{order.letterText.slice(0, 60)}{order.letterText.length > 60 ? '…' : ''}"</span></Row>
            )}
          </div>

          {/* Customer */}
          <p className="font-cormorant tracking-widest text-xs uppercase text-gold-mid/50 mb-2">Захиалагч</p>
          <div className="mb-5">
            <Row label="Нэр">{order.customerName}</Row>
            <Row label="Утас"><a href={`tel:${order.customerPhone}`} className="text-gold-mid hover:underline">{order.customerPhone}</a></Row>
            <Row label="Нийт үнэ"><span className="text-gold-mid font-medium text-lg">{formatTugrik(order.totalPrice)}</span></Row>
          </div>

          {/* NFC link */}
          <p className="font-cormorant tracking-widest text-xs uppercase text-gold-mid/50 mb-2">NFC линк</p>
          <div className="flex items-center gap-2 rounded-xl border border-gold-mid/20 bg-black/30 px-3 py-2.5 mb-5">
            <span className="font-mono text-xs text-cream/50 truncate flex-1">{url}</span>
            <button
              onClick={copyLink}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg font-cormorant text-xs tracking-wide uppercase text-ink hover:opacity-85 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #C9A961, #8A6E2F)' }}
            >
              {copied ? '✓ Хууллаа' : 'Хуулах'}
            </button>
          </div>

          {/* Status changer */}
          <p className="font-cormorant tracking-widest text-xs uppercase text-gold-mid/50 mb-2">Статус солих</p>
          <div className="flex items-center gap-3">
            <span className="font-cormorant text-base flex items-center gap-2" style={{ color: st.color }}>
              {st.emoji} {st.label}
            </span>
            <span className="text-cream/30">→</span>
            <select
              value={order.status}
              onChange={changeStatus}
              disabled={updating}
              className="flex-1 rounded-xl border border-gold-mid/25 bg-black/40 text-cream font-cormorant text-base px-3 py-2 focus:outline-none focus:border-gold-mid"
            >
              {STATUSES.map((s) => (
                <option key={s.id} value={s.id} style={{ background: '#1A1A1A' }}>
                  {s.emoji} {s.label}
                </option>
              ))}
            </select>
          </div>
          {updating && <p className="font-cormorant text-xs text-gold-mid/60 mt-2">Шинэчилж байна…</p>}
        </div>
      </div>
    </div>
  )
}
