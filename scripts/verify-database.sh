#!/bin/bash

# سكريبت فحص شامل لقاعدة البيانات

set -e

# الألوان
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

DB_NAME="ics_platform"
DB_USER="ics_user"
DB_PASSWORD="ics_password"

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "ℹ️  $1"
}

# التحقق من الاتصال
print_header "فحص الاتصال بقاعدة البيانات"
if PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -h localhost -c "SELECT 1;" > /dev/null 2>&1; then
    print_success "الاتصال ناجح"
else
    print_error "فشل الاتصال"
    exit 1
fi

# فحص الجداول
print_header "فحص الجداول"
EXPECTED_TABLES=("users" "projects" "project_likes" "project_files" "activity_logs" "admin_invites" "sessions" "password_resets" "categories" "content" "files" "ctf_challenges" "ctf_submissions" "tools" "comments" "bookmarks" "user_progress" "notifications")

MISSING_TABLES=()
for table in "${EXPECTED_TABLES[@]}"; do
    if PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -h localhost -t -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '$table');" | grep -q t; then
        print_success "جدول $table موجود"
    else
        print_error "جدول $table مفقود"
        MISSING_TABLES+=("$table")
    fi
done

if [ ${#MISSING_TABLES[@]} -eq 0 ]; then
    print_success "جميع الجداول موجودة (${#EXPECTED_TABLES[@]} جدول)"
else
    print_error "جداول مفقودة: ${MISSING_TABLES[*]}"
fi

# فحص Indexes
print_header "فحص Indexes"
INDEX_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -h localhost -t -c "SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public';" | tr -d ' ')
print_info "عدد Indexes: $INDEX_COUNT"

# فحص Foreign Keys
print_header "فحص Foreign Keys"
FK_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -h localhost -t -c "SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public';" | tr -d ' ')
print_info "عدد Foreign Keys: $FK_COUNT"

# فحص البيانات
print_header "فحص البيانات"
USER_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -h localhost -t -c "SELECT COUNT(*) FROM users;" | tr -d ' ')
print_info "عدد المستخدمين: $USER_COUNT"

if [ "$USER_COUNT" -ge 2 ]; then
    print_success "يوجد مستخدمين كافيين"
    echo ""
    echo "المستخدمين:"
    PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -h localhost -c "SELECT email, username, role, is_banned FROM users;"
else
    print_error "عدد المستخدمين غير كافي"
fi

# فحص الأداء
print_header "فحص الأداء"
echo "فحص حجم قاعدة البيانات..."
DB_SIZE=$(PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -h localhost -t -c "SELECT pg_size_pretty(pg_database_size('$DB_NAME'));" | tr -d ' ')
print_info "حجم قاعدة البيانات: $DB_SIZE"

# ملخص
print_header "ملخص الفحص"
echo "✅ الجداول: ${#EXPECTED_TABLES[@]}"
echo "✅ Indexes: $INDEX_COUNT"
echo "✅ Foreign Keys: $FK_COUNT"
echo "✅ المستخدمين: $USER_COUNT"
echo "✅ حجم قاعدة البيانات: $DB_SIZE"

