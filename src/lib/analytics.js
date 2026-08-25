/* ─────────────────────────────────────────────
   Хэмжилт — Google Analytics 4 ба Meta Pixel

   Хоёр скриптийг build үед tools/prerender-seo.mjs суулгадаг
   (GA4_ID, META_PIXEL_ID орчны хувьсагчаар). Энд зөвхөн
   үйлдлүүдийг илгээнэ.

   Хэрэв ID тохируулаагүй бол gtag/fbq байхгүй — бүх функц
   чимээгүйгээр юу ч хийхгүй өнгөрнө. Хөгжүүлэлтэд ч, зар
   ажиллуулаагүй үед ч алдаа гаргахгүй.
───────────────────────────────────────────── */

const hasGtag = () => typeof window !== 'undefined' && typeof window.gtag === 'function'
const hasFbq = () => typeof window !== 'undefined' && typeof window.fbq === 'function'

/* SPA учир хуудас солигдоход GA4 өөрөө page_view илгээдэггүй.
   Гараар илгээхгүй бол зөвхөн эхний хуудас л тоологдоно. */
export function trackPageView(path, title) {
  if (hasGtag()) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
      page_location: window.location.href,
    })
  }
  if (hasFbq()) {
    window.fbq('track', 'PageView')
  }
}

/* Бэлэн баглааны дэлгэрэнгүй хуудас үзсэн */
export function trackViewItem({ id, name, price }) {
  if (hasGtag()) {
    window.gtag('event', 'view_item', {
      currency: 'MNT',
      value: Number(price) || 0,
      items: [{ item_id: id, item_name: name, price: Number(price) || 0 }],
    })
  }
  if (hasFbq()) {
    window.fbq('track', 'ViewContent', {
      content_ids: [id],
      content_name: name,
      content_type: 'product',
      value: Number(price) || 0,
      currency: 'MNT',
    })
  }
}

/* Конструкторт баглаа зохиож эхэлсэн — юүлэлтийн эхлэл */
export function trackBeginBuild() {
  if (hasGtag()) window.gtag('event', 'begin_build')
  if (hasFbq()) window.fbq('trackCustom', 'BeginBuild')
}

/* Захиалга үүсгэж төлбөр рүү орсон */
export function trackBeginCheckout({ value, items }) {
  if (hasGtag()) {
    window.gtag('event', 'begin_checkout', {
      currency: 'MNT',
      value: Number(value) || 0,
      items: items || [],
    })
  }
  if (hasFbq()) {
    window.fbq('track', 'InitiateCheckout', {
      value: Number(value) || 0,
      currency: 'MNT',
      num_items: (items || []).length,
    })
  }
}

/* Төлбөр амжилттай — хамгийн чухал үйлдэл.
   Meta зарын оптимизаци, GA4-ийн орлогын тайлан хоёулаа эндээс. */
export function trackPurchase({ orderId, value, items }) {
  if (hasGtag()) {
    window.gtag('event', 'purchase', {
      transaction_id: orderId,
      currency: 'MNT',
      value: Number(value) || 0,
      items: items || [],
    })
  }
  if (hasFbq()) {
    window.fbq('track', 'Purchase', {
      value: Number(value) || 0,
      currency: 'MNT',
      content_ids: (items || []).map((i) => i.item_id),
      content_type: 'product',
    })
  }
}

/* ─────────────────────────────────────────────
   Бэлгийн хуудасны тархалт

   /gift/:id хаягийг хэмжилтэд ХЭЗЭЭ Ч илгээхгүй — хувийн захидал,
   зураг агуулдаг. Зөвхөн үйлдэл тоологдоно, ямар бэлэг болох нь
   мэдэгдэхгүй. Ингэснээр тархалтын гогцоог хэмжиж чадна:

     gift_opened → gift_shared → gift_cta_click → begin_build
─────────────────────────────────────────── */

/* Хүлээн авагч бэлгээ нээсэн */
export function trackGiftOpened() {
  if (hasGtag()) window.gtag('event', 'gift_opened')
  if (hasFbq()) window.fbq('trackCustom', 'GiftOpened')
}

/* Хүлээн авагч хуудсаа хуваалцсан — үнэгүй хүрээний гол хэмжүүр.
   method: 'native' (утасны хуваалцах цэс) эсвэл 'copy' */
export function trackGiftShared(method) {
  if (hasGtag()) window.gtag('event', 'share', { method, content_type: 'gift_page' })
  if (hasFbq()) window.fbq('trackCustom', 'GiftShared', { method })
}

/* Бэлгийн хуудаснаас «өөрөө бүтээх» рүү шилжсэн — гогцоо хаагдаж
   шинэ хэрэглэгч болж эхлэв */
export function trackGiftCtaClick() {
  if (hasGtag()) window.gtag('event', 'gift_cta_click')
  if (hasFbq()) window.fbq('trackCustom', 'GiftCtaClick')
}

/* Захиалгын мөрүүдийг GA4-ийн items хэлбэрт хөрвүүлнэ */
export function toItems(flowers) {
  return (flowers || []).map((f) => ({
    item_id: f.vKey || f.id || f.name,
    item_name: f.name,
    price: Number(f.price) || 0,
    quantity: Number(f.qty) || 1,
  }))
}
