# ICS Platform - Information Cyber Security

منصة تعليمية احترافية للأمن السيبراني مع نظام صلاحيات متقدم وأمان عالي.

## المميزات

- ✅ نظام مصادقة آمن (JWT + HttpOnly Cookies)
- ✅ نظام صلاحيات متقدم (RBAC)
- ✅ فصل كامل بين واجهات المدراء والأعضاء
- ✅ نظام مشاريع تعليمية مع Markdown
- ✅ نظام تعليقات مع Rate Limiting
- ✅ تصميم سيبراني احترافي (Dark Cyber Theme)
- ✅ أمان على أعلى مستوى

## التقنيات المستخدمة

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + HttpOnly Cookies
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Validation**: Zod
- **Image Processing**: Sharp

## البدء

### المتطلبات

- Node.js 18+ 
- PostgreSQL 14+
- npm أو yarn

### التثبيت

1. استنساخ المشروع:
```bash
git clone <repository-url>
cd ics-platform
```

2. تثبيت Dependencies:
```bash
npm install
```

3. إعداد Environment Variables:
```bash
cp .env.example .env
# قم بتعديل .env وإضافة القيم المطلوبة
```

4. إعداد قاعدة البيانات:
```bash
# إنشاء قاعدة البيانات في PostgreSQL أولاً
npm run db:push
npm run db:generate
```

5. تشغيل المشروع:
```bash
npm run dev
```

المشروع سيعمل على `http://localhost:3000`

## البنية التحتية

- **Prisma Schema**: `prisma/schema.prisma`
- **API Routes**: `app/api/`
- **Pages**: `app/`
- **Components**: `components/`
- **Utilities**: `lib/`

## الأمان

- Security Headers في `next.config.js`
- Rate Limiting على جميع Endpoints
- Input Validation مع Zod
- CSRF Protection
- XSS Prevention
- SQL Injection Prevention (Prisma)

## التوثيق

- `ARCHITECTURE.md` - المعمارية
- `SECURITY.md` - سياسة الأمان
- `API_DOCS.md` - توثيق API
- `ADMIN_GUIDE.md` - دليل المدراء

## التطوير

```bash
# Development
npm run dev

# Build
npm run build

# Start Production
npm start

# Database
npm run db:studio  # Prisma Studio
npm run db:migrate # Create migration
```

## الترخيص

MIT
