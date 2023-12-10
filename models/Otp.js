const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Set an expiration time for the OTP (e.g., 5 minutes)
  },
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
