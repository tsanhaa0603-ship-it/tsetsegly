/* ─────────────────────────────────────────────
   Боолтын цаасны каталог — 25 материал
   Backend байхгүй үед DEFAULT_WRAPPINGS fallback болно.
───────────────────────────────────────────── */

const IMG = '/wrappings/'

/* Ангиллын нэр (шүүлт, бүлэглэлтэд) */
export const WRAP_CATEGORIES = [
  { key: 'matte',    label: 'Матт' },
  { key: 'pearl',    label: 'Сувдан ба крафт' },
  { key: 'textured', label: 'Бүтэцтэй' },
  { key: 'sheer',    label: 'Тунгалаг' },
  { key: 'mesh',     label: 'Тор' },
  { key: 'luxe',     label: 'Тансаг ба хээт' },
]

export const DEFAULT_WRAPPINGS = [
  // ── Матт ──
  { id: 'cream',        name: 'Крем цагаан',      desc: 'Цэвэр, дэгжин',       price: 5000, category: 'matte',    image: IMG + 'matte-cream.jpg',           dot: '#E8DCC4', svgWrap: '#EFE5D0', order: 1 },
  { id: 'ivory',        name: 'Сүүн цагаан',      desc: 'Зөөлөн дулаан',       price: 5000, category: 'matte',    image: IMG + 'matte-ivory.jpg',           dot: '#EDE6D8', svgWrap: '#EDE6D8', order: 2 },
  { id: 'white',        name: 'Цэвэр цагаан',     desc: 'Минималист',          price: 5000, category: 'matte',    image: IMG + 'matte-white.jpg',           dot: '#F2F2F0', svgWrap: '#F2F2F0', order: 3 },
  { id: 'pink',         name: 'Ягаан хөрс',       desc: 'Романтик аяс',        price: 5000, category: 'matte',    image: IMG + 'matte-pink.jpg',            dot: '#F0A8B4', svgWrap: '#F9C8D0', order: 4 },
  { id: 'rose',         name: 'Сарнайн ягаан',    desc: 'Тод, дулаахан',       price: 5000, category: 'matte',    image: IMG + 'matte-rose.jpg',            dot: '#E88FA6', svgWrap: '#F3AFC0', order: 5 },
  { id: 'coral',        name: 'Шүрэн улаан',      desc: 'Эрч хүчтэй',          price: 5000, category: 'matte',    image: IMG + 'matte-coral.jpg',           dot: '#E9614F', svgWrap: '#EE7C6C', order: 6 },
  { id: 'lightblue',    name: 'Цайвар цэнхэр',    desc: 'Сэрүүн, тайван',      price: 5000, category: 'matte',    image: IMG + 'matte-light-blue.jpg',      dot: '#8FC4E8', svgWrap: '#A9D2EE', order: 7 },
  { id: 'sky',          name: 'Тэнгэрийн цэнхэр', desc: 'Тунгалаг цэнхэр',     price: 5000, category: 'matte',    image: IMG + 'matte-sky.jpg',             dot: '#63B7DE', svgWrap: '#8CC9E7', order: 8 },

  // ── Сувдан ба крафт ──
  { id: 'pearl',        name: 'Сувдан цагаан',    desc: 'Гялтганасан өнгөлөг', price: 6000, category: 'pearl',    image: IMG + 'pearl-white.jpg',           dot: '#E9E7E2', svgWrap: '#E9E7E2', order: 9 },
  { id: 'kraft',        name: 'Крафт бор',        desc: 'Байгалийн энгийн',    price: 6000, category: 'pearl',    image: IMG + 'kraft-taupe.jpg',           dot: '#B49A86', svgWrap: '#C6AE9A', order: 10 },

  // ── Бүтэцтэй ──
  { id: 'blush',        name: 'Бүтэцтэй ягаан',   desc: 'Зөөлөн бүтэц',        price: 6000, category: 'textured', image: IMG + 'textured-blush.jpg',        dot: '#DCA9AE', svgWrap: '#E8C0C4', order: 11 },
  { id: 'mint',         name: 'Бүтэцтэй мятны',   desc: 'Сэрүүн ногоон',       price: 6000, category: 'textured', image: IMG + 'textured-mint.jpg',         dot: '#5FBFAE', svgWrap: '#88D2C4', order: 12 },
  { id: 'green',        name: 'Ногоон байгаль',   desc: 'Шинэлэг, тайван',     price: 6000, category: 'textured', image: IMG + 'textured-green-orange.jpg', dot: '#2E7D53', svgWrap: '#4C9970', order: 13 },
  { id: 'redblack',     name: 'Улаан хар',        desc: 'Зоригтой хослол',     price: 6000, category: 'textured', image: IMG + 'textured-red-black.jpg',    dot: '#C4342E', svgWrap: '#CF4B44', order: 14 },

  // ── Тунгалаг ──
  { id: 'frostedclear', name: 'Тунгалаг цагаан',  desc: 'Хөнгөн, агаарлаг',    price: 7000, category: 'sheer',    image: IMG + 'frosted-clear.jpg',         dot: '#DCE2E4', svgWrap: '#E4E9EB', order: 15 },
  { id: 'frostedpink',  name: 'Тунгалаг ягаан',   desc: 'Мөрөөдлийн аяс',      price: 7000, category: 'sheer',    image: IMG + 'frosted-pink.jpg',          dot: '#F2C9D2', svgWrap: '#F6D8DF', order: 16 },
  { id: 'organza',      name: 'Хүрэн долгион',    desc: 'Долгион хээтэй',      price: 7000, category: 'sheer',    image: IMG + 'organza-brown-lines.jpg',   dot: '#6B4A3C', svgWrap: '#8A6552', order: 17 },

  // ── Тор ──
  { id: 'meshpink',     name: 'Ягаан тор',        desc: 'Сүлжмэл бүтэц',       price: 7000, category: 'mesh',     image: IMG + 'mesh-pink.jpg',             dot: '#F0AFC0', svgWrap: '#F4C4D1', order: 18 },
  { id: 'meshhotpink',  name: 'Тод ягаан тор',    desc: 'Анхаарал татам',      price: 7000, category: 'mesh',     image: IMG + 'mesh-hotpink.jpg',          dot: '#E82E8E', svgWrap: '#EE5CA5', order: 19 },
  { id: 'meshblack',    name: 'Хар тор',          desc: 'Нууцлаг сүлжээ',      price: 7000, category: 'mesh',     image: IMG + 'mesh-black.jpg',            dot: '#2A2A2A', svgWrap: '#3A3A3A', order: 20 },

  // ── Тансаг ба хээт ──
  { id: 'sheerblack',   name: 'Хар тунгалаг',     desc: 'Гүн, нарийхан',       price: 8000, category: 'luxe',     image: IMG + 'sheer-black.jpg',           dot: '#242424', svgWrap: '#2E2E2E', order: 21 },
  { id: 'black',        name: 'Хар тансаг',       desc: 'Зоригтой контраст',   price: 8000, category: 'luxe',     image: IMG + 'sheer-black-gold.jpg',      dot: '#C9A961', svgWrap: '#2A2A2A', order: 22 },
  { id: 'florallight',  name: 'Цэцгэн цайвар',    desc: 'Хээтэй, эмэгтэйлэг',  price: 8000, category: 'luxe',     image: IMG + 'floral-light.jpg',          dot: '#D8C4B0', svgWrap: '#E2D2C2', order: 23 },
  { id: 'floraldark',   name: 'Цэцгэн хар',       desc: 'Гүн өнгийн хээ',      price: 8000, category: 'luxe',     image: IMG + 'floral-dark.jpg',           dot: '#3B3A40', svgWrap: '#4A4850', order: 24 },
  { id: 'floralgreen',  name: 'Цэцгэн ногоон',    desc: 'Байгалийн хээ',       price: 8000, category: 'luxe',     image: IMG + 'floral-green.jpg',          dot: '#8FA07A', svgWrap: '#A3B18E', order: 25 },
]

/* id-аар боолт олох */
export function findWrapping(catalog, id) {
  return (catalog || DEFAULT_WRAPPINGS).find((w) => w.id === id) || null
}

/* Ангиллаар бүлэглэх — [{ key, label, items[] }] */
export function groupByCategory(catalog) {
  const list = catalog || DEFAULT_WRAPPINGS
  return WRAP_CATEGORIES
    .map((c) => ({ ...c, items: list.filter((w) => w.category === c.key) }))
    .filter((g) => g.items.length > 0)
}
