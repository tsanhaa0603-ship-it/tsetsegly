import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../lib/analytics'
import { titleForPath } from '../lib/seoRoutes'

/* Хуудас (route) солигдох бүрт дэлгэцийг хамгийн дээрээс эхлүүлнэ.
   Эс бөгөөс шинэ хуудас өмнөх скролл байрлал дээрээс нээгддэг.

   Мөн хэмжилтэд хуудасны үзэлт илгээнэ — SPA учир GA4, Meta Pixel
   хоёулаа route солигдохыг өөрөө анзаардаггүй. Гараар илгээхгүй бол
   зөвхөн хамгийн эхний хуудас тоологдоно. */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)

    /* Статик маршрутын гарчгийг сэргээнэ. SPA дотор шилжихэд хуучин
       хуудсын <title> үлддэг тул хэмжилтэд ч, таб дээр ч буруу
       харагддаг. Динамик хуудас (/ready/:slug) өөрөө гарчгаа тавина. */
    const title = titleForPath(pathname)
    if (title) document.title = title

    /* Алгасах:
       /gift/  — хувийн захидал, зураг агуулдаг
       /admin  — дотоод хуудас
       /ready/<slug> — гарчиг нь өгөгдөл ирсний дараа тодордог тул
                       ReadyBouquetDetail өөрөө илгээнэ */
    const skip =
      pathname.startsWith('/gift/') ||
      pathname.startsWith('/admin') ||
      /^\/ready\/.+/.test(pathname)

    if (!skip) trackPageView(pathname, title || undefined)
  }, [pathname])

  return null
}
