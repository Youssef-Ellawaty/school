const fs = require('fs-extra');
const path = require('path');

// مسارات ملفات البيانات
const STUDENTS_FILE = path.join(__dirname, 'data', 'students.json');
const GRADES_FILE = path.join(__dirname, 'data', 'grades.json');
const ATTENDANCE_FILE = path.join(__dirname, 'data', 'attendance.json');

// التأكد من وجود مجلد البيانات
fs.ensureDirSync(path.join(__dirname, 'data'));

// التأكد من وجود الملفات
fs.ensureFileSync(STUDENTS_FILE);
fs.ensureFileSync(GRADES_FILE);
fs.ensureFileSync(ATTENDANCE_FILE);

// قراءة البيانات من الملفات
function readData(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error(`خطأ في قراءة الملف: ${filePath}`, error);
        return [];
    }
}

// حفظ البيانات في الملفات
function writeData(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`خطأ في حفظ الملف: ${filePath}`, error);
        return false;
    }
}

// وظائف إدارة الطلاب
const studentsFunctions = {
    getAllStudents() {
        return readData(STUDENTS_FILE);
    },

    getStudentByName(name) {
        const students = this.getAllStudents();
        return students.find(student => student.name === name);
    },

    addStudent(studentData) {
        const students = this.getAllStudents();
        students.push(studentData);
        return writeData(STUDENTS_FILE, students);
    },

    updateStudent(name, updatedData) {
        const students = this.getAllStudents();
        const index = students.findIndex(student => student.name === name);
        if (index !== -1) {
            const oldGrade = students[index].grade;
            const newGrade = updatedData.grade;
            
            // إذا تم تغيير الصف، نقوم بحذف الدرجات القديمة
            if (newGrade && newGrade !== oldGrade) {
                gradesFunctions.deleteOldGrades(name);
            }
            
            students[index] = { ...students[index], ...updatedData };
            return writeData(STUDENTS_FILE, students);
        }
        return false;
    },

    deleteStudent(name) {
        const students = this.getAllStudents();
        const filteredStudents = students.filter(student => student.name !== name);
        return writeData(STUDENTS_FILE, filteredStudents);
    }
};

// وظائف إدارة الدرجات
const gradesFunctions = {
    getAllGrades() {
        return readData(GRADES_FILE);
    },

    getCurrentAcademicYear() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        // العام الدراسي يبدأ من سبتمبر
        return month >= 9 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
    },

    getStudentGrades(studentName) {
        const grades = this.getAllGrades();
        const student = studentsFunctions.getStudentByName(studentName);
        if (!student) return null;

        const academicYear = this.getCurrentAcademicYear();
        return grades.find(grade => 
            grade.studentName === studentName && 
            grade.academicYear === academicYear &&
            grade.studentGrade === student.grade
        );
    },

    updateGrade(studentName, semester, subject, value) {
        const grades = this.getAllGrades();
        const student = studentsFunctions.getStudentByName(studentName);
        if (!student) return false;

        const academicYear = this.getCurrentAcademicYear();
        const studentGrades = grades.find(grade => 
            grade.studentName === studentName && 
            grade.academicYear === academicYear &&
            grade.studentGrade === student.grade
        );
        
        if (studentGrades) {
            if (!studentGrades[semester]) {
                studentGrades[semester] = {};
            }
            studentGrades[semester][subject] = value;
            return writeData(GRADES_FILE, grades);
        } else {
            const newGrade = {
                studentName,
                studentGrade: student.grade,
                academicYear,
                [semester]: {
                    [subject]: value
                }
            };
            grades.push(newGrade);
            return writeData(GRADES_FILE, grades);
        }
    },

    // وظيفة جديدة لحذف درجات العام السابق عند الترقية
    deleteOldGrades(studentName) {
        const grades = this.getAllGrades();
        const filteredGrades = grades.filter(grade => grade.studentName !== studentName);
        return writeData(GRADES_FILE, filteredGrades);
    }
};

// وظائف إدارة الحضور والغياب
const attendanceFunctions = {
    getAllAttendance() {
        return readData(ATTENDANCE_FILE);
    },

    getAttendanceByDate(date) {
        const attendance = this.getAllAttendance();
        return attendance.find(record => record.academicYear === this.getCurrentAcademicYear() && record.date === date);
    },

    getCurrentAcademicYear() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        // العام الدراسي يبدأ من سبتمبر
        return month >= 9 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
    },

    updateAttendance(date, studentName, status) {
        const attendance = this.getAllAttendance();
        const academicYear = this.getCurrentAcademicYear();
        const dateRecord = attendance.find(record => 
            record.academicYear === academicYear && record.date === date
        );
        
        if (dateRecord) {
            dateRecord.records[studentName] = status;
            return writeData(ATTENDANCE_FILE, attendance);
        } else {
            attendance.push({
                academicYear,
                date,
                records: {
                    [studentName]: status
                }
            });
            return writeData(ATTENDANCE_FILE, attendance);
        }
    },

    // وظيفة جديدة لجلب سجلات العام الدراسي
    getAttendanceByAcademicYear(academicYear) {
        const attendance = this.getAllAttendance();
        return attendance.filter(record => record.academicYear === academicYear);
    }
};

module.exports = {
    students: studentsFunctions,
    grades: gradesFunctions,
    attendance: attendanceFunctions
};