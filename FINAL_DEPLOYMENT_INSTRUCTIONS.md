# 🚀 تعليمات رفع الموقع النهائية - منصة ICS

## ✅ الحالة الحالية

- ✅ Git مهيأ ومحلياً
- ✅ جميع الملفات جاهزة
- ✅ Commit تم إنشاؤه
- ✅ ملفات Vercel جاهزة

---

## 🎯 الخطوات السريعة (5-10 دقائق)

### 1️⃣ إنشاء GitHub Repository

**الرابط**: https://github.com/new

**الإعدادات**:
- Repository name: `ics-platform`
- Description: `ICS - Information Cyber Security Platform`
- Visibility: Public أو Private
- ⚠️ **لا تضع** README أو .gitignore (موجودان)

**بعد الإنشاء، نفذ**:

```bash
cd "/home/kali/Desktop/New Folder"
git remote add origin https://github.com/YOUR_USERNAME/ics-platform.git
git branch -M main
git push -u origin main
```

---

### 2️⃣ رفع على Vercel

**الرابط**: https://vercel.com

**الخطوات**:
1. اضغط **"Start Deploying"**
2. اختر **"Continue with GitHub"**
3. سجل دخول
4. اضغط **"Add New Project"**
5. اختر `ics-platform`
6. اضغط **"Deploy"**

---

### 3️⃣ إضافة قاعدة البيانات

#### خيار 1: Vercel Postgres (موصى به)

1. في Vercel Dashboard > **Storage**
2. **Create Database** > **Postgres** > **Free**
3. انسخ `POSTGRES_URL`
4. أضفه كـ `DATABASE_URL` في Environment Variables

#### خيار 2: Supabase

1. https://supabase.com
2. **New Project**
3. انسخ Connection String
4. أضفه كـ `DATABASE_URL` في Vercel

---

### 4️⃣ إضافة Environment Variables

في Vercel Dashboard > **Settings** > **Environment Variables**:

```
DATABASE_URL=your_database_url
JWT_SECRET=6a6011cdd676be985bd61902c7f3b30b4dd11f7595b9dbc504d7c353318511c1
JWT_REFRESH_SECRET=518edb1d3259acabd0d4bac0dfb890bb83d5900e4ae2cf01a6b7bd10b1ab1d39
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
NODE_ENV=production
```

---

### 5️⃣ تشغيل Migrations

```bash
npm i -g vercel
vercel login
vercel link
vercel env pull
npx prisma migrate deploy
npx prisma db seed
```

---

## ✅ بعد الرفع

الموقع: `https://your-project.vercel.app`

**حساب المالك:**
- Email: `oomraraq0@gmail.com`
- Password: `AAaa4321`

---

**جاهز!** 🚀

