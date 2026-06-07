/* Цэцгийн каталогийн анхдагч өгөгдөл — collection хоосон үед lazy seed хийнэ */
export const DEFAULT_FLOWERS = [
  {
    key: 'rose', name: 'Сарнай', emoji: '🌹', hint: 'Хайр дурлалын бэлэг', order: 1,
    colors: [
      { key: 'red',      name: 'Улаан сарнай',  hex: '#C0392B', price: 25000, image: '/flowers/rose-red.png' },
      { key: 'pink',     name: 'Ягаан сарнай',  hex: '#EFA0B8', price: 25000, image: '/flowers/rose-pink.png' },
      { key: 'white',    name: 'Цагаан сарнай', hex: '#FBF7EF', price: 27000, image: '/flowers/rose-white.png' },
      { key: 'yellow',   name: 'Шар сарнай',    hex: '#F2CB4D', price: 26000, image: '/flowers/rose-yellow.png' },
      { key: 'lavender', name: 'Лаванд сарнай', hex: '#B9A4D4', price: 30000, image: '/flowers/garden-rose-mauve.png' },
    ],
  },
  {
    key: 'chrysan', name: 'Хризантем', emoji: '🌸', hint: 'Цэвэр, нарийн гоо', order: 2,
    colors: [
      { key: 'white',  name: 'Цагаан хризантем', hex: '#FBF7EF', price: 15000, image: '/flowers/chrysanthemum-white.png' },
      { key: 'pink',   name: 'Ягаан хризантем',  hex: '#EFA0B8', price: 15000, image: '/flowers/chrysanthemum-peony-pink.png' },
      { key: 'purple', name: 'Нил хризантем',    hex: '#7D5BA6', price: 17000, image: '/flowers/chrysanthemum-peony-mauve.png' },
    ],
  },
  {
    key: 'tulip', name: 'Лали', emoji: '🌷', hint: 'Хавар, шинэ эхлэл', order: 3,
    colors: [
      { key: 'red',    name: 'Улаан лали', hex: '#C0392B', price: 20000, image: '/flowers/tulip-red.png' },
      { key: 'pink',   name: 'Ягаан лали', hex: '#EFA0B8', price: 20000, image: '/flowers/tulip-pink.png' },
      { key: 'yellow', name: 'Шар лали',   hex: '#F2CB4D', price: 22000, image: '/flowers/tulip-yellow.png' },
    ],
  },
  {
    key: 'sunflower', name: 'Наранцэцэг', emoji: '🌻', hint: 'Баяр хөөр, эрч хүч', order: 4,
    colors: [
      { key: 'yellow', name: 'Шар наранцэцэг',      hex: '#F2CB4D', price: 18000, image: '/flowers/sunflower.png' },
      { key: 'orange', name: 'Улбар шар наранцэцэг', hex: '#E8843C', price: 19000, image: '' },
    ],
  },
  {
    key: 'orchid', name: 'Орхидей', emoji: '💜', hint: 'Тансаг, ховор гоо', order: 5,
    colors: [
      { key: 'red',    name: 'Улаан орхидей',     hex: '#C0392B', price: 35000, image: '/flowers/orchid-red.png' },
      { key: 'purple', name: 'Нил ягаан орхидей', hex: '#7D5BA6', price: 35000, image: '' },
      { key: 'white',  name: 'Цагаан орхидей',    hex: '#FBF7EF', price: 37000, image: '' },
    ],
  },
  {
    key: 'peony', name: 'Пеони', emoji: '🌺', hint: 'Элбэг дэлбэг аз жаргал', order: 6,
    colors: [
      { key: 'pink',   name: 'Ягаан пеони',  hex: '#EFA0B8', price: 30000, image: '/flowers/peony-pink.png' },
      { key: 'white',  name: 'Цагаан пеони', hex: '#FBF7EF', price: 32000, image: '/flowers/chrysanthemum-peony-white.png' },
      { key: 'yellow', name: 'Шар пеони',    hex: '#F2CB4D', price: 33000, image: '' },
    ],
  },
]
