#!/bin/bash
# سكريبت لاختبار تسجيل دخول المالك

echo "=========================================="
echo "اختبار تسجيل دخول حساب المالك"
echo "=========================================="
echo ""

# التحقق من قاعدة البيانات
echo "1. التحقق من قاعدة البيانات..."
if PGPASSWORD=ics_password psql -U ics_user -d ics_platform -h localhost -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ قاعدة البيانات متاحة"
else
    echo "❌ قاعدة البيانات غير متاحة"
    echo "   يرجى إعداد قاعدة البيانات أولاً (راجع MANUAL_DATABASE_SETUP.md)"
    exit 1
fi

# التحقق من حساب المالك
echo ""
echo "2. التحقق من حساب المالك..."
OWNER_EXISTS=$(PGPASSWORD=ics_password psql -U ics_user -d ics_platform -h localhost -t -c "SELECT COUNT(*) FROM users WHERE email = 'oomraraq0@gmail.com';" | tr -d ' ')

if [ "$OWNER_EXISTS" -gt 0 ]; then
    echo "✅ حساب المالك موجود"
    
    # عرض معلومات الحساب
    echo ""
    echo "معلومات الحساب:"
    PGPASSWORD=ics_password psql -U ics_user -d ics_platform -h localhost -c "SELECT email, username, role, is_banned, email_verified FROM users WHERE email = 'oomraraq0@gmail.com';"
    
    # التحقق من الدور
    ROLE=$(PGPASSWORD=ics_password psql -U ics_user -d ics_platform -h localhost -t -c "SELECT role FROM users WHERE email = 'oomraraq0@gmail.com';" | tr -d ' ')
    
    if [ "$ROLE" = "ADMIN" ]; then
        echo ""
        echo "✅ الدور: ADMIN (صحيح)"
    else
        echo ""
        echo "⚠️  الدور: $ROLE (يجب أن يكون ADMIN)"
        echo "   جاري تحديث الدور..."
        PGPASSWORD=ics_password psql -U ics_user -d ics_platform -h localhost -c "UPDATE users SET role = 'ADMIN' WHERE email = 'oomraraq0@gmail.com';"
        echo "✅ تم تحديث الدور إلى ADMIN"
    fi
else
    echo "❌ حساب المالك غير موجود"
    echo "   جاري إنشاء الحساب..."
    cd "/home/kali/Desktop/New Folder"
    npx tsx scripts/create-owner.ts
fi

echo ""
echo "=========================================="
echo "✅ الفحص مكتمل!"
echo "=========================================="
echo ""
echo "🔐 بيانات تسجيل الدخول:"
echo "   Email: oomraraq0@gmail.com"
echo "   Password: AAaa4321"
echo ""
echo "🚀 الخطوة التالية:"
echo "   1. اذهب إلى: http://localhost:3000/login/admin"
echo "   2. سجل دخول بحساب المالك"
echo "   3. استمتع بالمنصة!"
echo ""
