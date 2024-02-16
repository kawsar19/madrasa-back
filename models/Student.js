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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClassName', // Reference to the Class schema/table
        required: true,
    },
    studentImage: {
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
    },
    monthlyFee: {
        type: Number,
        required: false, 
        default:0
    },
    payments: [
        {
            month: String,
            year: Number,
            amount: Number,
            paid: Boolean,
            discount: Number,
            paymentMethod: String,
            receivedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Teacher', // Reference to the Teacher model/schema
            },
            paymentDate: Date,
            transactionID: String,
            remarks: String,
        }
    ]
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
