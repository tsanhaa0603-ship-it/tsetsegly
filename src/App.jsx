import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Build from './pages/Build'
import Gift from './pages/Gift'

function Placeholder({ title }) {
  return (
    <main className="min-h-screen flex items-center justify-center pt-16">
      <p className="font-playfair italic text-3xl gold-text">{title}</p>
    </main>
  )
}

export default function App() {
  const location = useLocation()
  // Gift хуудас бол бүтэн дэлгэцийн романтик дизайнтай — navbar харуулахгүй
  const hideNav = location.pathname.startsWith('/gift/')

  return (
    <>
      {!hideNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/build" element={<Build />} />
        <Route path="/gift/:id" element={<Gift />} />
        <Route path="/about" element={<Placeholder title="Тухай" />} />
        <Route path="/contact" element={<Placeholder title="Холбоо барих" />} />
      </Routes>
    </>
  )
}
