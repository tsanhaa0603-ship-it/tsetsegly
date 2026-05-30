/* Захидлын фонт сонголтууд — Step3 болон Gift хуудас хоёулаа ашиглана */
export const LETTER_FONTS = [
  {
    id: 'simple',
    label: 'Энгийн',
    className: 'font-cormorant',
    style: { fontFamily: '"Cormorant Garamond", serif', fontWeight: 400 },
    preview: 'Аа',
  },
  {
    id: 'elegant',
    label: 'Гоёмсог',
    className: 'font-playfair italic',
    style: { fontFamily: '"Playfair Display", serif', fontStyle: 'italic' },
    preview: 'Аа',
  },
  {
    id: 'fun',
    label: 'Хөгжилтэй',
    className: 'font-caveat',
    style: { fontFamily: '"Caveat", cursive', fontWeight: 600 },
    preview: 'Аа',
  },
]

export function getLetterFont(id) {
  return LETTER_FONTS.find((f) => f.id === id) || LETTER_FONTS[1]
}
