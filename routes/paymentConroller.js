const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment'); // Assuming your model is in a 'models' directory

// POST endpoint to create a student's monthly payment
router.post('/create', async (req, res) => {
  try {
    const {
      student,
      month,
      year,
      amount,
      paid,
      discount,
      paymentMethod,
      receivedBy,
      paymentDate,
      transactionID,
      remarks,
    } = req.body;

    const newPayment = new Payment({
      student,
      month,
      year,
      amount,
      paid,
      discount,
      paymentMethod,
      receivedBy,
      paymentDate,
      transactionID,
      remarks,
    });

    await newPayment.save();
    res.status(201).json({ message: 'Payment created successfully', payment: newPayment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create payment', error: error.message });
  }
});

module.exports = router;
