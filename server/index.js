/* Vercel serverless entry — app-ийг export хийнэ (app.listen дуудахгүй).
   DB холболтыг app.js доторх middleware хүсэлт бүрийн өмнө баталгаажуулна. */
import 'dotenv/config'
import app from './app.js'

export default app
