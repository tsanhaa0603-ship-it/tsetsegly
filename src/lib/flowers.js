/* ─────────────────────────────────────────────
   Цэцгийн каталог — өнгөөр төрөлжсөн
   Backend байхгүй үед DEFAULT_CATALOG fallback болно.
───────────────────────────────────────────── */

export const DEFAULT_CATALOG = [
  {
    key: 'rose', name: 'Сарнай', emoji: '🌹', hint: 'Хайр дурлалын бэлэг', order: 1,
    colors: [
      { key: 'red',      name: 'Улаан сарнай',     hex: '#C0392B', price: 25000 },
      { key: 'pink',     name: 'Ягаан сарнай',     hex: '#EFA0B8', price: 25000 },
      { key: 'white',    name: 'Цагаан сарнай',    hex: '#FBF7EF', price: 27000 },
      { key: 'yellow',   name: 'Шар сарнай',       hex: '#F2CB4D', price: 26000 },
      { key: 'lavender', name: 'Лаванд сарнай',    hex: '#B9A4D4', price: 30000 },
    ],
  },
  {
    key: 'chrysan', name: 'Хризантем', emoji: '🌸', hint: 'Цэвэр, нарийн гоо', order: 2,
    colors: [
      { key: 'white',  name: 'Цагаан хризантем', hex: '#FBF7EF', price: 15000 },
      { key: 'pink',   name: 'Ягаан хризантем',  hex: '#EFA0B8', price: 15000 },
      { key: 'purple', name: 'Нил хризантем',    hex: '#7D5BA6', price: 17000 },
    ],
  },
  {
    key: 'tulip', name: 'Лали', emoji: '🌷', hint: 'Хавар, шинэ эхлэл', order: 3,
    colors: [
      { key: 'red',    name: 'Улаан лали',      hex: '#C0392B', price: 20000 },
      { key: 'pink',   name: 'Ягаан лали',      hex: '#EFA0B8', price: 20000 },
      { key: 'purple', name: 'Нил ягаан лали',  hex: '#7D5BA6', price: 22000 },
    ],
  },
  {
    key: 'sunflower', name: 'Наранцэцэг', emoji: '🌻', hint: 'Баяр хөөр, эрч хүч', order: 4,
    colors: [
      { key: 'yellow', name: 'Шар наранцэцэг',       hex: '#F2CB4D', price: 18000 },
      { key: 'orange', name: 'Улбар шар наранцэцэг',  hex: '#E8843C', price: 19000 },
    ],
  },
  {
    key: 'orchid', name: 'Орхидей', emoji: '💜', hint: 'Тансаг, ховор гоо', order: 5,
    colors: [
      { key: 'purple', name: 'Нил ягаан орхидей', hex: '#7D5BA6', price: 35000 },
      { key: 'white',  name: 'Цагаан орхидей',    hex: '#FBF7EF', price: 37000 },
    ],
  },
  {
    key: 'peony', name: 'Пеони', emoji: '🌺', hint: 'Элбэг дэлбэг аз жаргал', order: 6,
    colors: [
      { key: 'pink',   name: 'Ягаан пеони',  hex: '#EFA0B8', price: 30000 },
      { key: 'white',  name: 'Цагаан пеони', hex: '#FBF7EF', price: 32000 },
      { key: 'yellow', name: 'Шар пеони',    hex: '#F2CB4D', price: 33000 },
    ],
  },
]

/* Цэцэг + өнгөний нийлмэл түлхүүр */
export function variantKey(flowerKey, colorKey) {
  return `${flowerKey}:${colorKey}`
}

/* Каталогийг нийлмэл түлхүүрээр хайх боломжтой хүснэгт болгоно */
export function flattenCatalog(catalog) {
  const map = {}
  for (const f of catalog || []) {
    for (const c of f.colors || []) {
      map[variantKey(f.key, c.key)] = {
        variant: variantKey(f.key, c.key),
        flowerKey: f.key,
        flowerName: f.name,
        emoji: f.emoji,
        colorKey: c.key,
        name: c.name,
        hex: c.hex,
        price: c.price,
      }
    }
  }
  return map
}

/* Сонголтоос (variant->qty) нийт үнэ тооцох */
export function calcTotal(selected, catalog) {
  const flat = flattenCatalog(catalog)
  return Object.entries(selected || {}).reduce((sum, [k, qty]) => {
    const meta = flat[k]
    return sum + (meta ? meta.price * qty : 0)
  }, 0)
}
