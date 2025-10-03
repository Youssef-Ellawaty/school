const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    academicStart: { type: Date, required: true },
    academicEnd: { type: Date, required: true },
    schoolName: { type: String, default: 'مدرسة الشهيد حمدي إبراهيم الإعدادية بنين' },
    password: { type: String, required: true }
});

module.exports = mongoose.model('Settings', settingsSchema);