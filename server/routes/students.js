const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// الحصول على جميع الطلاب
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// إضافة طالب جديد
router.post('/', async (req, res) => {
    const student = new Student(req.body);
    try {
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// تحديث بيانات طالب
router.patch('/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// حذف طالب
router.delete('/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'تم حذف الطالب بنجاح' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// تحديث درجات طالب
router.patch('/:id/grades', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'الطالب غير موجود' });

        const { semester, subject, value } = req.body;
        if (!student.grades) student.grades = { semester1: {}, semester2: {} };
        if (!student.grades[semester]) student.grades[semester] = {};
        
        student.grades[semester][subject] = value;
        await student.save();
        
        res.json(student);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;