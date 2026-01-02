# خطة إعداد قاعدة البيانات المتكاملة - منصة ICS

## 📊 التصميم الهندسي والهيكلي

### 🏗️ البنية التحتية

#### 1. قاعدة البيانات: PostgreSQL
- **الإصدار**: PostgreSQL 14+
- **الاسم**: `ics_platform`
- **Schema**: `public`
- **Character Set**: UTF-8
- **Collation**: `en_US.UTF-8`

#### 2. المستخدم والصلاحيات
- **المستخدم**: `ics_user`
- **كلمة المرور**: `ics_password` (يجب تغييرها في الإنتاج)
- **الصلاحيات**: 
  - CREATE, SELECT, INSERT, UPDATE, DELETE
  - CREATE DATABASE (للمستخدم)
  - CONNECT (للقاعدة)

---

## 📐 التصميم الهيكلي

### 📊 إحصائيات المخطط

#### الجداول (Models): 18 جدول
1. **User** - المستخدمين
2. **Project** - المشاريع
3. **ProjectLike** - إعجابات المشاريع
4. **ProjectFile** - ملفات المشاريع
5. **ActivityLog** - سجلات النشاط
6. **AdminInvite** - دعوات المدراء
7. **Session** - الجلسات
8. **PasswordReset** - إعادة تعيين كلمة المرور
9. **Category** - الفئات
10. **Content** - المحتوى
11. **File** - الملفات
12. **CTFChallenge** - تحديات CTF
13. **CTFSubmission** - إجابات CTF
14. **Tool** - الأدوات
15. **Comment** - التعليقات
16. **Bookmark** - الإشارات المرجعية
17. **UserProgress** - تقدم المستخدم
18. **Notification** - الإشعارات

#### التعدادات (Enums): 7
1. **UserRole** - أدوار المستخدمين (USER, MODERATOR, ADMIN)
2. **ProjectCategory** - فئات المشاريع
3. **ProjectStatus** - حالات المشاريع
4. **ActivityType** - أنواع النشاط
5. **ContentType** - أنواع المحتوى
6. **ContentStatus** - حالات المحتوى
7. **CTFDifficulty** - صعوبة CTF

---

## 🔗 العلاقات (Relationships)

### العلاقات الرئيسية:

#### 1. User Relations (15 علاقة)
- `authoredProjects` → Project[] (One-to-Many)
- `projectLikes` → ProjectLike[] (One-to-Many)
- `comments` → Comment[] (One-to-Many)
- `sessions` → Session[] (One-to-Many)
- `activityLogs` → ActivityLog[] (One-to-Many)
- `notifications` → Notification[] (One-to-Many)
- `bannedByUser` → User? (Self-relation)
- `bannedUsers` → User[] (Self-relation)
- `createdInvites` → AdminInvite[] (One-to-Many)
- `authoredContent` → Content[] (One-to-Many)
- `uploadedFiles` → File[] (One-to-Many)
- `bookmarks` → Bookmark[] (One-to-Many)
- `progress` → UserProgress[] (One-to-Many)
- `ctfSubmissions` → CTFSubmission[] (One-to-Many)
- `passwordResets` → PasswordReset[] (One-to-Many)

#### 2. Project Relations (4 علاقات)
- `author` → User (Many-to-One)
- `comments` → Comment[] (One-to-Many)
- `likes` → ProjectLike[] (One-to-Many)
- `files` → ProjectFile[] (One-to-Many)

#### 3. Content Relations (7 علاقات)
- `author` → User (Many-to-One)
- `category` → Category? (Many-to-One, Optional)
- `files` → File[] (One-to-Many)
- `comments` → Comment[] (One-to-Many)
- `bookmarks` → Bookmark[] (One-to-Many)
- `progress` → UserProgress[] (One-to-Many)
- `relatedTool` → Tool? (One-to-One, Optional)

---

## 🔍 فحص المخطط بالكامل

### ✅ فحص الجداول

#### 1. User Table
- ✅ Primary Key: `id` (CUID)
- ✅ Unique Constraints: `email`, `username`
- ✅ Indexes: لا يوجد indexes مباشرة (لكن Foreign Keys لها indexes)
- ✅ Relations: 15 علاقة
- ✅ Fields: 13 حقل
- ⚠️ **ملاحظة**: قد نحتاج index على `role` للبحث السريع

#### 2. Project Table
- ✅ Primary Key: `id` (CUID)
- ✅ Unique Constraints: `slug`
- ✅ Indexes: `authorId`, `category`, `status`, `slug`, `createdAt`
- ✅ Relations: 4 علاقات
- ✅ Fields: 11 حقل
- ✅ **ممتاز**: Indexes شاملة

#### 3. ProjectLike Table
- ✅ Primary Key: `id` (CUID)
- ✅ Unique Constraints: `[projectId, userId]` (Composite)
- ✅ Indexes: `projectId`, `userId`
- ✅ Relations: 2 علاقات
- ✅ Fields: 4 حقول
- ✅ **ممتاز**: Composite unique constraint يمنع الإعجاب المكرر

#### 4. Comment Table
- ✅ Primary Key: `id` (CUID)
- ✅ Unique Constraints: لا يوجد
- ✅ Indexes: `contentId`, `projectId`, `userId`, `parentId`
- ✅ Relations: 5 علاقات (Self-relation للردود)
- ✅ Fields: 7 حقول
- ✅ **ممتاز**: يدعم التعليقات المتداخلة

#### 5. Session Table
- ✅ Primary Key: `id` (CUID)
- ✅ Unique Constraints: `token`, `refreshToken`
- ✅ Indexes: `userId`, `token`, `refreshToken`, `expiresAt`
- ✅ Relations: 1 علاقة
- ✅ Fields: 8 حقول
- ✅ **ممتاز**: Indexes على جميع الحقول المهمة

#### 6. ActivityLog Table
- ✅ Primary Key: `id` (CUID)
- ✅ Unique Constraints: لا يوجد
- ✅ Indexes: `userId`, `type`, `createdAt`
- ✅ Relations: 1 علاقة
- ✅ Fields: 7 حقول
- ✅ **ممتاز**: Indexes للبحث والفلترة

---

## 🔍 فحص الأداء والتحسينات

### Indexes المطلوبة (إضافية)

#### 1. User Table
```prisma
@@index([role])  // للبحث السريع حسب الدور
@@index([isBanned])  // للبحث عن المستخدمين المحظورين
@@index([emailVerified])  // للبحث عن المستخدمين المؤكدين
```

#### 2. Project Table
```prisma
// موجودة بالفعل ✅
```

#### 3. Comment Table
```prisma
@@index([createdAt])  // للترتيب الزمني
```

#### 4. Notification Table
```prisma
@@index([createdAt])  // للترتيب الزمني
@@index([type])  // للفلترة حسب النوع
```

---

## 📋 خطة الإعداد خطوة بخطوة

### المرحلة 1: التحضير (5 دقائق)

#### 1.1 التحقق من PostgreSQL
```bash
# التحقق من الإصدار
psql --version

# التحقق من حالة الخدمة
sudo systemctl status postgresql
```

#### 1.2 التحقق من المتطلبات
- [ ] PostgreSQL 14+ مثبت
- [ ] صلاحيات sudo متاحة
- [ ] Prisma CLI مثبت
- [ ] ملف `.env` موجود

---

### المرحلة 2: إنشاء قاعدة البيانات (10 دقائق)

#### 2.1 إنشاء قاعدة البيانات والمستخدم
```bash
# الدخول إلى PostgreSQL
sudo -u postgres psql

# إنشاء قاعدة البيانات
CREATE DATABASE ics_platform
  WITH 
  ENCODING = 'UTF8'
  LC_COLLATE = 'en_US.UTF-8'
  LC_CTYPE = 'en_US.UTF-8'
  TEMPLATE = template0;

# إنشاء المستخدم
CREATE USER ics_user WITH PASSWORD 'ics_password';

# منح الصلاحيات
GRANT ALL PRIVILEGES ON DATABASE ics_platform TO ics_user;
ALTER USER ics_user CREATEDB;

# الخروج
\q
```

#### 2.2 التحقق من الاتصال
```bash
# اختبار الاتصال
psql -U ics_user -d ics_platform -h localhost -c "SELECT version();"
```

---

### المرحلة 3: إعداد Prisma (15 دقائق)

#### 3.1 توليد Prisma Client
```bash
cd "/home/kali/Desktop/New Folder"
npx prisma generate
```

#### 3.2 إنشاء الجداول
```bash
# إنشاء جميع الجداول
npx prisma db push

# أو استخدام Migrations (موصى به للإنتاج)
npx prisma migrate dev --name init
```

#### 3.3 التحقق من الجداول
```bash
# فتح Prisma Studio
npx prisma studio

# أو استخدام psql
psql -U ics_user -d ics_platform -c "\dt"
```

---

### المرحلة 4: إنشاء البيانات التجريبية (10 دقائق)

#### 4.1 إنشاء الحسابات
```bash
# إنشاء حساب المدير والعضو
npm run db:seed
```

#### 4.2 التحقق من البيانات
```bash
# التحقق من المستخدمين
psql -U ics_user -d ics_platform -c "SELECT email, username, role FROM users;"
```

---

### المرحلة 5: الفحص الشامل (30 دقيقة)

#### 5.1 فحص الجداول
- [ ] جميع الجداول موجودة (18 جدول)
- [ ] جميع العلاقات صحيحة
- [ ] جميع Indexes موجودة
- [ ] جميع Constraints موجودة

#### 5.2 فحص البيانات
- [ ] حساب المدير موجود
- [ ] حساب العضو موجود
- [ ] البيانات صحيحة

#### 5.3 فحص الأداء
- [ ] Indexes تعمل بشكل صحيح
- [ ] Queries سريعة
- [ ] لا توجد N+1 queries

---

## 🔍 فحص المخطط بالتفصيل

### ✅ فحص كل جدول:

#### 1. User (المستخدمين)
**الحقول**: 13
- ✅ `id` - Primary Key (CUID)
- ✅ `email` - Unique, Required
- ✅ `username` - Unique, Required
- ✅ `passwordHash` - Required, Mapped
- ✅ `role` - Enum, Default: USER
- ✅ `avatar` - Optional
- ✅ `birthdate` - Optional
- ✅ `emailVerified` - Boolean, Default: false
- ✅ `isBanned` - Boolean, Default: false
- ✅ `bannedAt` - Optional
- ✅ `bannedBy` - Optional, Foreign Key
- ✅ `lastLoginAt` - Optional
- ✅ `createdAt` - Auto, Default: now()
- ✅ `updatedAt` - Auto, Updated on change

**العلاقات**: 15
- ✅ جميع العلاقات محددة بشكل صحيح
- ✅ Cascade deletes محددة بشكل صحيح

**Indexes**: 
- ⚠️ **مفقود**: index على `role`
- ⚠️ **مفقود**: index على `isBanned`

**التقييم**: ✅ جيد جداً (9/10)

#### 2. Project (المشاريع)
**الحقول**: 11
- ✅ جميع الحقول محددة بشكل صحيح
- ✅ `slug` - Unique
- ✅ `status` - Enum, Default: DRAFT
- ✅ `allowComments` - Boolean, Default: true
- ✅ `allowLikes` - Boolean, Default: true

**العلاقات**: 4
- ✅ جميع العلاقات محددة بشكل صحيح
- ✅ Cascade delete على author

**Indexes**: 
- ✅ `authorId` - موجود
- ✅ `category` - موجود
- ✅ `status` - موجود
- ✅ `slug` - موجود
- ✅ `createdAt` - موجود

**التقييم**: ✅ ممتاز (10/10)

#### 3. Comment (التعليقات)
**الحقول**: 7
- ✅ يدعم التعليقات على Projects و Content
- ✅ يدعم التعليقات المتداخلة (parentId)
- ✅ `comment` - Text type

**العلاقات**: 5
- ✅ Self-relation للردود
- ✅ Cascade deletes

**Indexes**: 
- ✅ جميع Foreign Keys لها indexes
- ⚠️ **مفقود**: index على `createdAt` للترتيب

**التقييم**: ✅ جيد جداً (9/10)

#### 4. Session (الجلسات)
**الحقول**: 8
- ✅ `token` - Unique
- ✅ `refreshToken` - Unique
- ✅ `expiresAt` - للتنظيف التلقائي

**Indexes**: 
- ✅ جميع الحقول المهمة لها indexes

**التقييم**: ✅ ممتاز (10/10)

#### 5. ActivityLog (سجلات النشاط)
**الحقول**: 7
- ✅ `details` - JSON type (مرن)
- ✅ `type` - Enum

**Indexes**: 
- ✅ `userId` - موجود
- ✅ `type` - موجود
- ✅ `createdAt` - موجود

**التقييم**: ✅ ممتاز (10/10)

---

## 🔧 التحسينات الموصى بها

### 1. Indexes إضافية
```prisma
// User model
@@index([role])
@@index([isBanned])
@@index([emailVerified])

// Comment model
@@index([createdAt])

// Notification model
@@index([createdAt])
@@index([type])
```

### 2. Constraints إضافية
```prisma
// Email format validation (على مستوى التطبيق)
// Password strength (على مستوى التطبيق)
```

### 3. Performance Optimization
- [ ] Connection Pooling
- [ ] Query Optimization
- [ ] Caching Strategy

---

## 📊 مخطط العلاقات (ER Diagram)

```
User (1) ──< (Many) Project
User (1) ──< (Many) ProjectLike
User (1) ──< (Many) Comment
User (1) ──< (Many) Session
User (1) ──< (Many) ActivityLog
User (1) ──< (Many) Notification
User (1) ──< (Many) Bookmark
User (1) ──< (Many) UserProgress
User (1) ──< (Many) CTFSubmission
User (1) ──< (Many) File
User (1) ──< (Many) Content
User (1) ──< (Many) AdminInvite
User (1) ──< (Many) PasswordReset
User (1) ──< (Many) User (bannedBy/bannedUsers)

Project (1) ──< (Many) Comment
Project (1) ──< (Many) ProjectLike
Project (1) ──< (Many) ProjectFile

Content (1) ──< (Many) Comment
Content (1) ──< (Many) Bookmark
Content (1) ──< (Many) UserProgress
Content (1) ──< (Many) File
Content (1) ──> (1) Tool
Content (Many) ──> (1) Category

CTFChallenge (1) ──< (Many) CTFSubmission

Comment (1) ──< (Many) Comment (replies)
```

---

## 🚀 خطة التنفيذ

### الخطوة 1: التحضير ✅
- [x] فحص المخطط
- [x] إنشاء الخطة
- [ ] التحقق من PostgreSQL

### الخطوة 2: إنشاء قاعدة البيانات
- [ ] إنشاء قاعدة البيانات
- [ ] إنشاء المستخدم
- [ ] منح الصلاحيات

### الخطوة 3: إعداد Prisma
- [ ] توليد Prisma Client
- [ ] إنشاء الجداول
- [ ] التحقق من الجداول

### الخطوة 4: البيانات التجريبية
- [ ] إنشاء الحسابات
- [ ] التحقق من البيانات

### الخطوة 5: الفحص الشامل
- [ ] فحص جميع الجداول
- [ ] فحص العلاقات
- [ ] فحص Indexes
- [ ] فحص الأداء

---

**الحالة**: ✅ الخطة جاهزة للتنفيذ

