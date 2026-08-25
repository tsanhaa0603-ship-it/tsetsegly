/* ─────────────────────────────────────────────
   Нийтийн маршрутын meta — нэг эх сурвалж

   Хоёр газар ашиглагдана:
   1. tools/prerender-seo.mjs — build үед статик HTML, sitemap үүсгэнэ
   2. src/components/ScrollToTop.jsx — SPA дотор шилжихэд document.title
      шинэчилж, хэмжилтэд зөв гарчиг илгээнэ

   Гарчиг ~60 тэмдэгт, тайлбар 150–160 тэмдэгт байвал Google хайлтын
   үр дүнд тасрахгүй бүтнээр харагдана.
───────────────────────────────────────────── */

export const SEO_ROUTES = [
  {
    path: '/',
    file: 'index.html',
    priority: '1.0',
    changefreq: 'weekly',
    title: 'Tsetsegly — Захиалгат цэцгийн дэлгүүр | Цэцэг хүргэлт Улаанбаатар',
    description:
      'Цэцэг, боолт, хэлбэрээ өөрөө сонгож баглаагаа зохионо. Улаанбаатар даяар хүргэлт ₮10,000, ₮150,000-аас дээш захиалгад үнэгүй. Утас 8844-4310.',
  },
  {
    path: '/ready',
    file: 'ready/index.html',
    priority: '0.9',
    changefreq: 'weekly',
    title: 'Бэлэн цэцгийн баглаа — үнэ, зураг | Tsetsegly',
    description:
      'Гар хийцийн бэлэн баглаанууд: сарнай, башир, лили, барын чих. Сонгоод шууд захиалаарай. Улаанбаатарт ижил өдөртөө хүргэнэ.',
  },
  {
    path: '/build',
    file: 'build/index.html',
    priority: '0.9',
    changefreq: 'weekly',
    title: 'Цэцгийн баглаа өөрөө зохиох | Tsetsegly',
    description:
      '15 төрлийн цэцэг, 25 боолтын цаас, 6 хэлбэрээс сонгож өөрийн баглаагаа зохионо. QR-аар нээгддэг хувийн захидлын хуудас дагалдана.',
  },
  {
    path: '/about',
    file: 'about/index.html',
    priority: '0.7',
    changefreq: 'monthly',
    title: 'Бидний тухай | Tsetsegly захиалгат цэцгийн дэлгүүр',
    description:
      'Tsetsegly бол Улаанбаатарын захиалгат цэцгийн дэлгүүр. Баглаа бүрийг захиалга ирсний дараа гараар бэлтгэдэг — тавиур дээр зогссон баглаа байхгүй.',
  },
  {
    path: '/contact',
    file: 'contact/index.html',
    priority: '0.6',
    changefreq: 'monthly',
    title: 'Холбоо барих, хүргэлтийн бүс | Tsetsegly',
    description:
      'Утас 8844-4310, ажлын цаг 10:00–20:00. Улаанбаатарын 6 дүүрэгт хүргэнэ, төлбөр ₮10,000. Салбар дэлгүүргүй — зөвхөн хүргэлт.',
  },
]

/* Замаас гарчиг олох. /ready/:slug зэрэг динамик хуудасны гарчгийг
   тухайн хуудас өөрөө тавьдаг тул энд null буцаана. */
export function titleForPath(pathname) {
  return SEO_ROUTES.find((r) => r.path === pathname)?.title || null
}
