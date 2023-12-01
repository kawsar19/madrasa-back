const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  month: {
  type: String,
  enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  required: true,
},

  year: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  discount: {
    type: Number,
    default: 0,
  },
  paymentMethod: {
    type: String,
    enum: ['bkash', 'nogod', 'cash', /* ... other methods */],
    required: true,
  },
  receivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  paymentDate: {
    type: Date,
  },
  transactionID: {
    type: String,
  },
  remarks: {
    type: String,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
