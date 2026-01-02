# 🚀 حالة الرفع - منصة ICS

## ✅ ما تم إنجازه

1. ✅ **تم إنشاء Repository على GitHub**
   - الرابط: https://github.com/amor1r/ics-platform
   - الحالة: جاهز

2. ✅ **تم إعداد Git محلياً**
   - Remote: https://github.com/amor1r/ics-platform.git
   - Branch: main

---

## 📋 الخطوات التالية

### 1️⃣ رفع الكود إلى GitHub

**الطريقة 1: من Terminal (موصى به)**

```bash
cd "/home/kali/Desktop/New Folder"
./push-to-github.sh
```

**أو يدوياً:**

```bash
cd "/home/kali/Desktop/New Folder"
git push -u origin main
```

**عندما يُطلب منك:**
- Username: `amor1r`
- Password: `cc01xayA`

---

### 2️⃣ رفع على Vercel

بعد رفع الكود على GitHub:

1. **اذهب إلى**: https://vercel.com/new
2. اضغط **"Continue with GitHub"**
3. سجل دخول بحساب GitHub
4. اختر repository: `amor1r/ics-platform`
5. اضغط **"Deploy"**

---

### 3️⃣ إضافة قاعدة البيانات

#### خيار A: Vercel Postgres

1. في Vercel Dashboard > **Storage**
2. **Create Database** > **Postgres** > **Free**
3. انسخ `POSTGRES_URL`
4. أضفه كـ `DATABASE_URL` في Environment Variables

#### خيار B: Supabase

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

## 🎯 الحالة الحالية

- ✅ Repository على GitHub: **جاهز**
- ⏳ رفع الكود: **في الانتظار**
- ⏳ Vercel: **في الانتظار**
- ⏳ قاعدة البيانات: **في الانتظار**

---

**الخطوة التالية**: رفع الكود إلى GitHub باستخدام `./push-to-github.sh`

