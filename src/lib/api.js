/* ─────────────────────────────────────────────
   Backend API холболт
   VITE_API_URL .env-д тохируулагдана.
───────────────────────────────────────────── */
import { FLOWERS } from '../components/builder/Step1Flowers'

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')

/* Frontend order → backend payload руу хувиргах */
export function buildOrderPayload(order) {
  const g = order.gift || {}
  const flowers = FLOWERS
    .filter((f) => order.flowers?.[f.id])
    .map((f) => ({
      id: f.id,
      name: f.name,
      emoji: f.emoji,
      price: f.price,
      qty: order.flowers[f.id],
    }))

  return {
    flowers,
    bouquetShape: order.shape || '',
    wrapping: order.wrapping || '',
    ribbon: order.ribbon || '',
    nfcText: g.nfcText || '',
    music: g.musicUrl || '',
    recipientName: g.recipientName || '',
    letterText: g.letterText || '',
    letterFont: g.letterFont || 'elegant',
    photos: g.photos || [],
    totalPrice: order.total || 0,
    customerName: order.name || '',
    customerPhone: order.phone || '',
  }
}

/* Захиалга үүсгэх — { id } буцаана */
export async function createOrder(payload) {
  const res = await fetch(`${API}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Захиалга илгээхэд алдаа гарлаа')
  return res.json()
}

/* NFC бэлгийн мэдээлэл татах — олдохгүй бол null */
export async function fetchGift(id) {
  const res = await fetch(`${API}/api/gift/${id}`)
  if (!res.ok) return null
  return res.json()
}

/* Backend эсвэл localStorage-аас ирсэн өгөгдлийг нэгдсэн хэлбэрт оруулна */
export function normalizeGift(raw) {
  if (!raw) return null
  const g = raw.gift || {}

  // flowers нь array (backend) эсвэл map (localStorage) байж болно
  let flowers = []
  if (Array.isArray(raw.flowers)) {
    flowers = raw.flowers
  } else if (raw.flowers && typeof raw.flowers === 'object') {
    flowers = FLOWERS
      .filter((f) => raw.flowers[f.id])
      .map((f) => ({ id: f.id, name: f.name, emoji: f.emoji, price: f.price, qty: raw.flowers[f.id] }))
  }

  return {
    flowers,
    shape: raw.bouquetShape || raw.shape || null,
    wrapping: raw.wrapping || null,
    ribbon: raw.ribbon || null,
    senderName: raw.senderName || raw.customerName || raw.name || '',
    recipientName: raw.recipientName || g.recipientName || '',
    letterText: raw.letterText || g.letterText || '',
    letterFont: raw.letterFont || g.letterFont || 'elegant',
    music: raw.music || g.musicUrl || '',
    nfcText: raw.nfcText || g.nfcText || '',
    photos: raw.photos || g.photos || [],
  }
}
