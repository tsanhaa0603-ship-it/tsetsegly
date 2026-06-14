/* Бэлэн баглааны анхдагч жишээ (6 ширхэг) — collection хоосон үед lazy seed */
export const DEFAULT_READY = [
  {
    name: 'Улаан романс', contents: '5 улаан сарнай, 3 ягаан пеони, крем боолт',
    price: 75000, image: '/flowers/rose-red.png', active: true, order: 1,
    preset: { flowers: { 'rose:red': 5, 'peony:pink': 3 }, shape: 'round', wrapping: 'cream', ribbon: 'gold' },
  },
  {
    name: 'Цагаан тунгалаг', contents: '5 цагаан сарнай, 3 цагаан лили, крем боолт',
    price: 75000, image: '/flowers/lily-white.png', active: true, order: 2,
    preset: { flowers: { 'rose:white': 5, 'lily:white': 3 }, shape: 'round', wrapping: 'cream', ribbon: 'ivory' },
  },
  {
    name: 'Ягаан мөрөөдөл', contents: '5 ягаан сарнай, 4 ягаан хонин нүдэн, ягаан боолт',
    price: 73000, image: '/flowers/rose-pink.png', active: true, order: 3,
    preset: { flowers: { 'rose:pink': 5, 'gerbera:pink': 4 }, shape: 'round', wrapping: 'pink', ribbon: 'blush' },
  },
  {
    name: 'Алтан баяр', contents: '5 шар сарнай, 3 наранцэцэг, ногоон боолт',
    price: 69000, image: '/flowers/sunflower.png', active: true, order: 4,
    preset: { flowers: { 'rose:yellow': 5, 'sunflower:yellow': 3 }, shape: 'garden', wrapping: 'green', ribbon: 'gold' },
  },
  {
    name: 'Нил тансаг', contents: '5 нил ягаан башир, 4 нил ягаан лизантус, хар боолт',
    price: 96000, image: '/flowers/garden-rose-purple.png', active: true, order: 5,
    preset: { flowers: { 'bashir:purple': 5, 'eustoma:purple': 4 }, shape: 'round', wrapping: 'black', ribbon: 'black' },
  },
  {
    name: 'Байгалийн аяс', contents: '3 цагаан лили, 2 цагаан барын чих, 3 хонгорзул',
    price: 84000, image: '/flowers/hydrangea-white.png', active: true, order: 6,
    preset: { flowers: { 'lily:white': 3, 'hydrangea:white': 2, 'freesia:white': 3 }, shape: 'garden', wrapping: 'cream', ribbon: 'forest' },
  },
]
