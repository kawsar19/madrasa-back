const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');

// Create Teacher
router.post('/create', async (req, res) => {
  try {
    const { name, phone, village, upazila, district, division, nidImage, emergencyPhoneNumber, madrasa } = req.body;

    const teacher = new Teacher({
      name,
      phone,
      village,
      upazila,
      district,
      division,
      nidImage,
      emergencyPhoneNumber,
      madrasa,
    });

    await teacher.save();
    res.status(201).json(teacher);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      // MongoDB duplicate key error
      return res.status(400).json({ error: 'Phone number must be unique' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get list of Teachers
router.get('/list', async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('madrasa');
    res.json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update Teacher
router.put('/update/:id', async (req, res) => {
  try {
    const teacherId = req.params.id;
    const { name, village, upazila, district, division, nidImage, emergencyPhoneNumber, madrasa } = req.body;

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      {
        name,
        village,
        upazila,
        district,
        division,
        nidImage,
        emergencyPhoneNumber,
        madrasa,
      },
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.json(updatedTeacher);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      // MongoDB duplicate key error
      return res.status(400).json({ error: 'Phone number must be unique' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete Teacher
router.delete('/delete/:id', async (req, res) => {
  try {
    const teacherId = req.params.id;
    const teacher = await Teacher.findByIdAndDelete(teacherId);

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
