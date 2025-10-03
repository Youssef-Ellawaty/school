const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// الحصول على سجل الحضور لتاريخ معين
router.get('/', async (req, res) => {
    try {
        const { date } = req.query;
        const attendance = await Attendance.find({ date: new Date(date) })
            .populate('studentId', 'name grade class');
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// تسجيل الحضور لطالب
router.post('/', async (req, res) => {
    try {
        const { studentId, date, status } = req.body;
        let attendance = await Attendance.findOne({ studentId, date });
        
        if (attendance) {
            attendance.status = status;
            attendance = await attendance.save();
        } else {
            attendance = new Attendance({ studentId, date, status });
            attendance = await attendance.save();
        }
        
        res.status(201).json(attendance);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// تحديث حضور مجموعة من الطلاب
router.post('/bulk', async (req, res) => {
    try {
        const { date, records } = req.body;
        const operations = records.map(record => ({
            updateOne: {
                filter: { studentId: record.studentId, date },
                update: { $set: { status: record.status } },
                upsert: true
            }
        }));

        await Attendance.bulkWrite(operations);
        res.json({ message: 'تم تحديث سجلات الحضور بنجاح' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// الحصول على إحصائيات الحضور لفترة معينة
router.get('/stats', async (req, res) => {
    try {
        const { startDate, endDate, studentId } = req.query;
        const stats = await Attendance.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    },
                    ...(studentId && { studentId: mongoose.Types.ObjectId(studentId) })
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;