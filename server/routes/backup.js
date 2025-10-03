const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Settings = require('../models/Settings');

// تصدير جميع البيانات
router.get('/export', async (req, res) => {
    try {
        const students = await Student.find({});
        const attendance = await Attendance.find({});
        const settings = await Settings.findOne({});

        const backup = {
            students,
            attendance,
            settings,
            exportDate: new Date(),
            version: '1.0'
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=school_backup.json');
        res.json(backup);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// استيراد البيانات
router.post('/import', async (req, res) => {
    try {
        const backup = req.body;

        // التحقق من صحة البيانات
        if (!backup.students || !backup.attendance || !backup.settings) {
            return res.status(400).json({ message: 'ملف النسخ الاحتياطي غير صالح' });
        }

        // حذف البيانات القديمة
        await Student.deleteMany({});
        await Attendance.deleteMany({});
        await Settings.deleteMany({});

        // إضافة البيانات الجديدة
        await Student.insertMany(backup.students);
        await Attendance.insertMany(backup.attendance);
        if (backup.settings) {
            await Settings.create(backup.settings);
        }

        res.json({ message: 'تم استيراد البيانات بنجاح' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;