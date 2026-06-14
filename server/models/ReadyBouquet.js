import mongoose from 'mongoose'

const ReadyBouquetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contents: { type: String, default: '' },   // тайлбар текст
    price: { type: Number, default: 0 },
    image: { type: String, default: '' },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    // configurator-т дамжих тохиргоо
    preset: {
      flowers: { type: Object, default: {} },   // { 'flowerKey:colorKey': qty }
      shape: { type: String, default: '' },
      wrapping: { type: String, default: '' },
      ribbon: { type: String, default: '' },
    },
  },
  { timestamps: true }
)

export default mongoose.model('ReadyBouquet', ReadyBouquetSchema)
