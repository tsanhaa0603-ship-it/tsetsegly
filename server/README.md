# Tsetsegly Backend API

Node.js + Express + MongoDB Atlas backend.

## Суулгах

```bash
cd server
npm install
cp .env.example .env   # дараа нь .env-ээ бөглөнө
npm run dev            # эсвэл npm start
```

## .env тохиргоо

| Хувьсагч | Тайлбар |
|----------|---------|
| `MONGODB_URI` | MongoDB Atlas холболтын URI |
| `JWT_SECRET` | JWT токены нууц түлхүүр |
| `PORT` | Серверийн порт (default 5000) |
| `ADMIN_USERNAME` | Admin нэвтрэх нэр (default `admin`) |
| `ADMIN_PASSWORD` | Admin нууц үг (заавал тохируулна) |

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
