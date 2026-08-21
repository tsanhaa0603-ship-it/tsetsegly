/* ─────────────────────────────────────────────
   Баглааны хэлбэрийн каталог
   Backend байхгүй үед DEFAULT_SHAPES fallback болно.

   design — аль SVG зургийг ашиглахыг заана
   (боломжтой загваруудыг BouquetShapes.jsx-ийн
    SHAPE_DESIGNS-ээс харна)
───────────────────────────────────────────── */

export const DEFAULT_SHAPES = [
  { id: 'round',   design: 'round',   name: 'Бөөрөнхий',  desc: 'Сонгодог дугариг хэлбэр',  en: 'Round bouquet',   order: 1 },
  { id: 'cascade', design: 'cascade', name: 'Урсгал',     desc: 'Доош гоёмсогоор урсах',    en: 'Cascade',         order: 2 },
  { id: 'garden',  design: 'garden',  name: 'Задгай',     desc: 'Чөлөөт байгалийн аяс',     en: 'Garden style',    order: 3 },
  { id: 'single',  design: 'single',  name: 'Нэг цэцэг',  desc: 'Минималист, цэвэр',        en: 'Single stem',     order: 4 },
  { id: 'posy',    design: 'posy',    name: 'Поси',       desc: 'Нягт авсаархан жижиг',     en: 'Posy / Nosegay',  order: 5 },
  { id: 'fan',     design: 'fan',     name: 'Дэлгэр',     desc: 'Өргөн, баян дэлгэрэнгүй',  en: 'Fan / Sheaf',     order: 6 },
]

/* id-аар хэлбэр олох */
export function findShape(catalog, id) {
  return (catalog || DEFAULT_SHAPES).find((s) => s.id === id) || null
}
