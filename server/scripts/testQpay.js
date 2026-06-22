/* QPay интеграцийн түргэн тест:
   1) Token авах
   2) ₮100-ийн туршилтын нэхэмжлэх үүсгэх
   3) Тухайн нэхэмжлэхийн төлбөрийг шалгах (төлөгдөөгүй гэж гарна)

   Ажиллуулах:  node scripts/testQpay.js
*/
import 'dotenv/config'
import { getValidToken, createInvoice, checkPayment } from '../services/qpay.js'

async function main() {
  console.log('── QPay тест эхэллээ ──')
  console.log('BASE_URL:', process.env.QPAY_BASE_URL)

  // 1) Token
  const token = await getValidToken()
  console.log('\n[1] Token авлаа ✅  (эхний 20 тэмдэгт):', String(token).slice(0, 20) + '…')

  // Cache ажиллаж байгаа эсэх — 2 дахь дуудлага шинэ token авахгүй байх ёстой
  const token2 = await getValidToken()
  console.log('    Cache шалгалт:', token === token2 ? 'дахин авсангүй ✅' : 'шинэ авлаа ⚠')

  // 2) Туршилтын нэхэмжлэх (₮100)
  const fakeOrder = { _id: 'test' + Date.now(), totalPrice: 100 }
  const invoice = await createInvoice(fakeOrder)
  console.log('\n[2] Нэхэмжлэх үүсгэлээ ✅')
  console.log('    invoice_id:', invoice.invoice_id)
  console.log('    qr_text эхлэл:', invoice.qr_text.slice(0, 30) + '…')
  console.log('    qr_image байгаа эсэх:', invoice.qr_image ? 'тийм (base64) ✅' : 'үгүй ⚠')
  console.log('    Банкны deeplink тоо:', invoice.urls.length)
  if (invoice.urls.length) {
    console.log('    Жишээ банк:', invoice.urls.slice(0, 4).map((u) => u.name).join(', '))
  }

  // 3) Төлбөр шалгах (одоохондоо төлөгдөөгүй байх ёстой)
  const check = await checkPayment(invoice.invoice_id)
  console.log('\n[3] Төлбөр шалгалаа ✅')
  console.log('    paid:', check.paid, '| paidAmount:', check.paidAmount)

  console.log('\n── Бүх тест амжилттай ──')
  process.exit(0)
}

main().catch((e) => {
  console.error('\n❌ ТЕСТ АЛДАА:', e.message)
  process.exit(1)
})
