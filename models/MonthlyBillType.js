const mongoose = require('mongoose');

const monthlyBillTypeSchema = new mongoose.Schema({
  typeName: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  madrasa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Madrasa',
    required: true,
  },
});

const MonthlyBillType = mongoose.model('MonthlyBillType', monthlyBillTypeSchema);

module.exports = MonthlyBillType;