# 🚀 دليل رفع الموقع - منصة ICS

## ⚡ الطريقة السريعة (5 دقائق)

### 1️⃣ إنشاء GitHub Repository

```bash
cd "/home/kali/Desktop/New Folder"
git init
git add .
git commit -m "ICS Platform - Initial commit"
```

ثم على GitHub:
- اذهب إلى: https://github.com/new
- أنشئ repository باسم: `ics-platform`
- لا تضع README أو .gitignore
- ثم نفذ:

```bash
git remote add origin https://github.com/YOUR_USERNAME/ics-platform.git
git branch -M main
git push -u origin main
```

### 2️⃣ رفع على Vercel

1. اذهب إلى: **https://vercel.com**
2. سجل دخول بحساب GitHub
3. اضغط **"Add New Project"**
4. اختر repository: `ics-platform`
5. اضغط **"Deploy"**

### 3️⃣ إضافة قاعدة البيانات

#### خيار A: Vercel Postgres
- في Vercel Dashboard > Storage > Create Database > Postgres > Free
- انسخ `POSTGRES_URL` وأضفه كـ `DATABASE_URL`

#### خيار B: Supabase
- اذهب إلى: https://supabase.com
- أنشئ مشروع جديد
- انسخ Connection String وأضفه كـ `DATABASE_URL`

### 4️⃣ إضافة Environment Variables

في Vercel Dashboard > Settings > Environment Variables:

```
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
NODE_ENV=production
```

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

الموقع سيكون متاح على: `https://your-project.vercel.app`

**حساب المالك:**
- Email: `oomraraq0@gmail.com`
- Password: `AAaa4321`

---

**جاهز!** 🚀

