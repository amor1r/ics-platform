#!/bin/bash
# إعداد سريع لقاعدة البيانات مع حساب المالك

set -e

DB_NAME="ics_platform"
DB_USER="ics_user"
DB_PASSWORD="ics_password"
PROJECT_DIR="/home/kali/Desktop/New Folder"

echo "=========================================="
echo "إعداد قاعدة البيانات - منصة ICS"
echo "=========================================="
echo ""

# إنشاء قاعدة البيانات
echo "المرحلة 1: إنشاء قاعدة البيانات..."
sudo -u postgres psql << PSQL_EOF
DROP DATABASE IF EXISTS $DB_NAME;
CREATE DATABASE $DB_NAME;
DROP USER IF EXISTS $DB_USER;
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;
\c $DB_NAME
GRANT ALL ON SCHEMA public TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;
\q
PSQL_EOF

echo "✅ تم إنشاء قاعدة البيانات"
echo ""

# الانتقال إلى مجلد المشروع
cd "$PROJECT_DIR"

# تحديث .env
echo "المرحلة 2: تحديث ملف .env..."
if [ ! -f .env ]; then
    cat > .env << ENV_EOF
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME?schema=public"
JWT_SECRET="ics-jwt-secret-key-change-in-production"
JWT_REFRESH_SECRET="ics-refresh-secret-key-change-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
NODE_ENV="development"
LOG_LEVEL="info"
ENV_EOF
else
    if grep -q "DATABASE_URL" .env; then
        sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME?schema=public\"|" .env
    else
        echo "DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME?schema=public\"" >> .env
    fi
fi

echo "✅ تم تحديث ملف .env"
echo ""

# توليد Prisma Client
echo "المرحلة 3: توليد Prisma Client..."
npx prisma generate

echo "✅ تم توليد Prisma Client"
echo ""

# إنشاء الجداول
echo "المرحلة 4: إنشاء الجداول..."
npx prisma db push --accept-data-loss

echo "✅ تم إنشاء جميع الجداول"
echo ""

# إنشاء البيانات التجريبية (بما في ذلك حساب المالك)
echo "المرحلة 5: إنشاء البيانات التجريبية..."
npm run db:seed

echo "✅ تم إنشاء البيانات التجريبية"
echo ""

# إنشاء حساب المالك (للتأكد)
echo "المرحلة 6: التحقق من حساب المالك..."
npx tsx scripts/create-owner.ts

echo ""
echo "=========================================="
echo "✅ إعداد قاعدة البيانات مكتمل!"
echo "=========================================="
echo ""
echo "🔐 حساب المالك:"
echo "   Email: oomraraq0@gmail.com"
echo "   Password: AAaa4321"
echo ""
echo "🚀 الخطوة التالية:"
echo "   1. اذهب إلى: http://localhost:3000/login/admin"
echo "   2. سجل دخول بحساب المالك"
echo "   3. استمتع بالمنصة!"
echo ""
