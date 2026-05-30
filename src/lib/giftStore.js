/* ─────────────────────────────────────────────
   Gift storage layer
   Stores each gift order in localStorage keyed by UUID.
   Backend-ийг дараа нэмэхэд энэ модулийг л солих.
───────────────────────────────────────────── */

const PREFIX = 'tsetsegly_gift_'

/* RFC4122 v4 UUID — crypto.randomUUID байвал ашиглана */
export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/* Захиалга хадгалах. id буцаана. */
export function saveGift(order) {
  const id = generateId()
  const payload = {
    id,
    createdAt: new Date().toISOString(),
    ...order,
  }
  try {
    localStorage.setItem(PREFIX + id, JSON.stringify(payload))
  } catch (e) {
    // localStorage дүүрсэн (ихэвчлэн зургаас) — зурггүйгээр дахин оролдоно
    console.warn('Gift хадгалахад алдаа гарлаа, зурггүйгээр хадгалж байна.', e)
    const lite = { ...payload, photos: [] }
    localStorage.setItem(PREFIX + id, JSON.stringify(lite))
  }
  return id
}

/* id-аар захиалга унших. Олдохгүй бол null. */
export function loadGift(id) {
  try {
    const raw = localStorage.getItem(PREFIX + id)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/* Бүтэн gift URL үүсгэх */
export function giftUrl(id) {
  if (typeof window === 'undefined') return `/gift/${id}`
  return `${window.location.origin}/gift/${id}`
}
