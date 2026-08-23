/* ─────────────────────────────────────────────
   Хүргэлтийн бүс, төлбөр, цагийн хуваарь

   Tsetsegly салбар дэлгүүргүй, зөвхөн хүргэлтээр
   ажилладаг тул хүргэлтийн бүс нь Google Business
   Profile-ийн "service area"-тай яг таарах ёстой.
───────────────────────────────────────────── */

/* Хотын доторх хүргэлтийн нэгдсэн үнэ — бүх чиглэлд ижил */
export const CITY_DELIVERY_FEE = 10000

/* Улаанбаатарын хүргэлтийн бүсүүд.
   Үнэ бүх дүүрэгт ижил, зөвхөн хүрэх хугацаа нь ялгаатай. */
export const DELIVERY_ZONES = [
  { id: 'sukhbaatar',       name: 'Сүхбаатар',      fee: CITY_DELIVERY_FEE, eta: '1–2 цаг', order: 1 },
  { id: 'chingeltei',       name: 'Чингэлтэй',      fee: CITY_DELIVERY_FEE, eta: '1–2 цаг', order: 2 },
  { id: 'bayangol',         name: 'Баянгол',        fee: CITY_DELIVERY_FEE, eta: '2–3 цаг', order: 3 },
  { id: 'khanuul',          name: 'Хан-Уул',        fee: CITY_DELIVERY_FEE, eta: '2–3 цаг', order: 4 },
  { id: 'bayanzurkh',       name: 'Баянзүрх',       fee: CITY_DELIVERY_FEE, eta: '2–3 цаг', order: 5 },
  { id: 'songinokhairkhan', name: 'Сонгинохайрхан', fee: CITY_DELIVERY_FEE, eta: '3–4 цаг', order: 6 },
]

/* Бүсээс гадуур — үнэ утсаар тохирно */
export const OUT_OF_ZONE = {
  id: 'other',
  name: 'Бусад (Налайх, хотоос гадуур)',
  fee: null,
  eta: 'Утсаар тохирно',
  order: 99,
}

/* Бүх сонголт — дүүргүүд + бүсээс гадуур */
export const ALL_ZONES = [...DELIVERY_ZONES, OUT_OF_ZONE]

/* Энэ дүнгээс дээш захиалгад хүргэлт үнэгүй */
export const FREE_DELIVERY_MIN = 150000

/* Хүргэлтийн цагийн хуваарь (ажлын цаг 10:00–20:00) */
export const TIME_SLOTS = [
  { id: 'morning',   label: '10:00 – 13:00', hint: 'Өглөө' },
  { id: 'midday',    label: '13:00 – 16:00', hint: 'Өдөр' },
  { id: 'afternoon', label: '16:00 – 20:00', hint: 'Орой' },
  { id: 'exact',     label: 'Тодорхой цаг',  hint: 'Утсаар тохирно' },
]

/* Энэ цагаас хойш ирсэн захиалгыг тухайн өдөртөө хүргэхгүй */
export const LAST_SAME_DAY_HOUR = 18

/* ─────────────────────────────────────────────
   Туслах функцууд
───────────────────────────────────────────── */

/* id-аар бүс олох */
export function findZone(id) {
  return ALL_ZONES.find((z) => z.id === id) || null
}

/* id-аар цагийн хуваарь олох */
export function findSlot(id) {
  return TIME_SLOTS.find((s) => s.id === id) || null
}

/* Хүргэлтийн төлбөр тооцох.
   Буцаах: { fee, free, negotiable }
   - free       — захиалгын дүн FREE_DELIVERY_MIN-ээс давсан
   - negotiable — бүсээс гадуур, үнэ утсаар тохирно */
export function calcDeliveryFee(zoneId, subtotal = 0) {
  const zone = findZone(zoneId)
  if (!zone) return { fee: 0, free: false, negotiable: false }
  if (zone.fee === null) return { fee: 0, free: false, negotiable: true }
  if (subtotal >= FREE_DELIVERY_MIN) return { fee: 0, free: true, negotiable: false }
  return { fee: zone.fee, free: false, negotiable: false }
}

/* YYYY-MM-DD хэлбэрт хөрвүүлэх (date input-д хэрэгтэй) */
export function toISODate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/* Тухайн өдрийн хүргэлт боломжтой эсэх */
export function isSameDayAvailable(now = new Date()) {
  return now.getHours() < LAST_SAME_DAY_HOUR
}

/* Хамгийн эрт сонгож болох огноо — өнөөдөр эсвэл маргааш */
export function earliestDate(now = new Date()) {
  if (isSameDayAvailable(now)) return toISODate(now)
  const t = new Date(now)
  t.setDate(t.getDate() + 1)
  return toISODate(t)
}

/* Хамгийн хол сонгож болох огноо — 30 хоногийн дараа */
export function latestDate(now = new Date()) {
  const t = new Date(now)
  t.setDate(t.getDate() + 30)
  return toISODate(t)
}

/* Огноог монголоор уншигдахуйц болгох: "2026 оны 9-р сарын 1, Мягмар" */
const WEEKDAYS = ['Ням', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба']

export function formatDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  const date = new Date(y, m - 1, d)
  return `${y} оны ${m}-р сарын ${d}, ${WEEKDAYS[date.getDay()]}`
}

/* Хүргэлтийн мэдээлэл бүрэн бөглөгдсөн эсэх — алдааны map буцаана */
export function validateDelivery(dv = {}) {
  const e = {}
  if (!dv.zone) e.zone = 'Хүргэлтийн бүсээ сонгоно уу'
  if (!String(dv.address || '').trim()) e.address = 'Дэлгэрэнгүй хаягаа бичнэ үү'
  if (!String(dv.recipientName || '').trim()) e.recipientName = 'Хүлээн авагчийн нэрийг бичнэ үү'
  if (!/^\d{8}$/.test(String(dv.recipientPhone || '').trim())) {
    e.recipientPhone = '8 оронтой дугаар оруулна уу'
  }
  if (!dv.date) e.date = 'Хүргэх өдрөө сонгоно уу'
  if (!dv.slot) e.slot = 'Хүргэх цагаа сонгоно уу'
  return e
}
