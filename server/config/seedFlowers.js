/* Цэцгийн каталогийн анхдагч өгөгдөл (15 ангилал) — collection хоосон үед lazy seed хийнэ */
const IMG = '/flowers/'

export const DEFAULT_FLOWERS = [
  {
    key: 'rose', name: 'Сарнай', emoji: '🌹', hint: 'Хайр дурлалын бэлэг', order: 1,
    colors: [
      { key: 'red',      name: 'Улаан сарнай',     hex: '#C0392B', price: 9000, image: IMG + 'rose-red.png' },
      { key: 'pink',     name: 'Ягаан сарнай',     hex: '#EFA0B8', price: 9000, image: IMG + 'rose-pink.png' },
      { key: 'white',    name: 'Цагаан сарнай',    hex: '#FBF7EF', price: 9000, image: IMG + 'rose-white.png' },
      { key: 'yellow',   name: 'Шар сарнай',       hex: '#F2CB4D', price: 9000, image: IMG + 'rose-yellow.png' },
      { key: 'deeppink', name: 'Тод ягаан сарнай', hex: '#E84393', price: 9000, image: IMG + 'rose-deep-pink.png' },
    ],
  },
  {
    key: 'minirose', name: 'Мини сарнай', emoji: '🌹', hint: 'Жижиг, эвхэмж', order: 2,
    colors: [
      { key: 'pink',   name: 'Ягаан мини сарнай', hex: '#EFA0B8', price: 6000, image: IMG + 'mini-rose-pink.png' },
      { key: 'yellow', name: 'Шар мини сарнай',   hex: '#F2CB4D', price: 6000, image: IMG + 'mini-rose-yellow.png' },
      { key: 'red',    name: 'Улаан мини сарнай', hex: '#C0392B', price: 6000, image: IMG + 'mini-rose-red.png' },
      { key: 'blush',  name: 'Хул мини сарнай',   hex: '#E8A87C', price: 6000, image: IMG + 'mini-rose-blush.png' },
    ],
  },
  {
    key: 'bashir', name: 'Башир', emoji: '🌹', hint: 'Тансаг цэцэглэлт', order: 3,
    colors: [
      { key: 'red',     name: 'Улаан башир (Don Pedro)',       hex: '#C0392B', price: 12000, image: IMG + 'garden-rose-red.png' },
      { key: 'pink',    name: 'Ягаан башир (Agnese)',          hex: '#EFA0B8', price: 12000, image: IMG + 'garden-rose-mauve.png' },
      { key: 'white',   name: 'Цагаан башир (Moonlight)',      hex: '#FBF7EF', price: 12000, image: IMG + 'garden-rose-white.png' },
      { key: 'yellow',  name: 'Шар башир (Hermes)',            hex: '#F2CB4D', price: 12000, image: IMG + 'garden-rose-yellow.png' },
      { key: 'purple',  name: 'Нил ягаан башир (Monsenor)',    hex: '#9B6BB0', price: 12000, image: IMG + 'garden-rose-purple.png' },
      { key: 'bicolor', name: 'Ирмэг ягаан башир (NVA Isola)', hex: '#D98AA8', price: 12000, image: IMG + 'garden-rose-bicolor.png' },
    ],
  },
  {
    key: 'lily', name: 'Лили', emoji: '🌸', hint: 'Гоёмсог, анхилам', order: 4,
    colors: [
      { key: 'yellow',  name: 'Шар лили',                   hex: '#F2CB4D', price: 10000, image: IMG + 'lily-yellow.png' },
      { key: 'pink',    name: 'Ягаан лили',                 hex: '#EFA0B8', price: 10000, image: IMG + 'lily-pink.png' },
      { key: 'white',   name: 'Цагаан лили',                hex: '#FBF7EF', price: 10000, image: IMG + 'lily-white.png' },
      { key: 'orange',  name: 'Улбар шар лили',             hex: '#E8843C', price: 10000, image: IMG + 'lily-orange.png' },
      { key: 'dwhite',  name: 'Давхар дэлбээт цагаан лили', hex: '#FBF7EF', price: 13000, image: IMG + 'lily-double-white.png' },
      { key: 'dblue',   name: 'Давхар дэлбээт цэнхэр лили', hex: '#6AA0D8', price: 13000, image: IMG + 'lily-double-blue.png' },
      { key: 'dpink',   name: 'Давхар дэлбээт ягаан лили',  hex: '#EFA0B8', price: 13000, image: IMG + 'lily-double-pink.png' },
      { key: 'dpurple', name: 'Давхар дэлбээт нил лили',    hex: '#6A3D8F', price: 13000, image: IMG + 'lily-double-purple.png' },
    ],
  },
  {
    key: 'hydrangea', name: 'Барын чих', emoji: '💠', hint: 'Том, баялаг дэлбээ', order: 5,
    colors: [
      { key: 'white', name: 'Цагаан барын чих', hex: '#FBF7EF', price: 18000, image: IMG + 'hydrangea-white.png' },
      { key: 'blue',  name: 'Цэнхэр барын чих', hex: '#6AA0D8', price: 18000, image: IMG + 'hydrangea-blue.png' },
      { key: 'pink',  name: 'Ягаан барын чих',  hex: '#EFA0B8', price: 18000, image: IMG + 'hydrangea-pink.png' },
    ],
  },
  {
    key: 'sunflower', name: 'Наранцэцэг', emoji: '🌻', hint: 'Баяр хөөр, эрч хүч', order: 6,
    colors: [
      { key: 'yellow', name: 'Наранцэцэг', hex: '#F2CB4D', price: 8000, image: IMG + 'sunflower.png' },
    ],
  },
  {
    key: 'eustoma', name: 'Лизантус', emoji: '🌷', hint: 'Зөөлөн, романтик', order: 7,
    colors: [
      { key: 'white',  name: 'Цагаан лизантус',    hex: '#FBF7EF', price: 9000, image: IMG + 'eustoma-white.png' },
      { key: 'purple', name: 'Нил ягаан лизантус', hex: '#9B6BB0', price: 9000, image: IMG + 'eustoma-purple.png' },
      { key: 'pink',   name: 'Ягаан лизантус',     hex: '#EFA0B8', price: 9000, image: IMG + 'eustoma-pink.png' },
    ],
  },
  {
    key: 'udval', name: 'Удвал', emoji: '🌼', hint: 'Намрын сонгодог', order: 8,
    colors: [
      { key: 'white',  name: 'Цагаан удвал',        hex: '#FBF7EF', price: 7000, image: IMG + 'chrysanthemum-white.png' },
      { key: 'yellow', name: 'Шар удвал',           hex: '#F2CB4D', price: 7000, image: IMG + 'chrysanthemum-yellow.png' },
      { key: 'bwhite', name: 'Бондгор удвал цагаан', hex: '#FBF7EF', price: 9000, image: IMG + 'chrysanthemum-peony-white.png' },
      { key: 'bpink',  name: 'Бондгор удвал ягаан',  hex: '#EFA0B8', price: 9000, image: IMG + 'chrysanthemum-peony-pink.png' },
      { key: 'bblue',  name: 'Бондгор удвал цэнхэр', hex: '#6AA0D8', price: 9000, image: IMG + 'chrysanthemum-blue.png' },
    ],
  },
  {
    key: 'pingpong', name: 'Пинг понг', emoji: '🌼', hint: 'Бөмбөлөг хэлбэртэй', order: 9,
    colors: [
      { key: 'white',  name: 'Цагаан пинг понг', hex: '#FBF7EF', price: 8000, image: IMG + 'ping-pong-white.png' },
      { key: 'yellow', name: 'Шар пинг понг',    hex: '#F2CB4D', price: 8000, image: IMG + 'ping-pong-yellow.png' },
      { key: 'green',  name: 'Ногоон пинг понг', hex: '#7FAB7A', price: 8000, image: IMG + 'ping-pong-green.png' },
    ],
  },
  {
    key: 'romashka', name: 'Ромашка', emoji: '🌼', hint: 'Энгийн, цэвэр', order: 10,
    colors: [
      { key: 'white',     name: 'Цагаан ромашка',       hex: '#FBF7EF', price: 7000, image: IMG + 'spray-white.png' },
      { key: 'yellow',    name: 'Шар ромашка',          hex: '#F2CB4D', price: 7000, image: IMG + 'spray-yellow.png' },
      { key: 'darkred',   name: 'Хүрэн ромашка',        hex: '#8B2E2E', price: 7000, image: IMG + 'spray-red.png' },
      { key: 'pinkdante', name: 'Ягаан голтой ромашка', hex: '#EFA0B8', price: 7000, image: IMG + 'spray-pink-dante.png' },
      { key: 'purple',    name: 'Нил ромашка',          hex: '#6A3D8F', price: 7000, image: IMG + 'spray-purple.png' },
      { key: 'red',       name: 'Улаан ромашка',        hex: '#C0392B', price: 7000, image: IMG + 'spray-red2.png' },
      { key: 'pink',      name: 'Ягаан ромашка',        hex: '#EFA0B8', price: 7000, image: IMG + 'spray-pink.png' },
      { key: 'blue',      name: 'Цэнхэр ромашка',       hex: '#6AA0D8', price: 7000, image: IMG + 'spray-blue.png' },
      { key: 'orange',    name: 'Улбар шар ромашка',    hex: '#E8843C', price: 7000, image: IMG + 'spray-orange.png' },
    ],
  },
  {
    key: 'freesia', name: 'Хонгорзул', emoji: '🌸', hint: 'Анхилуун үнэртэй', order: 11,
    colors: [
      { key: 'pink',  name: 'Ягаан хонгорзул',  hex: '#EFA0B8', price: 9000, image: IMG + 'freesia-pink.png' },
      { key: 'white', name: 'Цагаан хонгорзул', hex: '#FBF7EF', price: 9000, image: IMG + 'freesia-white.png' },
    ],
  },
  {
    key: 'tulip', name: 'Алтанзул', emoji: '🌷', hint: 'Хавар, шинэ эхлэл', order: 12,
    colors: [
      { key: 'red',    name: 'Улаан алтанзул', hex: '#C0392B', price: 8000, image: IMG + 'tulip-red.png' },
      { key: 'yellow', name: 'Шар алтанзул',   hex: '#F2CB4D', price: 8000, image: IMG + 'tulip-yellow.png' },
      { key: 'pink',   name: 'Ягаан алтанзул', hex: '#EFA0B8', price: 8000, image: IMG + 'tulip-pink.png' },
    ],
  },
  {
    key: 'gerbera', name: 'Хонин нүдэн', emoji: '🌼', hint: 'Тод, баяр баясгалантай', order: 13,
    colors: [
      { key: 'pink',   name: 'Ягаан хонин нүдэн',  hex: '#EFA0B8', price: 7000, image: IMG + 'gerbera-pink.png' },
      { key: 'yellow', name: 'Шар хонин нүдэн',    hex: '#F2CB4D', price: 7000, image: IMG + 'gerbera-yellow.png' },
      { key: 'white',  name: 'Цагаан хонин нүдэн', hex: '#FBF7EF', price: 7000, image: IMG + 'gerbera-white.png' },
      { key: 'red',    name: 'Улаан хонин нүдэн',  hex: '#C0392B', price: 7000, image: IMG + 'gerbera-red.png' },
    ],
  },
  {
    key: 'peony', name: 'Пеони', emoji: '🌺', hint: 'Элбэг дэлбэг аз жаргал', order: 14,
    colors: [
      { key: 'pink', name: 'Ягаан пеони', hex: '#EFA0B8', price: 20000, image: IMG + 'peony-pink.png' },
    ],
  },
  {
    key: 'orchid', name: 'Цахирмаа', emoji: '💜', hint: 'Тансаг, ховор гоо', order: 15,
    colors: [
      { key: 'red', name: 'Улаан цахирмаа', hex: '#C0392B', price: 25000, image: IMG + 'orchid-red.png' },
    ],
  },
]
