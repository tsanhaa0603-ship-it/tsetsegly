import mongoose from 'mongoose'

// Serverless орчинд warm invocation бүрт дахин холбохгүйн тулд promise-ийг cache хийнэ
let cached = null

export default function connectDB() {
  // Аль хэдийн холбогдсон бол шууд буцна
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose)

  if (!cached) {
    const uri = process.env.MONGODB_URI
    if (!uri) {
      return Promise.reject(new Error('MONGODB_URI тохируулаагүй байна. .env файлаа шалгана уу.'))
    }
    mongoose.set('strictQuery', true)
    cached = mongoose
      .connect(uri)
      .then((m) => {
        console.log('✅ MongoDB Atlas-тай холбогдлоо')
        return m
      })
      .catch((err) => {
        cached = null // дараагийн хүсэлтэд дахин оролдоно
        throw err
      })
  }
  return cached
}
