const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    nationalId: { type: String, required: true, unique: true },
    phone: String,
    parentPhone: String,
    grade: { type: Number, required: true },
    class: { type: Number, required: true },
    birthDate: String,
    gender: String,
    status: { type: String, default: 'active' },
    notes: String,
    grades: {
        semester1: {
            arabic: Number,
            math: Number,
            science: Number,
            english: Number,
            social: Number
        },
        semester2: {
            arabic: Number,
            math: Number,
            science: Number,
            english: Number,
            social: Number
        }
    }
});

module.exports = mongoose.model('Student', studentSchema);