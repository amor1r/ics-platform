#!/bin/bash
# سكريبت لرفع الكود إلى GitHub

cd "/home/kali/Desktop/New Folder"

echo "=========================================="
echo "🚀 رفع الكود إلى GitHub"
echo "=========================================="
echo ""

# التحقق من وجود remote
if git remote get-url origin 2>/dev/null; then
    echo "✅ Remote موجود بالفعل"
    git remote -v
else
    echo "⚠️  لا يوجد remote - سيتم إضافته بعد إنشاء repository على GitHub"
    echo ""
    echo "بعد إنشاء repository على GitHub، نفذ:"
    echo "  git remote add origin https://github.com/oomraraq0/ics-platform.git"
    echo "  git branch -M main"
    echo "  git push -u origin main"
fi

echo ""
echo "=========================================="

