import jwt from 'jsonwebtoken'

/* Admin токен шалгах middleware */
export default function auth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Нэвтрэх шаардлагатай' })
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Token хүчингүй эсвэл хугацаа дууссан' })
  }
}
