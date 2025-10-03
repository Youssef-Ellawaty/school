const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// الإعدادات الأساسية
app.use(cors());
app.use(express.json());

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student-management', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', (error) => console.error('خطأ في الاتصال بقاعدة البيانات:', error));
db.once('open', () => console.log('تم الاتصال بقاعدة البيانات بنجاح'));

// استيراد المسارات
const studentsRouter = require('./routes/students');
const attendanceRouter = require('./routes/attendance');
const settingsRouter = require('./routes/settings');

// استخدام المسارات
app.use('/api/students', studentsRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/settings', settingsRouter);

// معالجة الأخطاء
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'حدث خطأ في السيرفر' });
});

// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`السيرفر يعمل على المنفذ ${PORT}`);
});