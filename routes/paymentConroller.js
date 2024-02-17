const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment'); // Assuming your model is in a 'models' directory
const authenticateToken = require("../middlewares/authCheck");
const Teacher = require('../models/Teacher'); // Assuming your model is in a 'models' directoryP
const Student = require('../models/Student');

// POST endpoint to create a student's monthly payment


router.post('/create/:studentid', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.log(req.user)
    const { madrasa, _id } = req.user;
    const studentId = req.params.studentid;
    const {
      month,
      year,
      amount,
      paid,
      discount,
      paymentMethod,
      paymentDate,
      transactionID,
      remarks,
    } = req.body;

    const newPayment = new Payment({
      student: studentId,
      madrasa,
      month,
      year,
      amount,
      paid,
      discount,
      paymentMethod,
      receivedBy:_id,
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
router.get('/:studentid/payments', async (req, res) => {
  try {
    const studentId = req.params.studentid;
    
    // Assuming Payment model is imported and available
    const payments = await Payment.find({ student: studentId });

    res.status(200).json({ payments });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve payments', error: error.message });
  }
});
router.get('/single-payment', async (req, res) => {
  try {
    const { phoneNumber } = req.query;
    
    // Find the student document based on the phone number and populate additional info
    const student = await Student.findOne({ phone: phoneNumber })
      .populate({
        path: 'studentClass',
        select: 'className'
      })
      .select('_id fullName studentClass')
      .lean();
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get the student ID and class name
    const studentId = student._id;
    const className = student.studentClass.className;
    
    // Find payments associated with the student ID and populate receivedBy field
    const payments = await Payment.find({ student: studentId })
      .populate({
        path: 'receivedBy',
        select: 'name'
      })
      .lean();
    
    // Replace studentClass ID with className for each payment
    payments.forEach(payment => {
      payment.studentClass = className;
    });
    
    res.status(200).json({ student, payments });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve payments', error: error.message });
  }
});
/*
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
*/
router.get('/madrasa-payments/:month/:year', authenticateToken, async (req, res) => {
  try {
    const { month, year } = req.params;
    const madrasaId = req.user.madrasa;

    // Find all payments of the madrasa for the given month and year
    const payments = await Payment.find({ madrasa: madrasaId, month, year })
      .populate('student', 'fullName phone')
      .lean();
    
    // Group payments by student
    const paymentsByStudent = {};
    payments.forEach(payment => {
      if (!paymentsByStudent[payment.student._id]) {
        paymentsByStudent[payment.student._id] = [];
      }
      paymentsByStudent[payment.student._id].push(payment);
    });
    
    res.status(200).json({ paymentsByStudent });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve payments', error: error.message });
  }
});

module.exports = router;
