/* ─────────────────────────────────────────────
   Монгол нэрийг URL-д тохирох slug болгох

   "Ягаан мөрөөдөл" → "yagaan-moroodol"

   Латинаар бичих нь Google-ийн хувьд ч, хуваалцахад ч
   кирилл хаягаас найдвартай (кирилл URL нь хуулахад
   %D1%8F%D0%B3... болж хувирдаг).
───────────────────────────────────────────── */

const MAP = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z',
  и: 'i', й: 'i', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', ө: 'o', п: 'p',
  р: 'r', с: 's', т: 't', у: 'u', ү: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch',
  ш: 'sh', щ: 'sh', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
}

/* Нэрээс slug гаргана. Хоосон гарвал fallback буцаана. */
export function slugify(text, fallback = 'baglaa') {
  const s = String(text || '')
    .toLowerCase()
    .split('')
    .map((ch) => (ch in MAP ? MAP[ch] : ch))
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '')

  return s || fallback
}

/* Давхцахгүй slug гаргана: taken дотор байвал -2, -3 … нэмнэ.
   taken — Set эсвэл массив. */
export function uniqueSlug(text, taken, fallback) {
  const base = slugify(text, fallback)
  const used = taken instanceof Set ? taken : new Set(taken || [])
  if (!used.has(base)) return base

  let n = 2
  while (used.has(`${base}-${n}`)) n += 1
  return `${base}-${n}`
}
