# التصميم الهندسي والهيكلي لقاعدة البيانات - منصة ICS

## 🏗️ البنية التحتية

### 1. نظام قاعدة البيانات
- **النوع**: PostgreSQL 14+
- **الاسم**: `ics_platform`
- **Schema**: `public`
- **Encoding**: UTF-8
- **Collation**: en_US.UTF-8

### 2. المستخدم والصلاحيات
- **المستخدم**: `ics_user`
- **الصلاحيات**: 
  - CREATE, SELECT, INSERT, UPDATE, DELETE
  - CREATE DATABASE
  - CONNECT

---

## 📊 الهيكل الكامل

### الجداول (18 جدول)

#### 1. **users** - المستخدمين
```sql
- id (CUID, Primary Key)
- email (Unique, Required)
- username (Unique, Required)
- password_hash (Required)
- role (Enum: USER, MODERATOR, ADMIN)
- avatar (Optional)
- birthdate (Optional)
- email_verified (Boolean, Default: false)
- is_banned (Boolean, Default: false)
- banned_at (Optional)
- banned_by (Optional, Foreign Key → users.id)
- last_login_at (Optional)
- created_at (Auto)
- updated_at (Auto)
```

**العلاقات**: 15 علاقة
- authoredProjects → projects[]
- projectLikes → project_likes[]
- comments → comments[]
- sessions → sessions[]
- activityLogs → activity_logs[]
- notifications → notifications[]
- bannedByUser → users? (Self-relation)
- bannedUsers → users[] (Self-relation)
- createdInvites → admin_invites[]
- authoredContent → content[]
- uploadedFiles → files[]
- bookmarks → bookmarks[]
- progress → user_progress[]
- ctfSubmissions → ctf_submissions[]
- passwordResets → password_resets[]

**Indexes المطلوبة**:
- ✅ Primary Key: id
- ✅ Unique: email, username
- ⚠️ **مفقود**: role (للبحث السريع)
- ⚠️ **مفقود**: is_banned (للبحث السريع)

#### 2. **projects** - المشاريع
```sql
- id (CUID, Primary Key)
- title (Required)
- slug (Unique, Required)
- description (Text)
- content (Text)
- category (Enum: TOOLS, KALI_LINUX, COMMANDS, GENERAL_CYBER)
- author_id (Foreign Key → users.id)
- status (Enum: DRAFT, PUBLISHED, ARCHIVED, Default: DRAFT)
- allow_comments (Boolean, Default: true)
- allow_likes (Boolean, Default: true)
- views (Int, Default: 0)
- created_at (Auto)
- updated_at (Auto)
```

**العلاقات**: 4 علاقات
- author → users (Many-to-One)
- comments → comments[]
- likes → project_likes[]
- files → project_files[]

**Indexes**:
- ✅ author_id
- ✅ category
- ✅ status
- ✅ slug
- ✅ created_at

**التقييم**: ✅ ممتاز (10/10)

#### 3. **project_likes** - إعجابات المشاريع
```sql
- id (CUID, Primary Key)
- project_id (Foreign Key → projects.id)
- user_id (Foreign Key → users.id)
- created_at (Auto)
```

**Constraints**:
- ✅ Unique: [project_id, user_id] (يمنع الإعجاب المكرر)

**Indexes**:
- ✅ project_id
- ✅ user_id

**التقييم**: ✅ ممتاز (10/10)

#### 4. **project_files** - ملفات المشاريع
```sql
- id (CUID, Primary Key)
- project_id (Foreign Key → projects.id)
- filename (Required)
- path (Required)
- size (Int)
- mime_type (Required)
- created_at (Auto)
```

**Indexes**:
- ✅ project_id

**التقييم**: ✅ جيد (9/10)

#### 5. **activity_logs** - سجلات النشاط
```sql
- id (CUID, Primary Key)
- user_id (Foreign Key → users.id)
- type (Enum: LOGIN, LOGOUT, PROJECT_CREATE, etc.)
- action (String)
- details (JSON, Optional)
- ip_address (Optional)
- user_agent (Optional)
- created_at (Auto)
```

**Indexes**:
- ✅ user_id
- ✅ type
- ✅ created_at

**التقييم**: ✅ ممتاز (10/10)

#### 6. **admin_invites** - دعوات المدراء
```sql
- id (CUID, Primary Key)
- token (Unique, Required)
- email (Required)
- created_by_id (Foreign Key → users.id)
- expires_at (Required)
- used_at (Optional)
- created_at (Auto)
```

**Indexes**:
- ✅ token
- ✅ email
- ✅ expires_at

**التقييم**: ✅ ممتاز (10/10)

#### 7. **sessions** - الجلسات
```sql
- id (CUID, Primary Key)
- user_id (Foreign Key → users.id)
- token (Unique, Required)
- refresh_token (Unique, Required)
- ip_address (Optional)
- user_agent (Optional)
- expires_at (Required)
- created_at (Auto)
```

**Indexes**:
- ✅ user_id
- ✅ token
- ✅ refresh_token
- ✅ expires_at

**التقييم**: ✅ ممتاز (10/10)

#### 8. **password_resets** - إعادة تعيين كلمة المرور
```sql
- id (CUID, Primary Key)
- user_id (Foreign Key → users.id)
- token (Unique, Required)
- expires_at (Required)
- used_at (Optional)
- created_at (Auto)
```

**Indexes**:
- ✅ token
- ✅ user_id
- ✅ expires_at

**التقييم**: ✅ ممتاز (10/10)

#### 9. **categories** - الفئات
```sql
- id (CUID, Primary Key)
- name (Required)
- slug (Unique, Required)
- description (Optional)
- icon (Optional)
- parent_id (Optional, Foreign Key → categories.id)
- order (Int, Default: 0)
- created_at (Auto)
- updated_at (Auto)
```

**العلاقات**: Self-relation (Hierarchical)
- parent → categories?
- children → categories[]

**التقييم**: ✅ ممتاز (10/10)

#### 10. **content** - المحتوى
```sql
- id (CUID, Primary Key)
- title (Required)
- slug (Unique, Required)
- description (Optional)
- content (Text)
- category_id (Optional, Foreign Key → categories.id)
- author_id (Foreign Key → users.id)
- type (Enum: MANUAL, TUTORIAL, GUIDE, CTF)
- status (Enum: DRAFT, PUBLISHED, ARCHIVED, Default: DRAFT)
- views (Int, Default: 0)
- rating (Float, Default: 0)
- rating_count (Int, Default: 0)
- created_at (Auto)
- updated_at (Auto)
```

**العلاقات**: 7 علاقات
- category → categories?
- author → users
- files → files[]
- comments → comments[]
- bookmarks → bookmarks[]
- progress → user_progress[]
- relatedTool → tools?

**Indexes**:
- ✅ category_id
- ✅ author_id
- ✅ type
- ✅ status
- ✅ slug

**التقييم**: ✅ ممتاز (10/10)

#### 11. **files** - الملفات
```sql
- id (CUID, Primary Key)
- filename (Required)
- original_name (Required)
- path (Required)
- size (Int)
- mime_type (Required)
- uploader_id (Foreign Key → users.id)
- content_id (Optional, Foreign Key → content.id)
- created_at (Auto)
```

**Indexes**:
- ✅ uploader_id
- ✅ content_id

**التقييم**: ✅ جيد (9/10)

#### 12. **ctf_challenges** - تحديات CTF
```sql
- id (CUID, Primary Key)
- title (Required)
- description (Text)
- difficulty (Enum: EASY, MEDIUM, HARD, EXPERT)
- category (String)
- flag (Required)
- points (Int, Default: 100)
- files (String[], Default: [])
- hints (String[], Default: [])
- solved_count (Int, Default: 0)
- created_at (Auto)
- updated_at (Auto)
```

**Indexes**:
- ✅ difficulty
- ✅ category

**التقييم**: ✅ ممتاز (10/10)

#### 13. **ctf_submissions** - إجابات CTF
```sql
- id (CUID, Primary Key)
- challenge_id (Foreign Key → ctf_challenges.id)
- user_id (Foreign Key → users.id)
- flag (Required)
- is_correct (Boolean, Default: false)
- submitted_at (Auto)
```

**Constraints**:
- ✅ Unique: [challenge_id, user_id, is_correct]

**Indexes**:
- ✅ challenge_id
- ✅ user_id

**التقييم**: ✅ ممتاز (10/10)

#### 14. **tools** - الأدوات
```sql
- id (CUID, Primary Key)
- name (Unique, Required)
- description (Text, Optional)
- category (String)
- usage_examples (Text, Optional)
- documentation (Text, Optional)
- related_content_id (Optional, Unique, Foreign Key → content.id)
```

**Indexes**:
- ✅ category

**التقييم**: ✅ جيد (9/10)

#### 15. **comments** - التعليقات
```sql
- id (CUID, Primary Key)
- content_id (Optional, Foreign Key → content.id)
- project_id (Optional, Foreign Key → projects.id)
- user_id (Foreign Key → users.id)
- comment (Text)
- parent_id (Optional, Foreign Key → comments.id)
- created_at (Auto)
- updated_at (Auto)
```

**العلاقات**: Self-relation (للردود)
- parent → comments?
- replies → comments[]

**Indexes**:
- ✅ content_id
- ✅ project_id
- ✅ user_id
- ✅ parent_id
- ⚠️ **مفقود**: created_at (للترتيب الزمني)

**التقييم**: ✅ جيد جداً (9/10)

#### 16. **bookmarks** - الإشارات المرجعية
```sql
- id (CUID, Primary Key)
- user_id (Foreign Key → users.id)
- content_id (Foreign Key → content.id)
- created_at (Auto)
```

**Constraints**:
- ✅ Unique: [user_id, content_id]

**Indexes**:
- ✅ user_id
- ✅ content_id

**التقييم**: ✅ ممتاز (10/10)

#### 17. **user_progress** - تقدم المستخدم
```sql
- id (CUID, Primary Key)
- user_id (Foreign Key → users.id)
- content_id (Foreign Key → content.id)
- completed (Boolean, Default: false)
- progress_percentage (Int, Default: 0)
- last_accessed (Auto)
- created_at (Auto)
- updated_at (Auto)
```

**Constraints**:
- ✅ Unique: [user_id, content_id]

**Indexes**:
- ✅ user_id
- ✅ content_id

**التقييم**: ✅ ممتاز (10/10)

#### 18. **notifications** - الإشعارات
```sql
- id (CUID, Primary Key)
- user_id (Foreign Key → users.id)
- title (Required)
- message (Text)
- type (String)
- read (Boolean, Default: false)
- created_at (Auto)
```

**Indexes**:
- ✅ user_id
- ✅ read
- ⚠️ **مفقود**: created_at (للترتيب الزمني)
- ⚠️ **مفقود**: type (للفلترة)

**التقييم**: ✅ جيد جداً (8/10)

---

## 🔍 تحليل العلاقات

### العلاقات الرئيسية:

#### User (المستخدم) - المركز الرئيسي
- **15 علاقة** - المركز الرئيسي للنظام
- **Self-relation**: bannedBy/bannedUsers (للحظر)
- **Cascade Deletes**: على معظم العلاقات

#### Project (المشروع)
- **4 علاقات** - بسيطة وواضحة
- **Cascade Delete**: عند حذف المستخدم

#### Content (المحتوى)
- **7 علاقات** - معقدة قليلاً
- **Optional Relations**: category, relatedTool

#### Comment (التعليق)
- **5 علاقات** - مع Self-relation للردود
- **Flexible**: يمكن أن يكون على Project أو Content

---

## 📊 الإحصائيات الكاملة

### الجداول: 18
### Enums: 7
### العلاقات: 50+
### Indexes: 60+
### Foreign Keys: 30+
### Unique Constraints: 10+

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

### 2. Performance Optimization
- [ ] Connection Pooling
- [ ] Query Optimization
- [ ] Caching Strategy
- [ ] Partitioning (للجداول الكبيرة)

### 3. Security Enhancements
- [ ] Row Level Security (RLS)
- [ ] Encryption at Rest
- [ ] Audit Logging

---

## ✅ التقييم النهائي

### التصميم العام: ✅ ممتاز (9.5/10)

**نقاط القوة**:
- ✅ هيكل واضح ومنظم
- ✅ علاقات محددة بشكل صحيح
- ✅ Indexes شاملة
- ✅ Cascade deletes محددة
- ✅ Unique constraints صحيحة
- ✅ يدعم Features متقدمة (CTF, Bookmarks, Progress)

**نقاط التحسين**:
- ⚠️ بعض Indexes مفقودة
- ⚠️ يمكن إضافة Partitioning للجداول الكبيرة

---

**الخلاصة**: التصميم ممتاز وجاهز للإنتاج مع بعض التحسينات الطفيفة!

