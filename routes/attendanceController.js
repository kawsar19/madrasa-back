const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const authenticateToken = require('../middlewares/authCheck');

// Your middleware or authentication checks could be added here if needed

router.post('/', async (req, res) => {
  const attendance = new Attendance({
    student: req.body.studentId,
    madrasa: req.body.madrasaId,
    studentClass: req.body.classId,
    date: req.body.date,
    status: req.body.status,
  });

  try {
    const newAttendance = await attendance.save();
    res.status(201).json(newAttendance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
