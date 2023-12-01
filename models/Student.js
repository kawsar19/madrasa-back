const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  studentClass: {
    type: String,
    required: true,
  },
studentImage:{
    type: String,
    required: false,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    village: String,
    upazila: String,
    district: String,
    division: String,
    union: String,
  },
  guardian: {
    fullName: String,
    phoneNumber: String,
  },
  madrasa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Madrasa',
  }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
