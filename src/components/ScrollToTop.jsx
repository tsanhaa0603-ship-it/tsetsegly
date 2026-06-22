import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/* Хуудас (route) солигдох бүрт дэлгэцийг хамгийн дээрээс эхлүүлнэ.
   Эс бөгөөс шинэ хуудас өмнөх скролл байрлал дээрээс нээгддэг. */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
