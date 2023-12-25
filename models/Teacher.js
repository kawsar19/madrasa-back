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
  union:String,
  nidImage: String,
  emergencyPhoneNumber: String,
  password: {
    type: String,
    default: '111111',
    required: true,
  },
  madrasaName:{
    type:String,
    required:true
  },
  madrasa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Madrasa',
  },
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
