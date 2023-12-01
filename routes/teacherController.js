const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');

router.post('/create', async (req, res) => {
  try {
    const { name, phone, village, upazila, district, division,union, emergencyPhoneNumber, madrasa, nidImage } = req.body;

    // Extracting the uploaded file from the reques
    

    // Upload image to Cloudinary
    

    const teacher = new Teacher({
      name,
      phone,
      village,
      upazila,
      district,
      division,
      nidImage,
      union,
      emergencyPhoneNumber,
      madrasa,
    });

    await teacher.save();
    res.status(201).json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update Teacher with Image Upload
router.put('/update/:id', async (req, res) => {
  try {
    const teacherId = req.params.id;
    const { name, village, upazila, district, division, emergencyPhoneNumber, madrasa } = req.body;

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Extracting the uploaded file from the request
    const { path } = req.file;

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(path);

    // Update teacher data including the Cloudinary URL
    teacher.name = name;
    teacher.village = village;
    teacher.upazila = upazila;
    teacher.district = district;
    teacher.division = division;
    teacher.nidImage = uploadResult.secure_url; // Save Cloudinary's secure URL to the teacher model
    teacher.emergencyPhoneNumber = emergencyPhoneNumber;
    teacher.madrasa = madrasa;

    await teacher.save();
    res.json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rest of your routes remain unchanged


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
