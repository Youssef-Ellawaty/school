const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { students, grades, attendance } = require('./data');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// نقاط نهاية API للطلاب
app.get('/api/students', (req, res) => {
    res.json(students.getAllStudents());
});

app.get('/api/students/:name', (req, res) => {
    const student = students.getStudentByName(req.params.name);
    if (student) {
        res.json(student);
    } else {
        res.status(404).json({ error: 'الطالب غير موجود' });
    }
});

app.post('/api/students', (req, res) => {
    if (students.addStudent(req.body)) {
        res.json({ message: 'تم إضافة الطالب بنجاح' });
    } else {
        res.status(500).json({ error: 'حدث خطأ أثناء إضافة الطالب' });
    }
});

app.put('/api/students/:name', (req, res) => {
    if (students.updateStudent(req.params.name, req.body)) {
        res.json({ message: 'تم تحديث بيانات الطالب بنجاح' });
    } else {
        res.status(500).json({ error: 'حدث خطأ أثناء تحديث بيانات الطالب' });
    }
});

app.delete('/api/students/:name', (req, res) => {
    if (students.deleteStudent(req.params.name)) {
        res.json({ message: 'تم حذف الطالب بنجاح' });
    } else {
        res.status(500).json({ error: 'حدث خطأ أثناء حذف الطالب' });
    }
});

// نقاط نهاية API للدرجات
app.get('/api/grades', (req, res) => {
    res.json(grades.getAllGrades());
});

app.get('/api/grades/:studentName', (req, res) => {
    const studentGrades = grades.getStudentGrades(req.params.studentName);
    if (studentGrades) {
        res.json(studentGrades);
    } else {
        res.status(404).json({ error: 'لا توجد درجات لهذا الطالب' });
    }
});

app.post('/api/grades/:studentName', (req, res) => {
    const { semester, subject, value } = req.body;
    if (grades.updateGrade(req.params.studentName, semester, subject, value)) {
        res.json({ message: 'تم تحديث الدرجة بنجاح' });
    } else {
        res.status(500).json({ error: 'حدث خطأ أثناء تحديث الدرجة' });
    }
});

// نقاط نهاية API للحضور والغياب
app.get('/api/attendance', (req, res) => {
    res.json(attendance.getAllAttendance());
});

app.get('/api/attendance/academic-year/:year', (req, res) => {
    const yearAttendance = attendance.getAttendanceByAcademicYear(req.params.year);
    res.json(yearAttendance);
});

app.get('/api/attendance/:date', (req, res) => {
    const dateAttendance = attendance.getAttendanceByDate(req.params.date);
    if (dateAttendance) {
        res.json(dateAttendance);
    } else {
        res.status(404).json({ error: 'لا توجد سجلات حضور لهذا التاريخ' });
    }
});

app.post('/api/attendance', (req, res) => {
    const { date, studentName, status } = req.body;
    if (attendance.updateAttendance(date, studentName, status)) {
        res.json({ message: 'تم تحديث سجل الحضور بنجاح' });
    } else {
        res.status(500).json({ error: 'حدث خطأ أثناء تحديث سجل الحضور' });
    }
});

// تشغيل الخادم
app.listen(port, () => {
    console.log(`الخادم يعمل على المنفذ ${port}`);
});