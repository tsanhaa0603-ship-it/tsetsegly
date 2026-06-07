/* Цэцгийн каталогийг дахин seed хийх нэг удаагийн скрипт.
   Ашиглах: cd server && node scripts/reseed.js
   (.env доторх MONGODB_URI-г ашиглаж байгаа DB-г шинэчилнэ) */
import 'dotenv/config'
import mongoose from 'mongoose'
import FlowerType from '../models/FlowerType.js'
import { DEFAULT_FLOWERS } from '../config/seedFlowers.js'

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('MONGODB_URI тохируулаагүй байна')
  process.exit(1)
}

await mongoose.connect(uri)
const before = await FlowerType.countDocuments()
await FlowerType.deleteMany({})
await FlowerType.insertMany(DEFAULT_FLOWERS)
const after = await FlowerType.countDocuments()
const colors = DEFAULT_FLOWERS.reduce((s, f) => s + f.colors.length, 0)
console.log(`Reseed дууслаа: ${before} → ${after} ангилал, ${colors} өнгө`)
await mongoose.disconnect()
