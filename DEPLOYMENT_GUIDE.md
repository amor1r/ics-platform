# دليل رفع الموقع - منصة ICS

## 🚀 خيارات الاستضافة المجانية

### 1. Vercel (الأفضل لـ Next.js) ⭐
- **المميزات**:
  - مجاني تماماً
  - محسّن خصيصاً لـ Next.js
  - رفع تلقائي من GitHub
  - SSL مجاني
  - CDN عالمي
  - قاعدة بيانات مجانية (PostgreSQL)

- **الرابط**: https://vercel.com

### 2. Netlify
- **المميزات**:
  - مجاني
  - دعم Next.js
  - رفع تلقائي من GitHub
  - SSL مجاني

- **الرابط**: https://netlify.com

### 3. Railway
- **المميزات**:
  - مجاني (مع حد شهري)
  - دعم PostgreSQL
  - رفع تلقائي

- **الرابط**: https://railway.app

### 4. Render
- **المميزات**:
  - مجاني
  - دعم PostgreSQL
  - SSL مجاني

- **الرابط**: https://render.com

---

## 📋 خطوات الرفع على Vercel (موصى به)

### الخطوة 1: إعداد GitHub Repository

```bash
# التأكد من وجود .gitignore
cat .gitignore

# تهيئة Git (إذا لم يكن موجوداً)
git init
git add .
git commit -m "Initial commit - ICS Platform"

# إنشاء repository على GitHub
# ثم:
git remote add origin https://github.com/YOUR_USERNAME/ics-platform.git
git branch -M main
git push -u origin main
```

### الخطوة 2: إعداد Vercel

1. اذهب إلى: https://vercel.com
2. سجل دخول بحساب GitHub
3. اضغط "Add New Project"
4. اختر repository الخاص بك
5. Vercel سيكتشف Next.js تلقائياً
6. أضف متغيرات البيئة:
   - `DATABASE_URL` - رابط قاعدة البيانات
   - `JWT_SECRET` - مفتاح JWT
   - `JWT_REFRESH_SECRET` - مفتاح Refresh Token
7. اضغط "Deploy"

### الخطوة 3: إعداد قاعدة البيانات

#### خيار 1: Vercel Postgres (موصى به)
1. في Vercel Dashboard
2. اذهب إلى Storage
3. أنشئ Postgres Database
4. انسخ `DATABASE_URL`
5. أضفه إلى Environment Variables

#### خيار 2: Supabase (مجاني)
1. اذهب إلى: https://supabase.com
2. أنشئ حساب مجاني
3. أنشئ مشروع جديد
4. انسخ `DATABASE_URL`
5. أضفه إلى Vercel Environment Variables

### الخطوة 4: تشغيل Migrations

```bash
# في Vercel Dashboard > Settings > Environment Variables
# أضف:
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# ثم في Vercel Dashboard > Deployments
# اضغط على آخر deployment > View Function Logs
# أو استخدم Vercel CLI:
npx vercel env pull
npx prisma migrate deploy
npx prisma db seed
```

---

## 📋 خطوات الرفع على Railway

### الخطوة 1: إعداد Railway

1. اذهب إلى: https://railway.app
2. سجل دخول بحساب GitHub
3. اضغط "New Project"
4. اختر "Deploy from GitHub repo"
5. اختر repository الخاص بك

### الخطوة 2: إضافة PostgreSQL

1. في Railway Dashboard
2. اضغط "New" > "Database" > "PostgreSQL"
3. Railway سينشئ قاعدة البيانات تلقائياً
4. انسخ `DATABASE_URL` من Variables

### الخطوة 3: إعداد Environment Variables

في Railway Dashboard > Variables:
- `DATABASE_URL` - من PostgreSQL service
- `JWT_SECRET` - مفتاح عشوائي
- `JWT_REFRESH_SECRET` - مفتاح عشوائي آخر
- `NODE_ENV=production`

### الخطوة 4: تشغيل Migrations

```bash
# في Railway Dashboard > Service > Deploy Logs
# أو استخدم Railway CLI:
railway link
railway run npx prisma migrate deploy
railway run npx prisma db seed
```

---

## 📋 خطوات الرفع على Render

### الخطوة 1: إعداد Render

1. اذهب إلى: https://render.com
2. سجل دخول بحساب GitHub
3. اضغط "New" > "Web Service"
4. اختر repository الخاص بك
5. الإعدادات:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node

### الخطوة 2: إضافة PostgreSQL

1. في Render Dashboard
2. اضغط "New" > "PostgreSQL"
3. اختر "Free" plan
4. انسخ `Internal Database URL`

### الخطوة 3: إعداد Environment Variables

في Render Dashboard > Environment:
- `DATABASE_URL` - من PostgreSQL
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `NODE_ENV=production`

---

## ⚙️ إعدادات مهمة قبل الرفع

### 1. تحديث next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // إعدادات الإنتاج
  output: 'standalone', // للاستضافة على VPS
  // أو
  // output: undefined, // للاستضافة على Vercel/Netlify
}

module.exports = nextConfig
```

### 2. تحديث .env.example

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_EXPIRES_IN="30d"
NODE_ENV="production"
```

### 3. تحديث package.json

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

---

## 🔐 إنشاء مفاتيح JWT

```bash
# في Terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# استخدم الناتج كـ JWT_SECRET

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# استخدم الناتج كـ JWT_REFRESH_SECRET
```

---

## ✅ بعد الرفع

1. ✅ تأكد من عمل الموقع
2. ✅ اختبر تسجيل الدخول
3. ✅ اختبر إنشاء المشاريع
4. ✅ تأكد من عمل قاعدة البيانات

---

## 🎯 التوصية

**Vercel** هو الخيار الأفضل لـ Next.js لأنه:
- ✅ محسّن خصيصاً لـ Next.js
- ✅ رفع تلقائي من GitHub
- ✅ SSL مجاني
- ✅ CDN عالمي
- ✅ قاعدة بيانات مجانية

---

**جاهز للرفع!** 🚀

