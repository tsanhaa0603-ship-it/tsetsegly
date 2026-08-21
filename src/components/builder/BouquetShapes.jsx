/* eslint-disable react-refresh/only-export-components */
/* ─────────────────────────────────────────────
   Баглааны хэлбэрийн SVG зураг
   viewBox="0 0 80 100", props: bloom, wrap, ribbon

   Дахин ашиглах хэсгүүд (Bloom, Leaf, Cone, Bow) дээр
   суурилсан тул хэлбэрүүд нэгдмэл, бодитой харагдана.
───────────────────────────────────────────── */

const LEAF = '#7FAB7A'
const LEAF_DARK = '#5F8C5C'

/* ── Нэг цэцэг: дэлбээ + гол ── */
function Bloom({ cx, cy, r, fill, petals = 6, rot = 0, dim = 0 }) {
  const items = []
  for (let i = 0; i < petals; i++) {
    const a = rot + (i * 360) / petals
    const rad = ((a - 90) * Math.PI) / 180
    const px = cx + r * 0.5 * Math.cos(rad)
    const py = cy + r * 0.5 * Math.sin(rad)
    items.push(
      <ellipse
        key={i}
        cx={px} cy={py}
        rx={r * 0.46} ry={r * 0.6}
        transform={`rotate(${a} ${px} ${py})`}
        fill={fill}
      />
    )
  }
  return (
    <g>
      {items}
      {/* гүнзгийрүүлэх сүүдэр */}
      <circle cx={cx} cy={cy} r={r * 0.42} fill="#000" opacity={0.1 + dim * 0.12} />
      {/* гол */}
      <circle cx={cx} cy={cy} r={r * 0.26} fill="#fff" opacity={0.4} />
      {dim > 0 && <circle cx={cx} cy={cy} r={r} fill="#000" opacity={dim * 0.18} />}
    </g>
  )
}

/* ── Навч ── */
function Leaf({ x, y, len = 12, w = 4.5, rot = 0, fill = LEAF, opacity = 0.85 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={opacity}>
      <path d={`M0 0 Q ${len * 0.5} ${-w} ${len} 0 Q ${len * 0.5} ${w} 0 0 Z`} fill={fill} />
      <path d={`M1 0 L ${len - 1} 0`} stroke="#000" strokeOpacity="0.12" strokeWidth="0.6" />
    </g>
  )
}

/* ── Боолтын конус ── */
function Cone({ topW = 22, botW = 13, top = 58, bot = 92, cx = 40, fill }) {
  const tl = cx - topW / 2, tr = cx + topW / 2
  const bl = cx - botW / 2, br = cx + botW / 2
  return (
    <g>
      <path d={`M${tl} ${top} Q ${cx} ${top + 3} ${tr} ${top} L ${br} ${bot} Q ${cx} ${bot + 2.5} ${bl} ${bot} Z`} fill={fill} />
      {/* атираа */}
      <path d={`M${cx} ${top + 2} L ${cx - 1} ${bot}`} stroke="#000" strokeOpacity="0.10" strokeWidth="0.9" />
      <path d={`M${tl + 3} ${top + 1} L ${bl + 2} ${bot - 1}`} stroke="#fff" strokeOpacity="0.18" strokeWidth="0.9" />
      {/* доод сүүдэр */}
      <path d={`M${bl} ${bot - 6} L ${br} ${bot - 6} L ${br} ${bot} Q ${cx} ${bot + 2.5} ${bl} ${bot} Z`} fill="#000" opacity="0.07" />
    </g>
  )
}

/* ── Туузны уяа ── */
function Bow({ cx = 40, cy = 60, s = 1, fill }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      {/* сүүл */}
      <path d="M-1.5 2 L -6 12 L -2.5 11 L 0 3 Z" fill={fill} opacity="0.85" />
      <path d="M1.5 2 L 6 12 L 2.5 11 L 0 3 Z" fill={fill} opacity="0.85" />
      {/* гогцоо */}
      <ellipse cx="-5.5" cy="0" rx="5.5" ry="3.6" transform="rotate(-18 -5.5 0)" fill={fill} />
      <ellipse cx="5.5" cy="0" rx="5.5" ry="3.6" transform="rotate(18 5.5 0)" fill={fill} />
      <ellipse cx="-5.5" cy="0" rx="2.6" ry="1.7" transform="rotate(-18 -5.5 0)" fill="#000" opacity="0.12" />
      <ellipse cx="5.5" cy="0" rx="2.6" ry="1.7" transform="rotate(18 5.5 0)" fill="#000" opacity="0.12" />
      {/* зангилаа */}
      <circle cx="0" cy="0" r="2.5" fill={fill} />
      <circle cx="0" cy="0" r="2.5" fill="#fff" opacity="0.18" />
    </g>
  )
}

/* ═══════════ Хэлбэрүүд ═══════════ */

/* Бөөрөнхий — нягт дугуй бөмбөлөг */
function RoundDesign({ bloom, wrap, ribbon }) {
  return (
    <>
      <Cone fill={wrap} top={56} bot={92} topW={26} botW={14} />
      {/* арын навчнууд */}
      <Leaf x={20} y={46} len={15} rot={205} opacity={0.7} fill={LEAF_DARK} />
      <Leaf x={60} y={46} len={15} rot={-25} opacity={0.7} fill={LEAF_DARK} />
      <Leaf x={26} y={54} len={12} rot={165} opacity={0.6} />
      <Leaf x={54} y={54} len={12} rot={15} opacity={0.6} />
      {/* арын эгнээ (бүдэг) */}
      <Bloom cx={22} cy={34} r={10} fill={bloom} dim={0.5} rot={12} />
      <Bloom cx={58} cy={34} r={10} fill={bloom} dim={0.5} rot={-8} />
      <Bloom cx={40} cy={22} r={10} fill={bloom} dim={0.35} rot={20} />
      {/* урд эгнээ */}
      <Bloom cx={30} cy={44} r={11} fill={bloom} rot={0} />
      <Bloom cx={50} cy={44} r={11} fill={bloom} rot={25} />
      <Bloom cx={40} cy={34} r={12} fill={bloom} rot={10} />
      <Bow cx={40} cy={59} s={1.1} fill={ribbon} />
    </>
  )
}

/* Урсгал — доош гоёмсог урсдаг */
function CascadeDesign({ bloom, wrap, ribbon }) {
  return (
    <>
      <Cone fill={wrap} top={48} bot={78} topW={22} botW={12} cx={33} />
      <Leaf x={16} y={38} len={14} rot={200} opacity={0.7} fill={LEAF_DARK} />
      <Leaf x={48} y={40} len={13} rot={-20} opacity={0.6} />
      {/* дээд бөөгнөрөл */}
      <Bloom cx={22} cy={28} r={9.5} fill={bloom} dim={0.45} rot={15} />
      <Bloom cx={44} cy={26} r={9.5} fill={bloom} dim={0.4} rot={-10} />
      <Bloom cx={33} cy={18} r={10} fill={bloom} dim={0.2} rot={5} />
      <Bloom cx={32} cy={33} r={11} fill={bloom} rot={20} />
      {/* урсах хэсэг */}
      <Leaf x={44} y={48} len={16} rot={52} opacity={0.75} fill={LEAF_DARK} />
      <Leaf x={52} y={64} len={14} rot={62} opacity={0.65} fill={LEAF_DARK} />
      <Bloom cx={50} cy={50} r={8.5} fill={bloom} dim={0.15} rot={30} />
      <Bloom cx={58} cy={64} r={7} fill={bloom} dim={0.3} rot={0} />
      <Bloom cx={63} cy={77} r={5.5} fill={bloom} dim={0.45} rot={18} />
      <Bloom cx={66} cy={88} r={4} fill={bloom} dim={0.6} rot={0} />
      <Bow cx={33} cy={50} s={1} fill={ribbon} />
    </>
  )
}

/* Задгай — чөлөөт, байгалийн */
function GardenDesign({ bloom, wrap, ribbon }) {
  return (
    <>
      <Cone fill={wrap} top={60} bot={92} topW={26} botW={14} />
      {/* өндөр иш */}
      <path d="M22 56 Q 18 40 14 26" stroke={LEAF_DARK} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M58 56 Q 63 40 67 24" stroke={LEAF_DARK} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M48 56 Q 52 42 55 32" stroke={LEAF} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <Bloom cx={14} cy={24} r={6} fill={bloom} dim={0.3} rot={20} />
      <Bloom cx={67} cy={22} r={5.5} fill={bloom} dim={0.35} rot={0} />
      <Bloom cx={55} cy={30} r={5} fill={bloom} dim={0.25} rot={40} />
      {/* навчнууд задгай */}
      <Leaf x={18} y={48} len={16} rot={215} opacity={0.75} fill={LEAF_DARK} />
      <Leaf x={62} y={48} len={16} rot={-35} opacity={0.75} fill={LEAF_DARK} />
      <Leaf x={24} y={58} len={13} rot={170} opacity={0.6} />
      <Leaf x={56} y={58} len={13} rot={10} opacity={0.6} />
      {/* тэгш бус бөөгнөрөл */}
      <Bloom cx={24} cy={44} r={9.5} fill={bloom} dim={0.45} rot={10} />
      <Bloom cx={56} cy={42} r={9} fill={bloom} dim={0.45} rot={-15} />
      <Bloom cx={38} cy={30} r={9} fill={bloom} dim={0.3} rot={25} />
      <Bloom cx={33} cy={46} r={11} fill={bloom} rot={0} />
      <Bloom cx={48} cy={50} r={9.5} fill={bloom} dim={0.1} rot={30} />
      <Bow cx={40} cy={63} s={1.1} fill={ribbon} />
    </>
  )
}

/* Нэг цэцэг — минималист */
function SingleDesign({ bloom, wrap, ribbon }) {
  return (
    <>
      {/* иш */}
      <path d="M40 34 L 40 88" stroke={LEAF_DARK} strokeWidth="2.2" strokeLinecap="round" />
      <Cone fill={wrap} top={62} bot={92} topW={17} botW={11} />
      {/* навч */}
      <Leaf x={40} y={52} len={15} rot={200} fill={LEAF} opacity={0.9} />
      <Leaf x={40} y={58} len={12} rot={-20} fill={LEAF} opacity={0.75} />
      {/* том цэцэг */}
      <Bloom cx={40} cy={26} r={17} fill={bloom} petals={8} rot={12} />
      <Bow cx={40} cy={65} s={1} fill={ribbon} />
    </>
  )
}

/* Поси — нягт, авсаархан */
function PosyDesign({ bloom, wrap, ribbon }) {
  return (
    <>
      <Cone fill={wrap} top={62} bot={86} topW={21} botW={13} />
      <Leaf x={26} y={56} len={11} rot={195} opacity={0.65} fill={LEAF_DARK} />
      <Leaf x={54} y={56} len={11} rot={-15} opacity={0.65} fill={LEAF_DARK} />
      {/* нягт бөөгнөрөл */}
      <Bloom cx={30} cy={44} r={8.5} fill={bloom} dim={0.4} rot={10} />
      <Bloom cx={50} cy={44} r={8.5} fill={bloom} dim={0.4} rot={-10} />
      <Bloom cx={40} cy={36} r={8.5} fill={bloom} dim={0.25} rot={25} />
      <Bloom cx={34} cy={52} r={8} fill={bloom} dim={0.1} rot={0} />
      <Bloom cx={46} cy={52} r={8} fill={bloom} dim={0.1} rot={20} />
      <Bloom cx={40} cy={45} r={9} fill={bloom} rot={15} />
      <Bow cx={40} cy={65} s={1} fill={ribbon} />
    </>
  )
}

/* Дэлгэр — өргөн дэлгэрсэн боть */
function FanDesign({ bloom, wrap, ribbon }) {
  const stems = [
    { x: 14, y: 30, r: 8 },
    { x: 27, y: 21, r: 8.5 },
    { x: 40, y: 17, r: 9 },
    { x: 53, y: 21, r: 8.5 },
    { x: 66, y: 30, r: 8 },
  ]
  return (
    <>
      {/* ишнүүд боолтны амнаас дэлгэрнэ */}
      {stems.map((s, i) => (
        <path key={i} d={`M40 62 Q ${(40 + s.x) / 2} ${(62 + s.y) / 2 + 2} ${s.x} ${s.y}`}
          stroke={LEAF_DARK} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      ))}
      {/* навчнууд */}
      <Leaf x={24} y={44} len={15} rot={215} opacity={0.6} fill={LEAF_DARK} />
      <Leaf x={56} y={44} len={15} rot={-35} opacity={0.6} fill={LEAF_DARK} />
      <Leaf x={30} y={54} len={12} rot={195} opacity={0.5} />
      <Leaf x={50} y={54} len={12} rot={-15} opacity={0.5} />
      {/* цэцгүүд */}
      {stems.map((s, i) => (
        <Bloom key={i} cx={s.x} cy={s.y} r={s.r} fill={bloom} rot={i * 17} dim={i === 2 ? 0 : 0.2} />
      ))}
      {/* дунд дүүргэлт — ишнүүдийн уулзвар */}
      <Bloom cx={33} cy={36} r={7} fill={bloom} dim={0.35} rot={40} />
      <Bloom cx={47} cy={36} r={7} fill={bloom} dim={0.35} rot={10} />
      <Cone fill={wrap} top={60} bot={92} topW={24} botW={14} />
      <Bow cx={40} cy={63} s={1.1} fill={ribbon} />
    </>
  )
}

/* Зүрхэн — зүрх хэлбэрээр өрсөн */
function HeartDesign({ bloom, wrap, ribbon }) {
  // зүрхний контур — дээд хонхор тод харагдана
  const pts = [
    [40, 26],                            // дундах хонхор
    [33, 17], [24, 15], [17, 22],        // зүүн дээд гэдэс
    [17, 32], [24, 42], [32, 50],        // зүүн хажуу
    [40, 57],                            // доод үзүүр
    [48, 50], [56, 42], [63, 32],        // баруун хажуу
    [63, 22], [56, 15], [47, 17],        // баруун дээд гэдэс
  ]
  return (
    <>
      <Cone fill={wrap} top={62} bot={92} topW={22} botW={13} />
      <Leaf x={22} y={54} len={13} rot={200} opacity={0.6} fill={LEAF_DARK} />
      <Leaf x={58} y={54} len={13} rot={-20} opacity={0.6} fill={LEAF_DARK} />
      {/* дотор дүүргэлт */}
      <Bloom cx={31} cy={28} r={7.5} fill={bloom} dim={0.42} rot={10} />
      <Bloom cx={49} cy={28} r={7.5} fill={bloom} dim={0.42} rot={-10} />
      <Bloom cx={40} cy={37} r={7.5} fill={bloom} dim={0.32} rot={20} />
      <Bloom cx={33} cy={43} r={7} fill={bloom} dim={0.25} rot={35} />
      <Bloom cx={47} cy={43} r={7} fill={bloom} dim={0.25} rot={5} />
      {/* контур */}
      {pts.map(([x, y], i) => (
        <Bloom key={i} cx={x} cy={y} r={6.5} fill={bloom} rot={i * 23} dim={i % 3 === 0 ? 0.1 : 0} />
      ))}
      <Bow cx={40} cy={65} s={1.1} fill={ribbon} />
    </>
  )
}

/* Том бөмбөрцөг — 101 сарнай маягийн өргөн, нягт баглаа */
function GrandDesign({ bloom, wrap, ribbon }) {
  // нягт бөмбөрцөг: эгнээ бүр өргөн, доошлох тусам нарийсна
  const rows = [
    { cy: 20, n: 3, rx: 15, r: 7.5, dim: 0.5 },
    { cy: 30, n: 5, rx: 27, r: 8,   dim: 0.36 },
    { cy: 41, n: 6, rx: 33, r: 8.5, dim: 0.2 },
    { cy: 52, n: 5, rx: 27, r: 8.5, dim: 0.05 },
    { cy: 60, n: 3, rx: 14, r: 8,   dim: 0 },
  ]
  return (
    <>
      <Cone fill={wrap} top={64} bot={94} topW={34} botW={16} />
      <Leaf x={10} y={54} len={17} rot={205} opacity={0.65} fill={LEAF_DARK} />
      <Leaf x={70} y={54} len={17} rot={-25} opacity={0.65} fill={LEAF_DARK} />
      <Leaf x={20} y={62} len={13} rot={180} opacity={0.5} />
      <Leaf x={60} y={62} len={13} rot={0} opacity={0.5} />
      {rows.map((row) =>
        Array.from({ length: row.n }, (_, i) => {
          const x = row.n === 1 ? 40 : 40 - row.rx + (i * (row.rx * 2)) / (row.n - 1)
          return (
            <Bloom key={`${row.cy}-${i}`} cx={x} cy={row.cy} r={row.r}
              fill={bloom} dim={row.dim} rot={i * 31 + row.cy} />
          )
        })
      )}
      <Bow cx={40} cy={67} s={1.2} fill={ribbon} />
    </>
  )
}

/* ── Боломжтой SVG загварууд (admin сонгоно) ── */
export const SHAPE_DESIGNS = [
  { key: 'round',   label: 'Бөөрөнхий' },
  { key: 'cascade', label: 'Урсгал' },
  { key: 'garden',  label: 'Задгай' },
  { key: 'single',  label: 'Нэг цэцэг' },
  { key: 'posy',    label: 'Поси' },
  { key: 'fan',     label: 'Дэлгэр' },
  { key: 'heart',   label: 'Зүрхэн' },
  { key: 'grand',   label: 'Том бөмбөрцөг' },
]

const DESIGNS = {
  round: RoundDesign,
  cascade: CascadeDesign,
  garden: GardenDesign,
  single: SingleDesign,
  posy: PosyDesign,
  fan: FanDesign,
  heart: HeartDesign,
  grand: GrandDesign,
}

/* ── public ShapeSVG ── */
export function ShapeSVG({ id, design, bloom = '#DDACAB', wrap = '#EFE5D0', ribbon = '#C9A961', className, style }) {
  const Design = DESIGNS[design] || DESIGNS[id]
  if (!Design) return null

  return (
    <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <Design bloom={bloom} wrap={wrap} ribbon={ribbon} />
    </svg>
  )
}

/* Хуучин код-той нийцүүлэх re-export (SHAPES-ийг lib/shapes.js эзэмшинэ) */
export { DEFAULT_SHAPES as SHAPES } from '../../lib/shapes'
