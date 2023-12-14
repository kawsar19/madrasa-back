const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const axios = require('axios');
const OTP = require('../models/Otp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middlewares/authCheck'); // Import your middleware



router.post('/create', async (req, res) => {
  try {
    const { name, phone, village, upazila, district, division,union, emergencyPhoneNumber, madrasa, nidImage, password } = req.body;

    // Extracting the uploaded file from the reques
    

    // Upload image to Cloudinary
    const hashedPassword = await bcrypt.hash(password, 10);


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
      password:hashedPassword
    });

    await teacher.save();
    res.status(201).json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Check if the teacher exists
    const teacher = await Teacher.findOne({ phone });

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, teacher.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token excluding sensitive data like password
    const token = jwt.sign(
      {
        _id: teacher._id,
        name: teacher.name,
        phone: teacher.phone,
        village: teacher.village,
        upazila: teacher.upazila,
        district: teacher.district,
        division: teacher.division,
        madrasa: teacher.madrasa,
        // Add other data you want to include in the token payload
      },
    
   //  process.env.JWT_SECRET_KEY, // Use your own secret key getTime'
   '12345',
      { expiresIn: '365d' } // Token expiration time
    );

    res.json({ token, user: {
  _id: teacher._id,
  name: teacher.name,
  phone: teacher.phone,
  village: teacher.village,
  upazila: teacher.upazila,
  district: teacher.district,
  division: teacher.division,
  madrasa: teacher.madrasa
}});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/checkToken', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Token is valid', user: req.user });
});
// Endpoint to send OTP for teacher login
router.post("/teacher-login-otp", async (req, res) => {
  const { phone } = req.body;
  try {
    // Generate and send an OTP to the teacher
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expirationTime = new Date().getTime() + (2 * 60 * 1000); // 2 minutes

    let existingOTP = await OTP.findOne({ phone });

    if (existingOTP) {
      // Update the existing OTP with the new values
      existingOTP.otp = otp;
      existingOTP.expiresAt = expirationTime;
      await existingOTP.save();
    } else {
      // Create a new OTP document
      existingOTP = new OTP({
        phone,
        otp,
        expiresAt: expirationTime,
      });
      await existingOTP.save();
    }

    const user = process.env.SMS_API_USER;
    const password = process.env.SMS_API_PASSWORD;
    const smsApiUrl = `https://aamarsms.com/otp?user=${user}&password=${password}&to=${phone}&text=Hi! Your OTP for teacher login is ${otp}. This OTP is valid for the next 2 minutes. Do not share this code with anyone.`;

    // Make the API request to send the OTP via SMS
    const response = await axios.get(smsApiUrl);

    // Check the response from the SMS service provider API
    if (response.status !== 200) {
      throw new Error("Failed to send OTP via SMS");
    }

    return res.status(200).json({ message: "OTP sent successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
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
