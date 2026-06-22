import { useState } from 'react'
import { WRAPPINGS } from './Step2Wrapping'
import { RIBBONS } from './Step3Ribbon'
import { SHAPES, ShapeSVG } from './BouquetShapes'
import { saveGift, giftUrl } from '../../lib/giftStore'
import { createOrder, buildOrderPayload } from '../../lib/api'
import { flattenCatalog, calcTotal } from '../../lib/flowers'
import QpayModal from './QpayModal'

function fmt(n) {
  return '₮' + n.toLocaleString('mn-MN')
}

export default function Step4Summary({ order, catalog, onChange, onPrev }) {
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [giftId, setGiftId] = useState(null)
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [offline, setOffline] = useState(false)
  const [showQpay, setShowQpay] = useState(false)
  const [paid, setPaid] = useState(false)

  const flat = flattenCatalog(catalog)
  const selectedFlowers = Object.entries(order.flowers || {})
    .filter(([, qty]) => qty > 0)
    .map(([vKey, qty]) => ({ ...(flat[vKey] || { name: vKey, emoji: '🌸', price: 0 }), qty, vKey }))
  const flowerTotal = calcTotal(order.flowers, catalog)
  const wrappingItem = WRAPPINGS.find((w) => w.id === order.wrapping)
  const ribbonItem = RIBBONS.find((r) => r.id === order.ribbon)
  const wrappingCost = wrappingItem?.price || 0
  const grandTotal = flowerTotal + wrappingCost

  const gift = order.gift || {}
  const hasGiftContent = gift.recipientName || gift.letterText || gift.musicUrl || (gift.photos?.length)

  function validate() {
    const e = {}
    if (!order.name.trim()) e.name = 'Нэрээ оруулна уу'
    if (!order.phone.trim() || !/^\d{8}$/.test(order.phone.trim())) e.phone = '8 оронтой дугаар оруулна уу'
    return e
  }

  async function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    // Захиалга аль хэдийн backend-д үүссэн бол (giftId, offline биш) дахин үүсгэхгүй,
    // зөвхөн QPay цонхыг дахин нээнэ
    if (giftId && !offline) { setShowQpay(true); return }

    setSaving(true)
    setOffline(false)
    const fullOrder = { ...order, total: grandTotal }

    try {
      // Backend-д шууд хадгална
      const { id } = await createOrder(buildOrderPayload(fullOrder, catalog))
      setGiftId(id)
      // Захиалга үүссэн — QPay төлбөрийн цонх нээнэ
      setShowQpay(true)
    } catch {
      // Backend холбогдоогүй бол localStorage-д хадгална (offline fallback — төлбөргүй)
      const id = saveGift({
        flowers: order.flowers,
        shape: order.shape,
        wrapping: order.wrapping,
        ribbon: order.ribbon,
        name: order.name,
        phone: order.phone,
        total: grandTotal,
        gift,
      })
      setGiftId(id)
      setOffline(true)
      setSubmitted(true)
    } finally {
      setSaving(false)
    }
  }

  // QPay төлбөр амжилттай төлөгдсөн
  function handlePaid() {
    setShowQpay(false)
    setPaid(true)
    setSubmitted(true)
  }

  async function copyLink() {
    const url = giftUrl(giftId)
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* ─── Success screen ─── */
  if (submitted) {
    const url = giftUrl(giftId)
    return (
      <>
        <div className="text-center py-10 px-2">
          <div className="text-6xl mb-5">🌸</div>
          <h2 className="font-playfair italic text-3xl text-ink mb-3">Захиалга амжилттай!</h2>
          <div className="w-12 h-px mx-auto mb-5" style={{ background: 'linear-gradient(90deg,transparent,#C9A961,transparent)' }} />

          {paid && (
            <div className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{ background: 'linear-gradient(135deg, #F4EBD3, #FEF8EC)', border: '1px solid #C9A961' }}>
              <span className="text-base">✓</span>
              <span className="font-cormorant text-sm tracking-wide text-gold-dark font-medium">
                Төлбөр төлөгдсөн — {fmt(grandTotal)}
              </span>
            </div>
          )}

          <p className="font-cormorant text-lg text-ink/60 max-w-sm mx-auto leading-relaxed">
            <span className="text-gold-dark font-medium">{order.name}</span>, таны захиалгыг хүлээн авлаа.<br />
            Удахгүй <span className="text-gold-dark font-medium">{order.phone}</span> дугаарт холбогдоно.
          </p>

          {offline && (
            <p className="font-cormorant text-sm text-amber-600/70 mt-4 max-w-xs mx-auto">
              ⚠ Сервертэй холбогдсонгүй — захиалга энэ төхөөрөмжид түр хадгалагдлаа.
            </p>
          )}

          {/* Gift link card */}
          <div className="mt-8 rounded-2xl border border-gold-light/80 overflow-hidden text-left max-w-md mx-auto"
            style={{ background: 'linear-gradient(160deg, #FEFCF7, #FAF7F2)' }}>
            <div className="px-5 pt-5 pb-3">
              <p className="font-cormorant tracking-widest text-xs uppercase text-gold-dark/70 mb-1 flex items-center gap-2">
                <span>🔗</span> Таны NFC хуудасны линк
              </p>
              <p className="font-cormorant text-sm text-ink/50">
                Энэ хаягийг хүлээн авагч утсаараа нээхэд таны бэлэг харагдана
              </p>
            </div>

            <div className="px-5 pb-4">
              <div className="flex items-center gap-2 rounded-xl border border-gold-light/80 bg-white/70 px-3 py-2.5">
                <span className="font-mono text-xs text-ink/60 truncate flex-1">{url}</span>
                <button
                  onClick={copyLink}
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg font-cormorant text-xs tracking-wide uppercase text-cream transition-opacity hover:opacity-85"
                  style={{ background: 'linear-gradient(135deg, #C9A961, #8A6E2F)' }}
                >
                  {copied ? '✓ Хууллаа' : 'Хуулах'}
                </button>
              </div>

              <div className="mt-3">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center px-4 py-2.5 rounded-xl font-cormorant text-sm tracking-wide uppercase text-ink border border-gold-mid/50 hover:bg-gold-light/30 transition-colors"
                >
                  👁 Хуудсыг үзэх
                </a>
              </div>
            </div>
          </div>

          <p className="font-cormorant text-sm text-ink/40 mt-8 tracking-widest uppercase">
            Tsetsegly — Made-to-order flowers
          </p>
        </div>
      </>
    )
  }

  /* ─── Summary + form ─── */
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-playfair italic text-2xl text-ink">Захиалгын хураангуй</h2>
        <p className="font-cormorant text-ink/50 mt-0.5">Дэлгэрэнгүйг шалгаад захиалга өгнө үү</p>
      </div>

      {/* Summary card */}
      <div className="rounded-2xl border border-gold-light/80 overflow-hidden mb-6"
        style={{ background: 'linear-gradient(160deg, #FEFCF7, #FAF7F2)' }}
      >
        {/* Flowers */}
        <div className="px-5 py-4 border-b border-gold-light/60">
          <p className="font-cormorant tracking-widest text-xs uppercase text-ink/40 mb-3">Цэцгүүд</p>
          <div className="flex flex-col gap-2">
            {selectedFlowers.map((f) => (
              <div key={f.vKey} className="flex items-center justify-between">
                <span className="font-cormorant text-base text-ink flex items-center gap-2">
                  {f.image ? (
                    <img src={f.image} alt={f.name} className="w-6 h-6 rounded-md object-cover" />
                  ) : (
                    <span>{f.emoji}</span>
                  )}
                  {f.name}
                  <span className="text-ink/40">× {f.qty}</span>
                </span>
                <span className="font-cormorant text-base text-gold-dark">
                  {fmt(f.price * f.qty)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shape */}
        {order.shape && (() => {
          const shapeItem = SHAPES.find((s) => s.id === order.shape)
          const wrapItem  = WRAPPINGS.find((w) => w.id === order.wrapping)
          return (
            <div className="px-5 py-4 border-b border-gold-light/60 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ShapeSVG
                  id={order.shape}
                  bloom="#DDACAB"
                  wrap={wrapItem?.svgWrap ?? '#EFE5D0'}
                  ribbon="#C9A961"
                  style={{ width: 32, height: 40 }}
                />
                <div>
                  <p className="font-cormorant tracking-widest text-xs uppercase text-ink/40 mb-0.5">Хэлбэр</p>
                  <p className="font-cormorant text-base text-ink">{shapeItem?.name}</p>
                </div>
              </div>
              <span className="font-cormorant text-sm text-ink/30">Үнэгүй</span>
            </div>
          )
        })()}

        {/* Wrapping */}
        <div className="px-5 py-4 border-b border-gold-light/60 flex items-center justify-between">
          <div>
            <p className="font-cormorant tracking-widest text-xs uppercase text-ink/40 mb-0.5">Боолт</p>
            <p className="font-cormorant text-base text-ink">{wrappingItem?.name}</p>
          </div>
          <span className="font-cormorant text-base text-gold-dark">{fmt(wrappingCost)}</span>
        </div>

        {/* Ribbon */}
        <div className="px-5 py-4 border-b border-gold-light/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: ribbonItem?.color }} />
            <div>
              <p className="font-cormorant tracking-widest text-xs uppercase text-ink/40 mb-0.5">Туузаа</p>
              <p className="font-cormorant text-base text-ink">{ribbonItem?.name} туузаа</p>
            </div>
          </div>
          <span className="font-cormorant text-sm text-ink/30">Үнэгүй</span>
        </div>

        {/* NFC chip content */}
        {gift.nfcText && (
          <div className="px-5 py-4 border-b border-gold-light/60">
            <p className="font-cormorant tracking-widest text-xs uppercase text-ink/40 mb-1 flex items-center gap-1.5">
              <span>📲</span> NFC chip бичлэг
            </p>
            <p className="font-cormorant text-base text-ink/70 italic">"{gift.nfcText}"</p>
          </div>
        )}

        {/* Digital gift summary */}
        {hasGiftContent && (
          <div className="px-5 py-4 border-b border-gold-light/60">
            <p className="font-cormorant tracking-widest text-xs uppercase text-gold-dark/60 mb-2 flex items-center gap-1.5">
              <span>🎁</span> Дижитал бэлэг
            </p>
            <div className="flex flex-wrap gap-2">
              {gift.recipientName && (
                <span className="text-xs font-cormorant px-2.5 py-1 rounded-full bg-gold-light/40 text-ink/70">
                  💌 {gift.recipientName}-д
                </span>
              )}
              {gift.letterText && (
                <span className="text-xs font-cormorant px-2.5 py-1 rounded-full bg-gold-light/40 text-ink/70">
                  ✍ Захидал
                </span>
              )}
              {gift.musicUrl && (
                <span className="text-xs font-cormorant px-2.5 py-1 rounded-full bg-gold-light/40 text-ink/70">
                  🎵 Дуу
                </span>
              )}
              {gift.photos?.length > 0 && (
                <span className="text-xs font-cormorant px-2.5 py-1 rounded-full bg-gold-light/40 text-ink/70">
                  📸 {gift.photos.length} зураг
                </span>
              )}
            </div>
          </div>
        )}

        {/* Grand total */}
        <div className="px-5 py-4 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #F4EBD3 0%, #FEF8EC 100%)' }}
        >
          <span className="font-playfair text-lg text-ink">Нийт дүн</span>
          <span className="font-playfair text-2xl text-ink">{fmt(grandTotal)}</span>
        </div>
      </div>

      {/* Contact form */}
      <div className="rounded-2xl border border-gold-light/80 px-5 py-5 mb-6 bg-white/40">
        <p className="font-cormorant tracking-widest text-xs uppercase text-ink/40 mb-4">Холбоо барих</p>
        <div className="flex flex-col gap-4">
          <div>
            <label className="font-cormorant text-sm text-ink/60 mb-1 block">Таны нэр</label>
            <input
              type="text"
              value={order.name}
              onChange={(e) => { onChange({ name: e.target.value }); setErrors((err) => ({ ...err, name: '' })) }}
              placeholder="Нэрийг бичнэ үү"
              className={`w-full rounded-xl border px-4 py-2.5 font-cormorant text-base text-ink placeholder-ink/30 bg-white/60 focus:outline-none transition-colors ${errors.name ? 'border-red-300' : 'border-gold-light/80 focus:border-gold-mid'}`}
            />
            {errors.name && <p className="font-cormorant text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="font-cormorant text-sm text-ink/60 mb-1 block">Утасны дугаар</label>
            <input
              type="tel"
              value={order.phone}
              onChange={(e) => { onChange({ phone: e.target.value }); setErrors((err) => ({ ...err, phone: '' })) }}
              placeholder="8 оронтой дугаар"
              maxLength={8}
              className={`w-full rounded-xl border px-4 py-2.5 font-cormorant text-base text-ink placeholder-ink/30 bg-white/60 focus:outline-none transition-colors ${errors.phone ? 'border-red-300' : 'border-gold-light/80 focus:border-gold-mid'}`}
            />
            {errors.phone && <p className="font-cormorant text-xs text-red-400 mt-1">{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <button
          onClick={onPrev}
          className="font-cormorant text-sm tracking-widest uppercase text-ink/40 hover:text-ink/70 transition-colors"
        >
          ← Буцах
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className={`group relative px-12 py-4 font-cormorant text-base tracking-widest uppercase overflow-hidden w-full sm:w-auto ${saving ? 'opacity-60 cursor-wait' : ''}`}
        >
          <span className="absolute inset-0 transition-opacity duration-300"
            style={{ background: 'linear-gradient(135deg, #F4EBD3, #C9A961, #8A6E2F)' }}
          />
          {!saving && (
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(135deg, #8A6E2F, #C9A961, #F4EBD3)' }}
            />
          )}
          <span className="relative text-ink font-medium flex items-center justify-center gap-2">
            {saving ? 'Хадгалж байна…' : '💳 QPay-аар төлөх'}
          </span>
        </button>
      </div>

      {/* QPay төлбөрийн цонх */}
      {showQpay && giftId && (
        <QpayModal
          orderId={giftId}
          amount={grandTotal}
          onPaid={handlePaid}
          onClose={() => setShowQpay(false)}
        />
      )}
    </div>
  )
}
