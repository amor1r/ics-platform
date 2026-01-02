# دليل إعداد قاعدة البيانات يدوياً - منصة ICS

## 🎯 إعداد قاعدة البيانات يدوياً

### الخطوة 1: إنشاء قاعدة البيانات

افتح Terminal ونفذ:

```bash
# الدخول إلى PostgreSQL
sudo -u postgres psql

# في psql، نفذ:
CREATE DATABASE ics_platform;
CREATE USER ics_user WITH PASSWORD 'ics_password';
GRANT ALL PRIVILEGES ON DATABASE ics_platform TO ics_user;
ALTER USER ics_user CREATEDB;

\c ics_platform
GRANT ALL ON SCHEMA public TO ics_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ics_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ics_user;

\q
```

### الخطوة 2: تحديث ملف .env

```bash
cd "/home/kali/Desktop/New Folder"

# تأكد من وجود DATABASE_URL في .env
echo 'DATABASE_URL="postgresql://ics_user:ics_password@localhost:5432/ics_platform?schema=public"' >> .env
```

### الخطوة 3: إعداد Prisma

```bash
# توليد Prisma Client
npx prisma generate

# إنشاء الجداول
npx prisma db push
```

### الخطوة 4: إنشاء البيانات (بما في ذلك حساب المالك)

```bash
# إنشاء جميع الحسابات
npm run db:seed
```

### الخطوة 5: التحقق من حساب المالك

```bash
# التحقق من الحساب
npx tsx scripts/create-owner.ts
```

---

## 🔐 حساب المالك

**Email**: oomraraq0@gmail.com  
**Password**: AAaa4321  
**Role**: ADMIN  
**Username**: owner

---

## ✅ بعد الإعداد

1. اذهب إلى: http://localhost:3000/login/admin
2. سجل دخول بحساب المالك
3. استمتع بالمنصة!

