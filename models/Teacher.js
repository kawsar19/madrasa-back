const mongoose = require('mongoose');
// Teacher Model
const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  village: String,
  upazila: String,
  district: String,
  division: String,
  nidImage: String,
  emergencyPhoneNumber: String,
  madrasa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Madrasa',
  },
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
