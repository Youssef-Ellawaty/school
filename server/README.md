# نظام إدارة شؤون الطلاب - السيرفر

## كيفية تحديث الكود من الموقع

1. قم بإنشاء حساب على [GitHub](https://github.com)
2. قم بإنشاء مستودع (repository) جديد
3. ارفع الكود إلى GitHub باستخدام الأوامر التالية:
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

4. في لوحة تحكم Vercel:
   - اربط المشروع بمستودع GitHub
   - فعّل خيار "Auto Deploy" للتحديث التلقائي

## كيفية التحديث
1. قم بتعديل الملفات مباشرة من GitHub
2. اضغط على Commit changes
3. سيقوم Vercel تلقائياً بإعادة نشر الموقع بالتحديثات الجديدة

## الملفات الرئيسية للتعديل
- `routes/*.js` - مسارات API
- `models/*.js` - نماذج البيانات
- `server.js` - إعدادات السيرفر الرئيسية