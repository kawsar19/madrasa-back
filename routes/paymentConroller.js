const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment'); // Assuming your model is in a 'models' directory
const Teacher = require('../models/Teacher'); // Assuming your model is in a 'models' directoryP
const Student = require('../models/Student');

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
router.get('/list', async (req, res) => {
  try {
    let filter = {};
    const { month, year } = req.query;

    if (month) {
      filter.month = month; // Assuming month is a string, adjust as needed
    }

    if (year) {
      filter.year = year; // Assuming year is a number, adjust as needed
    }

    const payments = await Payment.find(filter).populate('student', 'fullName'); // Populate student field with name
    res.status(200).json({ payments });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payments', error: error.message });
  }
});


router.get('/list-month-year', async (req, res) => {
  try {
    const { month, year } = req.query;
    console.log('Received month:', month);
    console.log('Received year:', year);

    let query = {};
    if (month && year) {
      query = { month: { $regex: new RegExp(month, 'i') }, year };
    } else if (month) {
      query = { month: { $regex: new RegExp(month, 'i') } };
    } else if (year) {
      query = { year };
    }

    const payments = await Payment.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'students', // Assuming the name of your student collection
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      {
        $lookup: {
          from: 'teachers', // Assuming the name of your teacher collection
          localField: 'teacher',
          foreignField: '_id',
          as: 'teacherInfo'
        }
      },
      {
        $addFields: {
          studentName: { $arrayElemAt: ['$studentInfo.name', 0] },
          teacherName: { $arrayElemAt: ['$teacherInfo.name', 0] }
        }
      },
      {
        $project: {
          studentInfo: 0, // Exclude unnecessary fields from output
          teacherInfo: 0
        }
      }
    ]);
    console.log('Payments:', payments);

    let message = 'Payments';
    if (month && year) {
      message += ` for ${month} ${year}`;
    } else if (month) {
      message += ` for ${month}`;
    } else if (year) {
      message += ` for ${year}`;
    }

    res.status(200).json({ message, payments });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payments', error: error.message });
  }
});

module.exports = router;
