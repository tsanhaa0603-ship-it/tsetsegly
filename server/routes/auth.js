import { Router } from 'express'
import jwt from 'jsonwebtoken'

const router = Router()

/* POST /api/auth/login — admin нэвтрэх */
router.post('/login', (req, res) => {
  const { username, password } = req.body || {}

  const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin'
  const ADMIN_PASS = process.env.ADMIN_PASSWORD

  if (!ADMIN_PASS) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD тохируулаагүй байна' })
  }
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'JWT_SECRET тохируулаагүй байна' })
  }
  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return res.status(401).json({ error: 'Нэр эсвэл нууц үг буруу байна' })
  }

  const token = jwt.sign(
    { role: 'admin', username: ADMIN_USER },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
  res.json({ token, username: ADMIN_USER })
})

export default router
