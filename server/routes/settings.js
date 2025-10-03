const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// الحصول على الإعدادات
router.get('/', async (req, res) => {
    try {
        const settings = await Settings.findOne();
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// تحديث الإعدادات
router.put('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (settings) {
            settings = await Settings.findOneAndUpdate({}, req.body, { new: true });
        } else {
            settings = new Settings(req.body);
            await settings.save();
        }
        res.json(settings);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// التحقق من كلمة المرور
router.post('/verify-password', async (req, res) => {
    try {
        const settings = await Settings.findOne();
        if (!settings) {
            return res.status(404).json({ message: 'الإعدادات غير موجودة' });
        }
        
        const isValid = req.body.password === settings.password;
        res.json({ isValid });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;