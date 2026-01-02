#!/bin/bash
# سكريبت فحص جميع الصفحات

BASE_URL="http://localhost:3000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

test_page() {
    local url=$1
    local name=$2
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" = "200" ] || [ "$response" = "302" ] || [ "$response" = "307" ]; then
        print_success "$name - $url (HTTP $response)"
        return 0
    else
        print_error "$name - $url (HTTP $response)"
        return 1
    fi
}

echo "=========================================="
echo "فحص جميع الصفحات - منصة ICS"
echo "=========================================="
echo ""

# الصفحات العامة
echo "📄 الصفحات العامة:"
test_page "$BASE_URL" "الصفحة الرئيسية"
test_page "$BASE_URL/about" "صفحة من نحن"
test_page "$BASE_URL/login" "صفحة تسجيل الدخول"
test_page "$BASE_URL/login/admin" "تسجيل دخول المدراء"
test_page "$BASE_URL/login/member" "تسجيل دخول الأعضاء"
test_page "$BASE_URL/register" "صفحة التسجيل"
test_page "$BASE_URL/search" "صفحة البحث"

echo ""
echo "=========================================="
echo "✅ فحص الصفحات العامة مكتمل"
echo "=========================================="

