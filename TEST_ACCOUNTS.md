# حسابات الاختبار لمنصة ICS

## 🔐 حسابات تجريبية

### حساب المدير (Admin)
```
📧 Email: admin@ics.com
👤 Username: admin
🔑 Password: Admin123!@#Password
🎭 Role: ADMIN
```

### حساب العضو (Member)
```
📧 Email: member@ics.com
👤 Username: member
🔑 Password: Member123!@#Password
🎭 Role: USER
```

---

## 🚀 كيفية إنشاء الحسابات

### بعد إعداد قاعدة البيانات:

#### 1. إنشاء حساب المدير:
```bash
cd "/home/kali/Desktop/New Folder"
npx tsx scripts/create-admin.ts
```

#### 2. إنشاء حساب العضو:
```bash
npx tsx scripts/create-member.ts
```

#### 3. أو إنشاء الحسابين معاً:
```bash
npx tsx scripts/create-admin.ts && npx tsx scripts/create-member.ts
```

---

## 📝 ملاحظات مهمة

1. **قاعدة البيانات**: يجب أن تكون PostgreSQL تعمل وقاعدة البيانات `ics_platform` موجودة
2. **Prisma**: يجب تشغيل `npx prisma db push` أولاً لإنشاء الجداول
3. **الأمان**: هذه حسابات تجريبية فقط - لا تستخدمها في الإنتاج!

---

## 🔍 اختبار الحسابات

### تسجيل دخول المدير:
1. اذهب إلى: http://localhost:3000/login/admin
2. أدخل:
   - Email: `admin@ics.com`
   - Password: `Admin123!@#Password`
3. يجب أن يتم توجيهك إلى: `/admin/dashboard`

### تسجيل دخول العضو:
1. اذهب إلى: http://localhost:3000/login/member
2. أدخل:
   - Email: `member@ics.com`
   - Password: `Member123!@#Password`
3. يجب أن يتم توجيهك إلى: `/member/dashboard`

---

## 🛠️ إعداد قاعدة البيانات (إذا لم تكن متاحة)

### على Kali Linux:

```bash
# 1. تثبيت PostgreSQL (إذا لم يكن مثبتاً)
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# 2. تشغيل PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 3. إنشاء قاعدة البيانات والمستخدم
sudo -u postgres psql << EOF
CREATE DATABASE ics_platform;
CREATE USER ics_user WITH PASSWORD 'ics_password';
GRANT ALL PRIVILEGES ON DATABASE ics_platform TO ics_user;
\q
EOF

# 4. إعداد Prisma
cd "/home/kali/Desktop/New Folder"
npx prisma db push

# 5. إنشاء الحسابات التجريبية
npx tsx scripts/create-admin.ts
npx tsx scripts/create-member.ts
```

---

## ✅ التحقق من الحسابات

بعد إنشاء الحسابات، يمكنك التحقق منها:

```bash
# استخدام Prisma Studio
npx prisma studio

# أو استخدام psql
psql -U ics_user -d ics_platform -c "SELECT email, username, role FROM users;"
```

