/* Local development entry — DB-тэй холбогдоод порт сонсоно.
   (Vercel дээр index.js ашиглагдана) */
import 'dotenv/config'
import app from './app.js'
import connectDB from './config/db.js'

const PORT = process.env.PORT || 5000

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🌸 Tsetsegly API ${PORT} порт дээр ажиллаж байна`))
  })
  .catch((err) => {
    console.error('❌ Сервер эхлүүлэхэд алдаа гарлаа:', err.message)
    process.exit(1)
  })
