#!/bin/bash
# سكريبت لرفع الكود إلى GitHub مع المصادقة

cd "/home/kali/Desktop/New Folder"

echo "=========================================="
echo "🚀 رفع الكود إلى GitHub"
echo "=========================================="
echo ""

# إضافة remote إذا لم يكن موجوداً
if ! git remote get-url origin 2>/dev/null; then
    echo "إضافة remote..."
    git remote add origin https://github.com/amor1r/ics-platform.git
fi

# تغيير اسم الفرع إلى main
git branch -M main

echo ""
echo "الآن سيتم رفع الكود..."
echo "عندما يُطلب منك، أدخل:"
echo "  Username: amor1r"
echo "  Password: cc01xayA"
echo ""

# رفع الكود
git push -u origin main

echo ""
echo "=========================================="
if [ $? -eq 0 ]; then
    echo "✅ تم رفع الكود بنجاح!"
    echo "Repository: https://github.com/amor1r/ics-platform"
else
    echo "⚠️ حدث خطأ في الرفع"
    echo "جرب يدوياً:"
    echo "  git push -u origin main"
fi
echo "=========================================="

