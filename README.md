# Backend — Database Setup

دليل سريع لرفع وتشغيل قاعدة البيانات (PostgreSQL + Prisma) لهذا المشروع.

## المتطلبات

- Node.js 20+
- PostgreSQL 15+ يعمل محليًا (أو عبر Docker) على المنفذ الافتراضي `5432`
- تشغيل الأوامر من داخل مجلد `backend`

## 1. متغيرات البيئة

أنشئ ملف `.env` داخل `backend` (إن لم يكن موجودًا):

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DB_NAME"
```

عدّل `USER`, `PASSWORD`, `DB_NAME` حسب إعدادات PostgreSQL لديك. القاعدة في هذا المشروع تُسمّى حاليًا `OTP`.

## 2. تثبيت الحزم

من جذر المشروع (`Support OTP/`) وليس من `backend/`، لأن الحزم مثبّتة في `node_modules` على مستوى الجذر:

```bash
npm install
```

الحزم الأساسية المطلوبة لهذه الخطوة: `prisma`, `@prisma/client`, `dotenv`, `pg`, `@prisma/adapter-pg`.

## 3. تطبيق Migrations (إنشاء/تحديث الجداول فعليًا)

من داخل `backend/`:

```bash
npx prisma migrate dev --name <اسم_وصفي_للتعديل>
```

هذا الأمر:
- يقرأ `prisma/schema.prisma`.
- يولّد ملف SQL جديد داخل `prisma/migrations/`.
- يطبّقه مباشرة على قاعدة البيانات المحددة في `DATABASE_URL`.
- يولّد `Prisma Client` تلقائيًا بعد التطبيق.

> أول مرة فقط: استخدم `--name init` لإنشاء كل الجداول من الصفر.

## 4. توليد Prisma Client يدويًا (اختياري)

إذا عدّلت `schema.prisma` فقط دون تغيير بنية الجداول (مثلًا تعليق توضيحي)، أو تريد توليد الـ Client بدون migration جديد:

```bash
npx prisma generate
```

## 5. معاينة القاعدة بصريًا

```bash
npx prisma studio
```

يفتح واجهة في المتصفح لعرض/تعديل البيانات مباشرة.

## 6. فحص صحة الـ Schema قبل أي تعديل

```bash
npx prisma validate
```

```bash
npx prisma format
```

`format` يصحّح التنسيق تلقائيًا وقد يضيف حقول العلاقة المعكوسة المفقودة.

## ملاحظات مهمة

- **لا تكتب رابط الاتصال داخل `schema.prisma`** — تمت إزالته من هناك (Prisma 7)، ويُقرأ الآن من `prisma.config.ts` الذي يعتمد على `.env`.
- **عند استخدام `PrismaClient` داخل كود NestJS**، يجب تمرير Driver Adapter صريحًا:

```ts
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
```

- **قيد يجب تطبيقه يدويًا بعد أول migration** (Prisma لا يدعم Partial Unique Index في الـ schema): يمنع وجود أكثر من اشتراك "active" واحد لكل شركة في نفس الوقت:

```sql
CREATE UNIQUE INDEX uq_active_subscription ON subscriptions(company_id) WHERE status = 'active';
```

أضفه عبر:

```bash
npx prisma migrate dev --create-only --name add_active_subscription_constraint
```

ثم أضف السطر أعلاه يدويًا داخل ملف الـ migration الناتج قبل تشغيل:

```bash
npx prisma migrate dev
```
