// تهيئة البيانات في localStorage
function initializeStorage() {
    if (!localStorage.getItem('students')) {
        localStorage.setItem('students', JSON.stringify([]));
    }
    if (!localStorage.getItem('attendance')) {
        localStorage.setItem('attendance', JSON.stringify([]));
    }
    if (!localStorage.getItem('settings')) {
        localStorage.setItem('settings', JSON.stringify({}));
    }
}

// حفظ الطلاب
function saveStudents(students) {
    localStorage.setItem('students', JSON.stringify(students));
}

// استرجاع الطلاب
function getStudents() {
    return JSON.parse(localStorage.getItem('students') || '[]');
}

// حفظ الحضور
function saveAttendance(attendance) {
    localStorage.setItem('attendance', JSON.stringify(attendance));
}

// استرجاع الحضور
function getAttendance() {
    return JSON.parse(localStorage.getItem('attendance') || '[]');
}

// حفظ الإعدادات
function saveSettings(settings) {
    localStorage.setItem('settings', JSON.stringify(settings));
}

// استرجاع الإعدادات
function getSettings() {
    return JSON.parse(localStorage.getItem('settings') || '{}');
}

// تصدير البيانات
function exportData() {
    try {
        const data = {
            students: getStudents(),
            attendance: getAttendance(),
            settings: getSettings()
        };
        const dataStr = JSON.stringify(data);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'student-data-backup.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('تم تصدير البيانات بنجاح', 'success');
    } catch (error) {
        console.error('خطأ في تصدير البيانات:', error);
        showToast('حدث خطأ أثناء تصدير البيانات', 'error');
    }
}

// استيراد البيانات
function importData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (data.students) saveStudents(data.students);
                if (data.attendance) saveAttendance(data.attendance);
                if (data.settings) saveSettings(data.settings);
                resolve();
            } catch (error) {
                console.error('خطأ في استيراد البيانات:', error);
                reject(error);
            }
        };
        reader.readAsText(file);
    });
}

// تنظيف البيانات
function clearAllData() {
    localStorage.removeItem('students');
    localStorage.removeItem('attendance');
    localStorage.removeItem('settings');
    initializeStorage();
}

// تهيئة البيانات عند تحميل الصفحة
initializeStorage();