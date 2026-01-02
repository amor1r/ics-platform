# ⚡ حل سريع - رفع الموقع الآن

## 🎯 الطريقة الأسرع: Vercel CLI

### الخطوة 1: تثبيت Vercel CLI

```bash
cd "/home/kali/Desktop/New Folder"
npm install -g vercel
```

### الخطوة 2: رفع الموقع مباشرة

```bash
vercel --prod
```

**عندما يُطلب منك:**
- اضغط Enter للقيم الافتراضية
- سجل دخول بحساب Vercel (أو GitHub)

---

## ✅ بديل: إنشاء Personal Access Token

### 1. اذهب إلى:
https://github.com/settings/tokens/new

### 2. املأ:
- **Note**: `ICS Deploy`
- **Expiration**: `90 days`
- **Scopes**: ✅ `repo`

### 3. اضغط "Generate token"

### 4. انسخ Token واستخدمه:

```bash
cd "/home/kali/Desktop/New Folder"
git remote set-url origin https://amor1r:YOUR_TOKEN@github.com/amor1r/ics-platform.git
git push -u origin main
```

---

**أي طريقة تفضل؟** 🚀

