const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
      madrasa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Madrasa',
    },
    studentClass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClassName', // Reference to the Class schema/table
        required: true,
    },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late', 'Excused'],
    default: 'Present',
    required: true,
  },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
