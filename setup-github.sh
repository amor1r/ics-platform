#!/bin/bash
# سكريبت لإعداد GitHub Repository

echo "=========================================="
echo "إعداد GitHub Repository - منصة ICS"
echo "=========================================="
echo ""

PROJECT_DIR="/home/kali/Desktop/New Folder"
cd "$PROJECT_DIR"

# التحقق من Git
if [ ! -d .git ]; then
    echo "تهيئة Git..."
    git init
    echo "✅ تم تهيئة Git"
else
    echo "✅ Git موجود بالفعل"
fi

# إضافة جميع الملفات
echo ""
echo "إضافة الملفات..."
git add .

# Commit
echo ""
echo "إنشاء commit..."
git commit -m "ICS Platform - Initial commit" 2>/dev/null || git commit -m "ICS Platform - Update"

echo ""
echo "=========================================="
echo "✅ تم إعداد Git Repository محلياً"
echo "=========================================="
echo ""
echo "الخطوات التالية:"
echo ""
echo "1. اذهب إلى: https://github.com/new"
echo "2. أنشئ repository جديد باسم: ics-platform"
echo "3. لا تضع README أو .gitignore (موجودان بالفعل)"
echo "4. ثم نفذ:"
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/ics-platform.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "5. بعد الرفع على GitHub، اذهب إلى: https://vercel.com"
echo "6. سجل دخول بحساب GitHub"
echo "7. اضغط 'Add New Project'"
echo "8. اختر repository الخاص بك"
echo "9. Vercel سيرفع الموقع تلقائياً!"
echo ""

