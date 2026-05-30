import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Build from './pages/Build'
import Gift from './pages/Gift'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import { getToken } from './lib/api'

function Placeholder({ title }) {
  return (
    <main className="min-h-screen flex items-center justify-center pt-16">
      <p className="font-playfair italic text-3xl gold-text">{title}</p>
    </main>
  )
}

/* Нэвтрээгүй бол /admin/login руу чиглүүлнэ */
function RequireAuth({ children }) {
  if (!getToken()) return <Navigate to="/admin/login" replace />
  return children
}

export default function App() {
  const location = useLocation()
  // Gift болон Admin хуудаснууд өөрийн бүтэн дэлгэцийн дизайнтай — navbar харуулахгүй
  const hideNav =
    location.pathname.startsWith('/gift/') || location.pathname.startsWith('/admin')

  return (
    <>
      {!hideNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/build" element={<Build />} />
        <Route path="/gift/:id" element={<Gift />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
        <Route path="/about" element={<Placeholder title="Тухай" />} />
        <Route path="/contact" element={<Placeholder title="Холбоо барих" />} />
      </Routes>
    </>
  )
}
