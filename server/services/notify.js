/* ─────────────────────────────────────────────────────────────
   Шинэ захиалга / төлбөрийн мэдэгдэл — Telegram болон имэйл.

   - Telegram: Bot API (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID).
     TELEGRAM_CHAT_ID-д таслалаар хэд хэдэн chat id өгч болно.
   - Имэйл: Resend API (RESEND_API_KEY, NOTIFY_EMAIL_TO, NOTIFY_EMAIL_FROM).
   - Тохируулаагүй сувгийг чимээгүй алгасна.
   - Мэдэгдэл амжилтгүй болсон ч захиалга хэзээ ч унахгүй — алдааг
     зөвхөн log-д бичнэ.

   Vercel serverless хариу буцаасны дараа функцийг зогсоож болзошгүй
   тул дуудагч тал notify*-г await хийнэ (timeout-тай тул удаахгүй).
   Node 24 global fetch ашиглана (нэмэлт сан шаардлагагүй).
───────────────────────────────────────────────────────────── */

const TIMEOUT_MS = 5000
const ADMIN_URL = process.env.ADMIN_URL || 'https://tsetsegly.mn/admin'

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const money = (n) => `${(Number(n) || 0).toLocaleString('en-US')}₮`

/* Захиалгын гол мэдээллийг мөр мөрөөр (HTML-д аюулгүй) */
function orderLines(order) {
  const d = order.delivery || {}
  const flowers = (order.flowers || [])
    .map((f) => `${esc(f.name)}${f.qty ? ` ×${f.qty}` : ''}`)
    .join(', ')
  return [
    `👤 ${esc(order.customerName)} — ${esc(order.customerPhone)}`,
    flowers && `💐 ${flowers}`,
    order.bouquetShape && `Хэлбэр: ${esc(order.bouquetShape)}`,
    order.wrapping && `Боодол: ${esc(order.wrapping)}`,
    `🚚 ${esc(d.zone)}, ${esc(d.address)}`,
    (d.date || d.slot) && `📅 ${esc(d.date)} ${esc(d.slot)}`.trim(),
    `📞 Хүлээн авагч: ${[d.recipientName, d.recipientPhone].filter(Boolean).map(esc).join(' ')}`,
    d.surprise && '🤫 Гэнэтийн бэлэг — урьдчилж залгахгүй',
    d.note && `📝 ${esc(d.note)}`,
    `💰 Нийт: ${money(order.totalPrice)}${order.deliveryFee ? ` (хүргэлт ${money(order.deliveryFee)})` : ''}`,
    `🆔 ${esc(order._id)}`,
  ].filter(Boolean)
}

async function post(url, body, headers = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 200)}`)
}

async function sendTelegram(html) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatIds = (process.env.TELEGRAM_CHAT_ID || '').split(',').map((s) => s.trim()).filter(Boolean)
  if (!token || !chatIds.length) return
  await Promise.all(
    chatIds.map((chat_id) =>
      post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id,
        text: html,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      })
    )
  )
}

async function sendEmail(subject, html) {
  const key = process.env.RESEND_API_KEY
  const to = (process.env.NOTIFY_EMAIL_TO || '').split(',').map((s) => s.trim()).filter(Boolean)
  if (!key || !to.length) return
  await post(
    'https://api.resend.com/emails',
    {
      from: process.env.NOTIFY_EMAIL_FROM || 'Tsetsegly <onboarding@resend.dev>',
      to,
      subject,
      html,
    },
    { Authorization: `Bearer ${key}` }
  )
}

/* Бүх сувгаар зэрэг илгээнэ; нэг нь унавал нөгөө нь явсаар байна */
async function broadcast(title, lines) {
  const tgText = [`<b>${esc(title)}</b>`, '', ...lines, '', ADMIN_URL].join('\n')
  const emailHtml =
    `<h2>${esc(title)}</h2><p>${lines.join('<br>')}</p>` +
    `<p><a href="${esc(ADMIN_URL)}">Admin самбар нээх</a></p>`

  const results = await Promise.allSettled([sendTelegram(tgText), sendEmail(title, emailHtml)])
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error(`Мэдэгдэл (${i === 0 ? 'Telegram' : 'имэйл'}) амжилтгүй:`, r.reason?.message)
    }
  })
}

export async function notifyNewOrder(order) {
  try {
    await broadcast(`🌸 Шинэ захиалга — ${money(order.totalPrice)}`, orderLines(order))
  } catch (e) {
    console.error('notifyNewOrder:', e.message)
  }
}

export async function notifyOrderPaid(order) {
  try {
    await broadcast(`✅ Төлбөр төлөгдлөө — ${money(order.paidAmount || order.totalPrice)}`, orderLines(order))
  } catch (e) {
    console.error('notifyOrderPaid:', e.message)
  }
}
