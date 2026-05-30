/* Захиалгын статусын тодорхойлолт — admin dashboard даяар ашиглана */
export const STATUSES = [
  { id: 'new',       label: 'Шинэ',           emoji: '🟡', color: '#EAB308' },
  { id: 'preparing', label: 'Бэлтгэж байна',  emoji: '🔵', color: '#3B82F6' },
  { id: 'ready',     label: 'Бэлэн',          emoji: '🟢', color: '#22C55E' },
  { id: 'delivered', label: 'Хүргэсэн',       emoji: '✅', color: '#C9A961' },
]

export function getStatus(id) {
  return STATUSES.find((s) => s.id === id) || STATUSES[0]
}

export function formatTugrik(n) {
  return '₮' + Number(n || 0).toLocaleString('mn-MN')
}

export function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  const pad = (x) => String(x).padStart(2, '0')
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function isToday(iso) {
  if (!iso) return false
  const d = new Date(iso)
  const t = new Date()
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate()
}
