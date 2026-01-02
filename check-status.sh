#!/bin/bash
echo "=== فحص حالة المشروع ==="
echo ""
echo "1. Git Status:"
git status --short | head -10
echo ""
echo "2. Git Remote:"
git remote -v
echo ""
echo "3. Last Commit:"
git log --oneline -1
echo ""
echo "4. GitHub Repository Check:"
curl -s https://api.github.com/repos/amor1r/ics-platform 2>&1 | grep -E "(full_name|default_branch|size|pushed_at|message)" | head -6
echo ""
echo "5. Local Files:"
ls -la | grep -E "(package.json|vercel.json|\.git)" | head -5
