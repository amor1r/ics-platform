# 🚀 دليل الرفع الكامل - منصة ICS

## ✅ الحالة الحالية

- ✅ Repository على GitHub: **جاهز** (https://github.com/amor1r/ics-platform)
- ✅ Vercel CLI: **مثبت** (v50.1.3)
- ⏳ رفع الكود: **في الانتظار** (يحتاج Personal Access Token)
- ⏳ Vercel: **جاهز للربط**

---

## 🎯 الطريقة الأسهل: Vercel Dashboard

### الخطوة 1: تسجيل الدخول إلى Vercel

1. **اذهب إلى**: https://vercel.com/login
2. اضغط **"Continue with GitHub"**
3. سجل دخول بحساب GitHub (`amor1r`)

### الخطوة 2: ربط Repository

1. بعد تسجيل الدخول، اذهب إلى: https://vercel.com/new
2. اضغط **"Import Git Repository"**
3. اختر **"Continue with GitHub"**
4. اختر repository: `amor1r/ics-platform`
5. اضغط **"Deploy"**

**ملاحظة**: حتى لو كان repository فارغاً، Vercel سيربطه. ثم يمكنك رفع الكود لاحقاً.

---

## 🔑 الطريقة البديلة: Personal Access Token

### إنشاء Token على GitHub

1. **اذهب إلى**: https://github.com/settings/tokens/new
2. املأ:
   - **Note**: `ICS Platform Deploy`
   - **Expiration**: `90 days`
   - **Scopes**: ✅ `repo` (كل الصلاحيات)
3. اضغط **"Generate token"**
4. **انسخ Token** (سيظهر مرة واحدة!)

### استخدام Token

```bash
cd "/home/kali/Desktop/New Folder"

# استبدل YOUR_TOKEN بالـ Token الذي نسخته
git remote set-url origin https://amor1r:YOUR_TOKEN@github.com/amor1r/ics-platform.git

# رفع الكود
git push -u origin main
```

---

## 🚀 بعد رفع الكود على GitHub

### 1. Vercel سيرفع تلقائياً

إذا ربطت Vercel بـ repository، سيبدأ الرفع تلقائياً عند push.

### 2. إضافة قاعدة البيانات

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

### 3. إضافة Environment Variables

في Vercel Dashboard > **Settings** > **Environment Variables**:

```
DATABASE_URL=your_database_url
JWT_SECRET=6a6011cdd676be985bd61902c7f3b30b4dd11f7595b9dbc504d7c353318511c1
JWT_REFRESH_SECRET=518edb1d3259acabd0d4bac0dfb890bb83d5900e4ae2cf01a6b7bd10b1ab1d39
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
NODE_ENV=production
```

### 4. تشغيل Migrations

```bash
npm i -g vercel
vercel login
vercel link
vercel env pull
npx prisma migrate deploy
npx prisma db seed
```

---

## 📊 ملخص الحالة

| الخطوة | الحالة |
|--------|--------|
| Repository على GitHub | ✅ جاهز |
| Vercel CLI | ✅ مثبت |
| رفع الكود | ⏳ يحتاج Token |
| Vercel Dashboard | ✅ جاهز |
| قاعدة البيانات | ⏳ في الانتظار |

---

**الخطوة التالية**: 
1. إنشاء Personal Access Token على GitHub
2. أو استخدام Vercel Dashboard مباشرة

