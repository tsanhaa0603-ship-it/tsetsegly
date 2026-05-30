/* eslint-disable react-refresh/only-export-components */
/* ─────────────────────────────────────────────
   Bouquet shape definitions + SVG components
   All SVGs use viewBox="0 0 80 100"
   Props: bloom, wrap, ribbon
───────────────────────────────────────────── */

const LEAF = '#7FAB7A'

export const SHAPES = [
  {
    id: 'round',
    name: 'Бөөрөнхий',
    desc: 'Сонгодог дугариг хэлбэр',
    en: 'Round bouquet',
  },
  {
    id: 'cascade',
    name: 'Урсгал',
    desc: 'Доош гоёмсогоор урсах',
    en: 'Cascade',
  },
  {
    id: 'garden',
    name: 'Задгай',
    desc: 'Чөлөөт байгалийн аяс',
    en: 'Garden style',
  },
  {
    id: 'single',
    name: 'Нэг цэцэг',
    desc: 'Минималист, цэвэр',
    en: 'Single stem',
  },
  {
    id: 'posy',
    name: 'Поси',
    desc: 'Нягт авсаархан жижиг',
    en: 'Posy / Nosegay',
  },
  {
    id: 'fan',
    name: 'Дэлгэр',
    desc: 'Өргөн, баян дэлгэрэнгүй',
    en: 'Fan / Sheaf',
  },
]

/* ── individual shape SVG content (no <svg> wrapper) ── */
function RoundContent({ bloom, wrap, ribbon }) {
  return (
    <>
      {/* Stem wrap */}
      <path d="M30 61 L50 61 L46 91 L34 91 Z" fill={wrap} />
      {/* Ribbon */}
      <rect x="27" y="57" width="26" height="6" rx="3" fill={ribbon} />
      {/* Leaves peeking sides */}
      <ellipse cx="17" cy="52" rx="10" ry="4" transform="rotate(-38 17 52)" fill={LEAF} opacity="0.6" />
      <ellipse cx="63" cy="52" rx="10" ry="4" transform="rotate(38 63 52)" fill={LEAF} opacity="0.6" />
      {/* Main dome */}
      <ellipse cx="40" cy="36" rx="27" ry="24" fill={bloom} />
      {/* Flower texture – translucent circles */}
      <circle cx="27" cy="29" r="7.5" fill="white" fillOpacity="0.22" />
      <circle cx="40" cy="20" r="9"   fill="white" fillOpacity="0.22" />
      <circle cx="53" cy="29" r="7.5" fill="white" fillOpacity="0.22" />
      <circle cx="21" cy="43" r="6"   fill="white" fillOpacity="0.17" />
      <circle cx="59" cy="43" r="6"   fill="white" fillOpacity="0.17" />
      <circle cx="40" cy="48" r="6.5" fill="white" fillOpacity="0.17" />
    </>
  )
}

function CascadeContent({ bloom, wrap, ribbon }) {
  return (
    <>
      {/* Stem wrap */}
      <path d="M23 51 L43 51 L39 77 L27 77 Z" fill={wrap} />
      <rect x="21" y="47" width="24" height="6" rx="3" fill={ribbon} />
      {/* Leaf */}
      <ellipse cx="13" cy="42" rx="10" ry="4" transform="rotate(-42 13 42)" fill={LEAF} opacity="0.6" />
      {/* Main cluster */}
      <ellipse cx="33" cy="27" rx="23" ry="21" fill={bloom} />
      {/* Trailing cascade */}
      <ellipse cx="52" cy="52" rx="15" ry="13" fill={bloom} opacity="0.85" />
      <ellipse cx="61" cy="70" rx="10.5" ry="9.5" fill={bloom} opacity="0.65" />
      <ellipse cx="65" cy="85" rx="7"   ry="6.5" fill={bloom} opacity="0.45" />
      <ellipse cx="67" cy="96" rx="4.5" ry="4"   fill={bloom} opacity="0.25" />
      {/* Flower textures on main */}
      <circle cx="23" cy="22" r="7.5" fill="white" fillOpacity="0.22" />
      <circle cx="36" cy="14" r="8.5" fill="white" fillOpacity="0.22" />
      <circle cx="48" cy="24" r="7"   fill="white" fillOpacity="0.22" />
      <circle cx="26" cy="38" r="5.5" fill="white" fillOpacity="0.17" />
      {/* Small texture on trail */}
      <circle cx="52" cy="50" r="5"   fill="white" fillOpacity="0.18" />
      <circle cx="61" cy="68" r="4"   fill="white" fillOpacity="0.15" />
    </>
  )
}

function GardenContent({ bloom, wrap, ribbon }) {
  return (
    <>
      {/* Stem wrap */}
      <path d="M29 63 L51 63 L47 89 L33 89 Z" fill={wrap} />
      <rect x="26" y="59" width="28" height="6" rx="3" fill={ribbon} />
      {/* Organic blob */}
      <path
        d="M14 53 C10 37 16 15 32 8 C41 3 57 5 65 17 C74 31 72 52 64 58 C56 50 46 63 30 63 C19 63 15 60 14 53 Z"
        fill={bloom}
      />
      {/* Tall stems sticking above blob */}
      <line x1="20" y1="53" x2="14" y2="30" stroke={LEAF} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="14" cy="27" r="5" fill={bloom} opacity="0.9" />
      <line x1="63" y1="50" x2="68" y2="24" stroke={LEAF} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="68" cy="21" r="4.5" fill={bloom} opacity="0.75" />
      {/* Extra wispy stem */}
      <line x1="50" y1="54" x2="55" y2="35" stroke={LEAF} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="55" cy="32" r="4" fill={bloom} opacity="0.7" />
      {/* Flower textures */}
      <circle cx="29" cy="24" r="8"   fill="white" fillOpacity="0.2" />
      <circle cx="48" cy="19" r="7.5" fill="white" fillOpacity="0.2" />
      <circle cx="40" cy="38" r="6.5" fill="white" fillOpacity="0.18" />
      <circle cx="24" cy="44" r="5.5" fill="white" fillOpacity="0.15" />
      <circle cx="58" cy="38" r="5"   fill="white" fillOpacity="0.15" />
      {/* Side leaves */}
      <ellipse cx="9" cy="44" rx="9" ry="3.5" transform="rotate(-50 9 44)" fill={LEAF} opacity="0.55" />
      <ellipse cx="62" cy="28" rx="7" ry="3" transform="rotate(30 62 28)" fill={LEAF} opacity="0.5" />
    </>
  )
}

function SingleContent({ bloom, wrap, ribbon }) {
  return (
    <>
      {/* Stem */}
      <rect x="38.5" y="34" width="3" height="60" rx="1.5" fill={LEAF} />
      {/* Wrap */}
      <path d="M32 77 L48 77 L46 93 L34 93 Z" fill={wrap} />
      <rect x="30" y="73" width="20" height="6" rx="3" fill={ribbon} />
      {/* Leaf */}
      <ellipse cx="29" cy="59" rx="11" ry="5" transform="rotate(-36 29 59)" fill={LEAF} opacity="0.75" />
      {/* Small leaf other side */}
      <ellipse cx="51" cy="68" rx="8" ry="3.5" transform="rotate(30 51 68)" fill={LEAF} opacity="0.55" />
      {/* Petals – 6 petals radiating from center (40, 22) */}
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg - 90) * (Math.PI / 180)
        const cx = 40 + 15 * Math.cos(rad)
        const cy = 22 + 15 * Math.sin(rad)
        return (
          <ellipse
            key={deg}
            cx={cx}
            cy={cy}
            rx="6.5"
            ry="9"
            transform={`rotate(${deg} ${cx} ${cy})`}
            fill={bloom}
            opacity="0.9"
          />
        )
      })}
      {/* Center */}
      <circle cx="40" cy="22" r="9" fill={bloom} />
      <circle cx="40" cy="22" r="4.5" fill="white" fillOpacity="0.45" />
    </>
  )
}

function PosyContent({ bloom, wrap, ribbon }) {
  return (
    <>
      {/* Stem wrap – short */}
      <path d="M32 67 L48 67 L46 84 L34 84 Z" fill={wrap} />
      <rect x="29" y="63" width="22" height="6" rx="3" fill={ribbon} />
      {/* Leaves */}
      <ellipse cx="24" cy="62" rx="8" ry="3.5" transform="rotate(-30 24 62)" fill={LEAF} opacity="0.55" />
      <ellipse cx="56" cy="62" rx="8" ry="3.5" transform="rotate(30 56 62)" fill={LEAF} opacity="0.55" />
      {/* Tight compact dome */}
      <ellipse cx="40" cy="47" rx="20" ry="18" fill={bloom} />
      {/* Dense flower circles */}
      <circle cx="30" cy="42" r="6"   fill="white" fillOpacity="0.24" />
      <circle cx="40" cy="34" r="7"   fill="white" fillOpacity="0.24" />
      <circle cx="50" cy="42" r="6"   fill="white" fillOpacity="0.24" />
      <circle cx="34" cy="54" r="5"   fill="white" fillOpacity="0.2" />
      <circle cx="46" cy="54" r="5"   fill="white" fillOpacity="0.2" />
      <circle cx="40" cy="47" r="4.5" fill="white" fillOpacity="0.18" />
    </>
  )
}

function FanContent({ bloom, wrap, ribbon }) {
  // 5 fan stems from convergence point (40, 88)
  const stems = [
    { x2: 8,  y2: 22 },
    { x2: 23, y2: 12 },
    { x2: 40, y2: 8  },
    { x2: 57, y2: 12 },
    { x2: 72, y2: 22 },
  ]
  const flowerCenters = [
    { cx: 8,  cy: 19 },
    { cx: 23, cy: 9  },
    { cx: 40, cy: 5  },
    { cx: 57, cy: 9  },
    { cx: 72, cy: 19 },
  ]
  return (
    <>
      {/* Foliage fill between stems */}
      <ellipse cx="40" cy="38" rx="36" ry="18" fill={LEAF} opacity="0.18" />
      {/* Stems */}
      {stems.map((s, i) => (
        <line
          key={i}
          x1="40" y1="84"
          x2={s.x2} y2={s.y2}
          stroke={LEAF} strokeWidth="2.2" strokeLinecap="round"
        />
      ))}
      {/* Flower heads */}
      {flowerCenters.map((f, i) => (
        <g key={i}>
          <circle cx={f.cx} cy={f.cy} r="8.5" fill={bloom} />
          <circle cx={f.cx} cy={f.cy} r="4" fill="white" fillOpacity="0.28" />
        </g>
      ))}
      {/* Side leaves */}
      <ellipse cx="18" cy="44" rx="8" ry="3" transform="rotate(-18 18 44)" fill={LEAF} opacity="0.5" />
      <ellipse cx="62" cy="44" rx="8" ry="3" transform="rotate(18 62 44)" fill={LEAF} opacity="0.5" />
      {/* Wrap + ribbon */}
      <path d="M33 82 L47 82 L45 96 L35 96 Z" fill={wrap} />
      <rect x="31" y="78" width="18" height="6" rx="3" fill={ribbon} />
    </>
  )
}

/* ── public ShapeSVG component ── */
export function ShapeSVG({ id, bloom = '#DDACAB', wrap = '#EFE5D0', ribbon = '#C9A961', className, style }) {
  const Content = {
    round:   RoundContent,
    cascade: CascadeContent,
    garden:  GardenContent,
    single:  SingleContent,
    posy:    PosyContent,
    fan:     FanContent,
  }[id]

  if (!Content) return null

  return (
    <svg
      viewBox="0 0 80 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <Content bloom={bloom} wrap={wrap} ribbon={ribbon} />
    </svg>
  )
}
