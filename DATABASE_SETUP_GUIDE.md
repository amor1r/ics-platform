# دليل إعداد قاعدة البيانات - منصة ICS

## 🎯 نظرة عامة

هذا الدليل يوضح كيفية إعداد قاعدة البيانات خطوة بخطوة مع فحص شامل لكل شيء.

---

## 📐 التصميم الهندسي والهيكلي

### البنية التحتية

#### 1. قاعدة البيانات
```
الاسم: ics_platform
المستخدم: ics_user
كلمة المرور: ics_password
المضيف: localhost
المنفذ: 5432
Schema: public
Encoding: UTF-8
```

#### 2. الهيكل
- **الجداول**: 18 جدول
- **Enums**: 7
- **العلاقات**: 50+ علاقة
- **Indexes**: 60+ index
- **Foreign Keys**: 30+ foreign key

---

## 🚀 خطة الإعداد (خطوة بخطوة)

### الخطوة 1: التحقق من PostgreSQL

```bash
# التحقق من الإصدار
psql --version

# التحقق من حالة الخدمة
sudo systemctl status postgresql

# إذا لم يكن يعمل، شغله:
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### الخطوة 2: إنشاء قاعدة البيانات

#### الطريقة 1: باستخدام psql
```bash
# الدخول إلى PostgreSQL
sudo -u postgres psql

# في psql، نفذ:
CREATE DATABASE ics_platform
  WITH 
  ENCODING = 'UTF8'
  LC_COLLATE = 'en_US.UTF-8'
  LC_CTYPE = 'en_US.UTF-8'
  TEMPLATE = template0;

CREATE USER ics_user WITH PASSWORD 'ics_password';

GRANT ALL PRIVILEGES ON DATABASE ics_platform TO ics_user;
ALTER USER ics_user CREATEDB;

\c ics_platform
GRANT ALL ON SCHEMA public TO ics_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ics_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ics_user;

\q
```

#### الطريقة 2: باستخدام SQL File
```bash
# إنشاء ملف SQL
cat > setup-db.sql << 'EOF'
CREATE DATABASE ics_platform
  WITH 
  ENCODING = 'UTF8'
  LC_COLLATE = 'en_US.UTF-8'
  LC_CTYPE = 'en_US.UTF-8'
  TEMPLATE = template0;

CREATE USER ics_user WITH PASSWORD 'ics_password';

GRANT ALL PRIVILEGES ON DATABASE ics_platform TO ics_user;
ALTER USER ics_user CREATEDB;
EOF

# تنفيذ الملف
sudo -u postgres psql -f setup-db.sql

# منح الصلاحيات على Schema
sudo -u postgres psql -d ics_platform << 'EOF'
GRANT ALL ON SCHEMA public TO ics_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ics_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ics_user;
EOF
```

### الخطوة 3: تحديث ملف .env

```bash
cd "/home/kali/Desktop/New Folder"

# تحديث DATABASE_URL
cat >> .env << 'EOF'
DATABASE_URL="postgresql://ics_user:ics_password@localhost:5432/ics_platform?schema=public"
EOF
```

### الخطوة 4: إعداد Prisma

```bash
# توليد Prisma Client
npx prisma generate

# إنشاء الجداول
npx prisma db push

# أو استخدام Migrations (موصى به)
npx prisma migrate dev --name init
```

### الخطوة 5: إنشاء البيانات التجريبية

```bash
# إنشاء الحسابات
npm run db:seed
```

### الخطوة 6: التحقق

```bash
# فتح Prisma Studio
npx prisma studio

# أو استخدام psql
psql -U ics_user -d ics_platform -c "SELECT email, username, role FROM users;"
```

---

## 🔍 فحص شامل

### فحص الجداول

```sql
-- عرض جميع الجداول
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- يجب أن ترى 18 جدول:
-- users, projects, project_likes, project_files,
-- activity_logs, admin_invites, sessions, password_resets,
-- categories, content, files, ctf_challenges, ctf_submissions,
-- tools, comments, bookmarks, user_progress, notifications
```

### فحص Indexes

```sql
-- عدد Indexes
SELECT COUNT(*) 
FROM pg_indexes 
WHERE schemaname = 'public';

-- يجب أن يكون 60+ index
```

### فحص Foreign Keys

```sql
-- عدد Foreign Keys
SELECT COUNT(*) 
FROM information_schema.table_constraints 
WHERE constraint_type = 'FOREIGN KEY' 
AND table_schema = 'public';

-- يجب أن يكون 30+ foreign key
```

### فحص البيانات

```sql
-- التحقق من المستخدمين
SELECT email, username, role, is_banned 
FROM users;

-- يجب أن ترى:
-- admin@ics.com, admin, ADMIN, false
-- member@ics.com, member, USER, false
```

---

## 📊 التصميم الهيكلي المفصل

### 1. User (المستخدم) - المركز الرئيسي

```
User (1)
  ├──> Projects (Many)
  ├──> ProjectLikes (Many)
  ├──> Comments (Many)
  ├──> Sessions (Many)
  ├──> ActivityLogs (Many)
  ├──> Notifications (Many)
  ├──> Bookmarks (Many)
  ├──> UserProgress (Many)
  ├──> CTFSubmissions (Many)
  ├──> Files (Many)
  ├──> Content (Many)
  ├──> AdminInvites (Many)
  ├──> PasswordResets (Many)
  └──> User (Self: bannedBy/bannedUsers)
```

### 2. Project (المشروع)

```
Project (1)
  ├──> User (author) (Many-to-One)
  ├──> Comments (Many)
  ├──> ProjectLikes (Many)
  └──> ProjectFiles (Many)
```

### 3. Content (المحتوى)

```
Content (1)
  ├──> User (author) (Many-to-One)
  ├──> Category (optional) (Many-to-One)
  ├──> Tool (optional) (One-to-One)
  ├──> Comments (Many)
  ├──> Bookmarks (Many)
  ├──> UserProgress (Many)
  └──> Files (Many)
```

---

## 🔧 التحسينات الموصى بها

### 1. Indexes إضافية

```sql
-- بعد إنشاء الجداول، أضف هذه Indexes:
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_banned ON users(is_banned);
CREATE INDEX idx_comments_created_at ON comments(created_at);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_type ON notifications(type);
```

### 2. Performance Tuning

```sql
-- تحسين PostgreSQL
ALTER DATABASE ics_platform SET work_mem = '16MB';
ALTER DATABASE ics_platform SET maintenance_work_mem = '256MB';
ALTER DATABASE ics_platform SET shared_buffers = '128MB';
```

---

## ✅ قائمة الفحص

### قبل الإعداد:
- [ ] PostgreSQL مثبت
- [ ] PostgreSQL يعمل
- [ ] صلاحيات sudo متاحة
- [ ] Prisma CLI مثبت
- [ ] ملف .env موجود

### بعد الإعداد:
- [ ] قاعدة البيانات موجودة
- [ ] المستخدم موجود
- [ ] الصلاحيات منح
- [ ] جميع الجداول موجودة (18)
- [ ] جميع Indexes موجودة (60+)
- [ ] البيانات التجريبية موجودة (2 مستخدم)

---

## 🐛 حل المشاكل

### المشكلة: "Can't reach database server"
**الحل**:
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### المشكلة: "permission denied"
**الحل**:
```sql
GRANT ALL PRIVILEGES ON DATABASE ics_platform TO ics_user;
GRANT ALL ON SCHEMA public TO ics_user;
```

### المشكلة: "relation does not exist"
**الحل**:
```bash
npx prisma db push
```

---

**جاهز للبدء!** 🚀

