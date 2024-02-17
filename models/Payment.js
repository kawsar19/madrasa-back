const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Reference to the Student schema/table
        required: true,
    },
    madrasa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Madrasa', // Reference to the Madrasa schema/table
        required: true,
    },
    month: {
        type: String,
        enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        required: true,
    },
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
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;