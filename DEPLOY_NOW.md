# 🚀 رفع الموقع الآن - خطوات سريعة

## ✅ ما تم إنجازه

1. ✅ تم تهيئة Git
2. ✅ تم إنشاء commit
3. ✅ تم إعداد ملفات Vercel
4. ✅ تم تحديث package.json

---

## 📋 الخطوات التالية (5 دقائق)

### الخطوة 1: إنشاء Repository على GitHub

1. **اذهب إلى**: https://github.com/new
2. **Repository name**: `ics-platform`
3. **Description**: `ICS - Information Cyber Security Platform`
4. **Visibility**: Public (أو Private)
5. **⚠️ لا تضع** README أو .gitignore (موجودان بالفعل)
6. اضغط **"Create repository"**

### الخطوة 2: رفع الكود إلى GitHub

بعد إنشاء Repository، GitHub سيعرض لك الأوامر. نفذ:

```bash
cd "/home/kali/Desktop/New Folder"

# إضافة Remote (استبدل YOUR_USERNAME باسمك على GitHub)
git remote add origin https://github.com/YOUR_USERNAME/ics-platform.git

# تغيير اسم الفرع إلى main
git branch -M main

# رفع الكود
git push -u origin main
```

### الخطوة 3: رفع على Vercel

1. **اذهب إلى**: https://vercel.com
2. اضغط **"Start Deploying"** أو **"Sign Up"**
3. اختر **"Continue with GitHub"**
4. سجل دخول بحساب GitHub
5. اضغط **"Add New Project"**
6. اختر repository: `ics-platform`
7. Vercel سيكتشف Next.js تلقائياً ✅
8. **لا تغير أي إعدادات**
9. اضغط **"Deploy"**

### الخطوة 4: إضافة Environment Variables

بعد الرفع الأول (قد يفشل بدون قاعدة البيانات):

1. في Vercel Dashboard
2. اذهب إلى **Settings** > **Environment Variables**
3. أضف:

```
DATABASE_URL=your_database_url_here
JWT_SECRET=6a6011cdd676be985bd61902c7f3b30b4dd11f7595b9dbc504d7c353318511c1
JWT_REFRESH_SECRET=518edb1d3259acabd0d4bac0dfb890bb83d5900e4ae2cf01a6b7bd10b1ab1d39
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
NODE_ENV=production
```

### الخطوة 5: إعداد قاعدة البيانات

#### خيار A: Vercel Postgres (الأسهل) ⭐

1. في Vercel Dashboard
2. اذهب إلى **Storage** tab
3. اضغط **"Create Database"**
4. اختر **"Postgres"**
5. اختر **"Free"** plan
6. انتظر حتى ينتهي الإعداد
7. انسخ `POSTGRES_URL`
8. أضفه كـ `DATABASE_URL` في Environment Variables

#### خيار B: Supabase (مجاني)

1. اذهب إلى: https://supabase.com
2. اضغط **"Start your project"**
3. سجل دخول بحساب GitHub
4. اضغط **"New Project"**
5. املأ:
   - **Name**: `ics-platform`
   - **Database Password**: اختر كلمة مرور قوية
   - **Region**: اختر الأقرب
6. اضغط **"Create new project"**
7. انتظر 2-3 دقائق
8. اذهب إلى **Settings** > **Database**
9. انسخ **Connection String** (URI)
10. أضفه كـ `DATABASE_URL` في Vercel

### الخطوة 6: تشغيل Migrations

بعد إضافة `DATABASE_URL`:

#### الطريقة 1: Vercel CLI

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

#### الطريقة 2: من Vercel Dashboard

1. اذهب إلى **Deployments**
2. اضغط على آخر deployment
3. اضغط **"Redeploy"**
4. Vercel سيشغل `postinstall` تلقائياً

---

## 🎯 بعد الرفع

الموقع سيكون متاح على: `https://your-project.vercel.app`

**حساب المالك:**
- Email: `oomraraq0@gmail.com`
- Password: `AAaa4321`

---

## 🔗 روابط مفيدة

- **Vercel**: https://vercel.com
- **GitHub**: https://github.com/new
- **Supabase**: https://supabase.com

---

**جاهز للرفع!** 🚀

