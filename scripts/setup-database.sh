#!/bin/bash

# خطة إعداد قاعدة البيانات المتكاملة - منصة ICS
# هذا السكريبت يقوم بإعداد قاعدة البيانات بالكامل

set -e  # إيقاف عند أي خطأ

echo "=========================================="
echo "إعداد قاعدة البيانات - منصة ICS"
echo "=========================================="
echo ""

# الألوان للرسائل
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# متغيرات
DB_NAME="ics_platform"
DB_USER="ics_user"
DB_PASSWORD="ics_password"
PROJECT_DIR="/home/kali/Desktop/New Folder"

# دالة للطباعة الملونة
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "ℹ️  $1"
}

# التحقق من PostgreSQL
echo "المرحلة 1: التحقق من PostgreSQL..."
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL غير مثبت!"
    echo "يرجى تثبيت PostgreSQL أولاً:"
    echo "  sudo apt-get install postgresql postgresql-contrib"
    exit 1
fi

print_success "PostgreSQL مثبت"

# التحقق من حالة PostgreSQL
if ! sudo systemctl is-active --quiet postgresql; then
    print_warning "PostgreSQL غير يعمل. جاري التشغيل..."
    sudo systemctl start postgresql
    sleep 2
fi

if sudo systemctl is-active --quiet postgresql; then
    print_success "PostgreSQL يعمل"
else
    print_error "فشل تشغيل PostgreSQL"
    exit 1
fi

# التحقق من الصلاحيات
if ! sudo -n true 2>/dev/null; then
    print_warning "يحتاج هذا السكريبت إلى صلاحيات sudo"
    echo "سيتم طلب كلمة المرور..."
fi

echo ""
echo "المرحلة 2: إنشاء قاعدة البيانات..."

# إنشاء قاعدة البيانات والمستخدم
sudo -u postgres psql << EOF
-- التحقق من وجود قاعدة البيانات
SELECT 'Checking if database exists...' AS status;

-- حذف قاعدة البيانات إذا كانت موجودة (للتطوير فقط)
DROP DATABASE IF EXISTS $DB_NAME;

-- إنشاء قاعدة البيانات
CREATE DATABASE $DB_NAME
  WITH 
  ENCODING = 'UTF8'
  LC_COLLATE = 'en_US.UTF-8'
  LC_CTYPE = 'en_US.UTF-8'
  TEMPLATE = template0;

-- حذف المستخدم إذا كان موجوداً (للتطوير فقط)
DROP USER IF EXISTS $DB_USER;

-- إنشاء المستخدم
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';

-- منح الصلاحيات
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;

-- الاتصال بقاعدة البيانات ومنح الصلاحيات على Schema
\c $DB_NAME
GRANT ALL ON SCHEMA public TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;

\q
EOF

if [ $? -eq 0 ]; then
    print_success "تم إنشاء قاعدة البيانات والمستخدم بنجاح"
else
    print_error "فشل إنشاء قاعدة البيانات"
    exit 1
fi

# التحقق من الاتصال
echo ""
echo "المرحلة 3: التحقق من الاتصال..."
if PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -h localhost -c "SELECT version();" > /dev/null 2>&1; then
    print_success "الاتصال بقاعدة البيانات ناجح"
else
    print_error "فشل الاتصال بقاعدة البيانات"
    exit 1
fi

# الانتقال إلى مجلد المشروع
cd "$PROJECT_DIR" || exit 1

# التحقق من ملف .env
echo ""
echo "المرحلة 4: التحقق من ملف .env..."
if [ ! -f .env ]; then
    print_warning "ملف .env غير موجود. جاري إنشاؤه..."
    cat > .env << ENVEOF
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME?schema=public"
JWT_SECRET="ics-jwt-secret-key-change-in-production-$(openssl rand -hex 32)"
JWT_REFRESH_SECRET="ics-refresh-secret-key-change-in-production-$(openssl rand -hex 32)"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
NODE_ENV="development"
LOG_LEVEL="info"
ENVEOF
    print_success "تم إنشاء ملف .env"
else
    # تحديث DATABASE_URL إذا كان موجوداً
    if grep -q "DATABASE_URL" .env; then
        sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME?schema=public\"|" .env
        print_success "تم تحديث DATABASE_URL في ملف .env"
    else
        echo "DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME?schema=public\"" >> .env
        print_success "تم إضافة DATABASE_URL إلى ملف .env"
    fi
fi

# توليد Prisma Client
echo ""
echo "المرحلة 5: توليد Prisma Client..."
if npx prisma generate; then
    print_success "تم توليد Prisma Client بنجاح"
else
    print_error "فشل توليد Prisma Client"
    exit 1
fi

# إنشاء الجداول
echo ""
echo "المرحلة 6: إنشاء الجداول..."
if npx prisma db push --accept-data-loss; then
    print_success "تم إنشاء جميع الجداول بنجاح"
else
    print_error "فشل إنشاء الجداول"
    exit 1
fi

# التحقق من الجداول
echo ""
echo "المرحلة 7: التحقق من الجداول..."
TABLE_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -h localhost -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')

if [ "$TABLE_COUNT" -ge 18 ]; then
    print_success "تم إنشاء $TABLE_COUNT جدول (المتوقع: 18)"
else
    print_warning "تم إنشاء $TABLE_COUNT جدول (المتوقع: 18)"
fi

# عرض الجداول
echo ""
echo "الجداول المنشأة:"
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -h localhost -c "\dt" | grep -E "public|users|projects|comments"

# إنشاء البيانات التجريبية
echo ""
echo "المرحلة 8: إنشاء البيانات التجريبية..."
if npm run db:seed; then
    print_success "تم إنشاء البيانات التجريبية بنجاح"
else
    print_warning "فشل إنشاء البيانات التجريبية (قد تكون موجودة بالفعل)"
fi

# التحقق من البيانات
echo ""
echo "المرحلة 9: التحقق من البيانات..."
USER_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -h localhost -t -c "SELECT COUNT(*) FROM users;" | tr -d ' ')

if [ "$USER_COUNT" -ge 2 ]; then
    print_success "تم إنشاء $USER_COUNT مستخدم (المتوقع: 2 على الأقل)"
    echo ""
    echo "المستخدمين:"
    PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -h localhost -c "SELECT email, username, role FROM users;"
else
    print_warning "تم إنشاء $USER_COUNT مستخدم (المتوقع: 2 على الأقل)"
fi

# فحص شامل
echo ""
echo "=========================================="
echo "فحص شامل لقاعدة البيانات"
echo "=========================================="
echo ""

# فحص Indexes
echo "فحص Indexes..."
INDEX_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -h localhost -t -c "SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public';" | tr -d ' ')
print_info "عدد Indexes: $INDEX_COUNT"

# فحص Foreign Keys
echo "فحص Foreign Keys..."
FK_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -h localhost -t -c "SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public';" | tr -d ' ')
print_info "عدد Foreign Keys: $FK_COUNT"

# فحص Unique Constraints
echo "فحص Unique Constraints..."
UNIQUE_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -h localhost -t -c "SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'UNIQUE' AND table_schema = 'public';" | tr -d ' ')
print_info "عدد Unique Constraints: $UNIQUE_COUNT"

# ملخص نهائي
echo ""
echo "=========================================="
echo "✅ إعداد قاعدة البيانات مكتمل!"
echo "=========================================="
echo ""
echo "📊 الإحصائيات:"
echo "  - الجداول: $TABLE_COUNT"
echo "  - Indexes: $INDEX_COUNT"
echo "  - Foreign Keys: $FK_COUNT"
echo "  - Unique Constraints: $UNIQUE_COUNT"
echo "  - المستخدمين: $USER_COUNT"
echo ""
echo "🔐 حسابات الاختبار:"
echo "  المدير: admin@ics.com / Admin123!@#Password"
echo "  العضو: member@ics.com / Member123!@#Password"
echo ""
echo "🚀 الخطوة التالية:"
echo "  1. اذهب إلى: http://localhost:3000/login/admin"
echo "  2. سجل دخول بحساب المدير"
echo "  3. استمتع بالمنصة!"
echo ""

