# 🚀 خطوات رفع الموقع - منصة ICS

## ✅ الخطوات المكتملة

1. ✅ تم إعداد الملفات للرفع
2. ✅ تم إنشاء `vercel.json`
3. ✅ تم تحديث `package.json` مع `postinstall`
4. ✅ تم إنشاء `.vercelignore`

---

## 📋 الخطوات التالية (خطوة بخطوة)

### المرحلة 1: إعداد GitHub Repository

#### الخطوة 1.1: إنشاء Repository على GitHub

1. اذهب إلى: **https://github.com/new**
2. **Repository name**: `ics-platform`
3. **Description**: `ICS - Information Cyber Security Platform`
4. **Visibility**: Public (أو Private حسب رغبتك)
5. **لا تضع** README أو .gitignore (موجودان بالفعل)
6. اضغط **"Create repository"**

#### الخطوة 1.2: رفع الكود إلى GitHub

```bash
cd "/home/kali/Desktop/New Folder"

# إذا لم يكن Git مهيأ
git init
git add .
git commit -m "ICS Platform - Initial commit"

# إضافة Remote (استبدل YOUR_USERNAME باسمك)
git remote add origin https://github.com/YOUR_USERNAME/ics-platform.git
git branch -M main
git push -u origin main
```

---

### المرحلة 2: رفع على Vercel

#### الخطوة 2.1: تسجيل الدخول إلى Vercel

1. اذهب إلى: **https://vercel.com**
2. اضغط **"Sign Up"** أو **"Log In"**
3. اختر **"Continue with GitHub"**
4. سجل دخول بحساب GitHub

#### الخطوة 2.2: إنشاء مشروع جديد

1. في Vercel Dashboard
2. اضغط **"Add New Project"**
3. اختر repository: `ics-platform`
4. Vercel سيكتشف Next.js تلقائياً ✅
5. **لا تغير أي إعدادات** (كل شيء صحيح)
6. اضغط **"Deploy"**

#### الخطوة 2.3: إضافة Environment Variables

بعد الرفع الأول، في Vercel Dashboard:

1. اذهب إلى **Settings** > **Environment Variables**
2. أضف المتغيرات التالية:

```
DATABASE_URL=your_database_url_here
JWT_SECRET=generate_random_32_chars
JWT_REFRESH_SECRET=generate_random_32_chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
NODE_ENV=production
```

**لإنشاء JWT_SECRET و JWT_REFRESH_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### المرحلة 3: إعداد قاعدة البيانات

#### خيار 1: Vercel Postgres (الأسهل) ⭐

1. في Vercel Dashboard
2. اذهب إلى **Storage** tab
3. اضغط **"Create Database"**
4. اختر **"Postgres"**
5. اختر **"Free"** plan
6. انسخ `POSTGRES_URL`
7. أضفه كـ `DATABASE_URL` في Environment Variables

#### خيار 2: Supabase (مجاني)

1. اذهب إلى: **https://supabase.com**
2. اضغط **"Start your project"**
3. سجل دخول بحساب GitHub
4. اضغط **"New Project"**
5. املأ البيانات:
   - **Name**: `ics-platform`
   - **Database Password**: اختر كلمة مرور قوية
   - **Region**: اختر الأقرب لك
6. اضغط **"Create new project"**
7. انتظر حتى ينتهي الإعداد (2-3 دقائق)
8. اذهب إلى **Settings** > **Database**
9. انسخ **Connection String** (URI)
10. أضفه كـ `DATABASE_URL` في Vercel

---

### المرحلة 4: تشغيل Migrations

بعد إعداد قاعدة البيانات:

#### الطريقة 1: Vercel CLI (موصى به)

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# ربط المشروع
cd "/home/kali/Desktop/New Folder"
vercel link

# سحب Environment Variables
vercel env pull

# تشغيل migrations
npx prisma migrate deploy
npx prisma db seed
```

#### الطريقة 2: من خلال Vercel Dashboard

1. اذهب إلى **Deployments**
2. اضغط على آخر deployment
3. اضغط **"Redeploy"**
4. Vercel سيشغل `postinstall` تلقائياً

---

## 🎯 بعد الرفع

### التحقق من الموقع

1. ✅ الموقع سيكون متاح على: `https://your-project.vercel.app`
2. ✅ اختبر الصفحة الرئيسية
3. ✅ اختبر تسجيل الدخول بحساب المالك:
   - Email: `oomraraq0@gmail.com`
   - Password: `AAaa4321`
4. ✅ اختبر إنشاء المشاريع
5. ✅ تأكد من عمل قاعدة البيانات

---

## 🔧 حل المشاكل

### المشكلة: قاعدة البيانات لا تعمل

**الحل**:
1. تأكد من `DATABASE_URL` صحيح
2. تأكد من تشغيل migrations:
   ```bash
   npx prisma migrate deploy
   ```

### المشكلة: الموقع لا يعمل

**الحل**:
1. تحقق من Vercel Dashboard > Deployments
2. اضغط على آخر deployment
3. اقرأ الأخطاء في Logs

### المشكلة: Environment Variables غير موجودة

**الحل**:
1. اذهب إلى Settings > Environment Variables
2. تأكد من إضافة جميع المتغيرات
3. اضغط "Redeploy" بعد إضافة المتغيرات

---

## 📊 الخيارات البديلة

### Railway
- **الرابط**: https://railway.app
- **المميزات**: قاعدة بيانات مجانية، رفع سريع
- **الخطوات**: مشابهة لـ Vercel

### Render
- **الرابط**: https://render.com
- **المميزات**: مجاني، دعم PostgreSQL
- **الخطوات**: مشابهة لـ Vercel

---

## ✅ الخلاصة

**الطريقة الأسهل والأسرع:**
1. ✅ Vercel (5 دقائق)
2. ✅ Vercel Postgres (مجاني)
3. ✅ رفع تلقائي من GitHub

**جاهز للرفع!** 🚀

