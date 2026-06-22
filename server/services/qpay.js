/* ─────────────────────────────────────────────────────────────
   QPay V2 төлбөрийн системийн үйлчилгээний давхарга.

   - Token менежмент: access_token-ийг санах ойд хадгалж, хүчинтэй
     хугацаанд нь дахин авахгүй. Дуусахаас 60 секундын өмнө
     refresh_token ашиглан шинэчилнэ.
   - getValidToken() — бүх QPay API дуудлага үүгээр token авна.
   - createInvoice() — нэхэмжлэх үүсгэнэ.
   - checkPayment() — төлбөр төлөгдсөн эсэхийг QPay-аас баталгаажуулна.

   Node 24 global fetch ашиглана (нэмэлт сан шаардлагагүй).
───────────────────────────────────────────────────────────── */

const BASE_URL = (process.env.QPAY_BASE_URL || 'https://merchant.qpay.mn/v2').replace(/\/$/, '')

// Token-ийг serverless warm invocation хооронд дахин ашиглахын тулд module-scope-д cache хийнэ
let tokenCache = {
  accessToken: null,
  refreshToken: null,
  expiresAt: 0,        // epoch секунд — энэ хугацаанд access_token хүчингүй болно
  refreshExpiresAt: 0, // refresh_token хүчингүй болох epoch секунд
}

const nowSec = () => Math.floor(Date.now() / 1000)

// QPay-ийн expires_in нь үргэлжлэх хугацаа (сек) эсвэл бүрэн epoch байж болзошгүй — аль алийг нь зөв тооцно
function resolveExpiry(expiresIn) {
  const n = Number(expiresIn) || 3600
  const t = nowSec()
  // 1e9-аас их утга нь epoch timestamp (2001 оноос хойш) гэж үзнэ
  return n > 1e9 ? n : t + n
}

function applyTokenResponse(data) {
  tokenCache = {
    accessToken: data.access_token || null,
    refreshToken: data.refresh_token || tokenCache.refreshToken,
    expiresAt: resolveExpiry(data.expires_in),
    refreshExpiresAt: data.refresh_expires_in
      ? resolveExpiry(data.refresh_expires_in)
      : tokenCache.refreshExpiresAt,
  }
  return tokenCache.accessToken
}

/* Basic Auth-аар шинэ token авах (username:password → base64) */
async function fetchNewToken() {
  const username = process.env.QPAY_USERNAME
  const password = process.env.QPAY_PASSWORD
  if (!username || !password) {
    throw new Error('QPAY_USERNAME / QPAY_PASSWORD тохируулаагүй байна')
  }
  const basic = Buffer.from(`${username}:${password}`).toString('base64')

  const res = await fetch(`${BASE_URL}/auth/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.access_token) {
    console.error('QPay auth/token алдаа:', res.status, JSON.stringify(data))
    throw new Error('QPay token авч чадсангүй')
  }
  console.log('🔑 QPay шинэ token авлаа (expires:', new Date(resolveExpiry(data.expires_in) * 1000).toISOString(), ')')
  return applyTokenResponse(data)
}

/* refresh_token ашиглан access_token шинэчлэх */
async function refreshAccessToken() {
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokenCache.refreshToken}`,
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.access_token) {
    console.warn('QPay auth/refresh амжилтгүй, шинээр авна:', res.status)
    return null
  }
  console.log('🔄 QPay token refresh хийлээ')
  return applyTokenResponse(data)
}

/* ─── Гол функц: хүчинтэй token буцаана ───
   - Cache дахь token хүчинтэй (дуусахад 60+ сек) бол шууд буцна
   - refresh_token хүчинтэй бол refresh хийнэ
   - Эс бөгөөс шинээр Basic Auth-аар авна */
export async function getValidToken() {
  const t = nowSec()

  // 1. Cache хүчинтэй (60 сек buffer-тэй) бол дахин авахгүй
  if (tokenCache.accessToken && t < tokenCache.expiresAt - 60) {
    return tokenCache.accessToken
  }

  // 2. refresh_token хүчинтэй бол refresh оролдоно
  if (tokenCache.refreshToken && t < tokenCache.refreshExpiresAt - 60) {
    const refreshed = await refreshAccessToken()
    if (refreshed) return refreshed
  }

  // 3. Шинээр token авна
  return fetchNewToken()
}

/* QPay руу authenticated хүсэлт илгээх туслах */
async function qpayFetch(path, { method = 'GET', body } = {}) {
  const token = await getValidToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

/* ─── Нэхэмжлэх үүсгэх ───
   order — { _id, totalPrice } агуулсан захиалга
   Буцаах: { invoice_id, qr_text, qr_image, urls } */
export async function createInvoice(order) {
  const invoiceCode = process.env.QPAY_INVOICE_CODE
  if (!invoiceCode) throw new Error('QPAY_INVOICE_CODE тохируулаагүй байна')

  const callbackBase = (process.env.QPAY_CALLBACK_BASE || '').replace(/\/$/, '')
  const orderId = String(order._id)
  // sender_invoice_no давхцахгүй байх ёстой тул timestamp нэмнэ
  const senderInvoiceNo = `${orderId}-${nowSec()}`

  const body = {
    invoice_code: invoiceCode,
    sender_invoice_no: senderInvoiceNo,
    invoice_receiver_code: 'terminal',
    invoice_description: `Tsetsegly цэцэг захиалга #${orderId}`,
    amount: Number(order.totalPrice) || 0,
    callback_url: `${callbackBase}/api/qpay/callback?order_id=${orderId}`,
  }

  const { ok, status, data } = await qpayFetch('/invoice', { method: 'POST', body })
  if (!ok || !data.invoice_id) {
    console.error('QPay invoice үүсгэх алдаа:', status, JSON.stringify(data))
    throw new Error(data.message || 'QPay нэхэмжлэх үүсгэж чадсангүй')
  }

  return {
    invoice_id: data.invoice_id,
    qr_text: data.qr_text || '',
    qr_image: data.qr_image || '',  // base64
    urls: Array.isArray(data.urls) ? data.urls : [],
  }
}

/* ─── Төлбөр шалгах (баталгаажуулалт) ───
   invoiceId — QPay invoice_id
   Буцаах: { paid: boolean, paidAmount: number, rows: [] } */
export async function checkPayment(invoiceId) {
  const body = {
    object_type: 'INVOICE',
    object_id: invoiceId,
    offset: { page_number: 1, page_limit: 100 },
  }

  const { ok, status, data } = await qpayFetch('/payment/check', { method: 'POST', body })
  if (!ok) {
    console.error('QPay payment/check алдаа:', status, JSON.stringify(data))
    throw new Error('QPay төлбөр шалгаж чадсангүй')
  }

  const rows = Array.isArray(data.rows) ? data.rows : []
  // PAID статустай мөр байгаа эсэх (callback-д бус, QPay-ийн бодит хариунд итгэнэ)
  const paidRows = rows.filter((r) => String(r.payment_status).toUpperCase() === 'PAID')
  const paidAmount = Number(data.paid_amount) || paidRows.reduce((s, r) => s + (Number(r.payment_amount) || 0), 0)
  const paid = paidRows.length > 0 || (Number(data.count) > 0 && paidAmount > 0)

  return { paid, paidAmount, rows }
}
