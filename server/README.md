# Tsetsegly Backend API

Node.js + Express + MongoDB Atlas backend.

## Суулгах

```bash
cd server
npm install
cp .env.example .env   # дараа нь .env-ээ бөглөнө
npm run dev            # эсвэл npm start
```

## Файлын бүтэц
| Файл | Үүрэг |
|------|-------|
| `app.js` | Express app (listen-гүй) — routes, middleware |
| `index.js` | **Vercel serverless entry** (app-ийг export) |
| `server.js` | **Local dev entry** (DB холбож, порт сонсоно) |

## Vercel deploy

1. Кодоо GitHub-д push хийнэ
2. [Vercel](https://vercel.com) → **New Project** → repo-гоо сонгоно
3. **Root Directory** = `server` гэж заана (frontend биш!)
4. **Environment Variables** хэсэгт `.env`-ийн утгуудыг нэмнэ:
   - `MONGODB_URI`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`
   - ⚠️ `PORT` нэмэхгүй — Vercel өөрөө удирдана
5. MongoDB Atlas → **Network Access** дээр `0.0.0.0/0` зөвшөөрсөн эсэхээ шалгана
6. **Deploy** дарна

Deploy хийсний дараа frontend-ийн `.env`-д `VITE_API_URL`-г Vercel-ийн өгсөн
URL (жишээ нь `https://tsetsegly-api.vercel.app`) болгож солино.

## .env тохиргоо

| Хувьсагч | Тайлбар |
|----------|---------|
| `MONGODB_URI` | MongoDB Atlas холболтын URI |
| `JWT_SECRET` | JWT токены нууц түлхүүр |
| `PORT` | Серверийн порт (default 5000) |
| `ADMIN_USERNAME` | Admin нэвтрэх нэр (default `admin`) |
| `ADMIN_PASSWORD` | Admin нууц үг (заавал тохируулна) |

### Шинэ захиалгын мэдэгдэл (заавал биш)

Шинэ захиалга үүсэх болон QPay төлбөр баталгаажих үед Telegram ба/эсвэл
имэйлээр мэдэгдэл явна. Тохируулаагүй сувгийг алгасна.

| Хувьсагч | Тайлбар |
|----------|---------|
| `TELEGRAM_BOT_TOKEN` | @BotFather-аас авсан ботын token |
| `TELEGRAM_CHAT_ID` | Мэдэгдэл очих chat id (таслалаар олныг) |
| `RESEND_API_KEY` | resend.com-ийн API key |
| `NOTIFY_EMAIL_TO` | Мэдэгдэл хүлээн авах имэйл (таслалаар олныг) |
| `NOTIFY_EMAIL_FROM` | Илгээгч — Resend-д баталгаажсан домэйнтой хаяг |

**Telegram тохируулах:** @BotFather → `/newbot` → token хуулна. Ботдоо (эсвэл
ботыг нэмсэн group-д) нэг мессеж бичээд
`https://api.telegram.org/bot<TOKEN>/getUpdates` нээж `chat.id`-г олно.

**Имэйл тохируулах:** resend.com-д бүртгүүлж API key үүсгэнэ. Домэйн
баталгаажуулаагүй үед зөвхөн Resend бүртгэлийн имэйл рүүгээ илгээж чадна.

### MongoDB Atlas үнэгүй setup
1. https://www.mongodb.com/cloud/atlas/register дээр бүртгүүлнэ
2. Free (M0) cluster үүсгэнэ
3. Database Access → шинэ хэрэглэгч (нэр+нууц үг)
4. Network Access → `0.0.0.0/0` (бүх IP) нэмнэ
5. Connect → Drivers → URI хуулж `MONGODB_URI`-д тавина

## API Endpoints

### Public
| Method | Зам | Тайлбар |
|--------|-----|---------|
| `POST` | `/api/orders` | Захиалга үүсгэх (frontend) |
| `GET`  | `/api/gift/:id` | NFC хуудасны мэдээлэл |

### Admin (Bearer token шаардлагатай)
| Method | Зам | Тайлбар |
|--------|-----|---------|
| `POST`  | `/api/auth/login` | Нэвтрэх → `{ token }` |
| `GET`   | `/api/orders` | Бүх захиалга (`?status=new` шүүлт) |
| `GET`   | `/api/orders/:id` | Нэг захиалгын дэлгэрэнгүй |
| `PATCH` | `/api/orders/:id/status` | Статус: `new → preparing → ready → delivered` |

### Жишээ: admin нэвтрэх
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"<нууц үг>"}'
```

### Жишээ: статус өөрчлөх
```bash
curl -X PATCH http://localhost:5000/api/orders/<id>/status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status":"preparing"}'
```
