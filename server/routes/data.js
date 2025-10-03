const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// مسار ملف البيانات
const dataFilePath = path.join(__dirname, '../data/school_data.json');

// الحصول على البيانات
router.get('/', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: 'خطأ في قراءة البيانات' });
    }
});

// تحديث البيانات
router.post('/', (req, res) => {
    try {
        const data = JSON.stringify(req.body, null, 2);
        fs.writeFileSync(dataFilePath, data);
        res.json({ message: 'تم تحديث البيانات بنجاح' });
    } catch (err) {
        res.status(500).json({ message: 'خطأ في حفظ البيانات' });
    }
});

module.exports = router;