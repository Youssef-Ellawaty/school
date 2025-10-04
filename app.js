// وظائف إدارة البيانات في localStorage
const StorageManager = {
    // المفاتيح المستخدمة في التخزين
    keys: {
        STUDENTS: 'students',
        ATTENDANCE: 'attendance',
        SETTINGS: 'settings',
        GRADES: 'grades'
    },

    // تهيئة التخزين
    init() {
        if (!this.getStudents()) this.setStudents([]);
        if (!this.getAttendance()) this.setAttendance([]);
        if (!this.getSettings()) this.setSettings({});
        if (!this.getGrades()) this.setGrades({});
    },

    // وظائف الطلاب
    getStudents() {
        return JSON.parse(localStorage.getItem(this.keys.STUDENTS));
    },

    setStudents(students) {
        localStorage.setItem(this.keys.STUDENTS, JSON.stringify(students));
    },

    addStudent(student) {
        const students = this.getStudents();
        students.push(student);
        this.setStudents(students);
    },

    updateStudent(index, student) {
        const students = this.getStudents();
        students[index] = student;
        this.setStudents(students);
    },

    deleteStudent(index) {
        const students = this.getStudents();
        students.splice(index, 1);
        this.setStudents(students);
    },

    // وظائف الحضور
    getAttendance() {
        return JSON.parse(localStorage.getItem(this.keys.ATTENDANCE));
    },

    setAttendance(attendance) {
        localStorage.setItem(this.keys.ATTENDANCE, JSON.stringify(attendance));
    },

    // وظائف الدرجات
    getGrades() {
        return JSON.parse(localStorage.getItem(this.keys.GRADES));
    },

    setGrades(grades) {
        localStorage.setItem(this.keys.GRADES, JSON.stringify(grades));
    },

    // وظائف الإعدادات
    getSettings() {
        return JSON.parse(localStorage.getItem(this.keys.SETTINGS));
    },

    setSettings(settings) {
        localStorage.setItem(this.keys.SETTINGS, JSON.stringify(settings));
    },

    // تصدير جميع البيانات
    exportData() {
        const data = {
            students: this.getStudents(),
            attendance: this.getAttendance(),
            grades: this.getGrades(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `school-data-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // استيراد البيانات
    async importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    // التحقق من صحة البيانات
                    if (!data.students || !Array.isArray(data.students)) {
                        throw new Error('بيانات الطلاب غير صحيحة');
                    }

                    // حفظ البيانات
                    if (data.students) this.setStudents(data.students);
                    if (data.attendance) this.setAttendance(data.attendance);
                    if (data.grades) this.setGrades(data.grades);
                    if (data.settings) this.setSettings(data.settings);

                    resolve({
                        success: true,
                        message: 'تم استيراد البيانات بنجاح',
                        importDate: new Date().toISOString()
                    });
                } catch (error) {
                    reject({
                        success: false,
                        message: 'فشل استيراد البيانات',
                        error: error.message
                    });
                }
            };

            reader.onerror = () => {
                reject({
                    success: false,
                    message: 'فشل قراءة الملف',
                    error: reader.error
                });
            };

            reader.readAsText(file);
        });
    },

    // مسح جميع البيانات
    clearAllData() {
        localStorage.clear();
        this.init();
    }
};

// تهيئة التخزين عند تحميل الصفحة
StorageManager.init();