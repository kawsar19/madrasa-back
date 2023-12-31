const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { createStudentSchema } = require('../helper/validation');

const authenticateToken = require('../middlewares/authCheck');

router.get('/checkToken', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Token is valid', user: req.user });
});
router.post('/create', authenticateToken, async (req, res) => {
  console.log(req.body)
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    const validationResult = createStudentSchema.validate(req.body);

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }

    const { phone } = req.body;

    // Check if a student with the same phone number already exists
    const existingStudent = await Student.findOne({ phone });

    if (existingStudent) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }

    const {
      fullName,
      dateOfBirth,
      gender,
      address,
      imageUrl,
      guardianFullName,
      guardianPhoneNumber,
      studentImage,
      studentClass,
    } = req.body;
    const {madrasa}=req.user

    const student = new Student({
      fullName,
      dateOfBirth,
      gender,
      phone,
      address,
      studentImage,
      guardian: {
        fullName: guardianFullName,
        phoneNumber: guardianPhoneNumber,
      },
      madrasa,
      studentClass,
    });

    await student.save();
    res.status(201).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/list', authenticateToken, async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 100;
  const searchTerm = req.query.q || '';
  const genderFilter = req.query.gender || '';
  const classNameFilter = req.query.className || ''; // New className filter parameter

  if (page < 1 || limit < 1) {
    return res.status(400).json({
      success: false,
      message: "Sorry, page and limit must be greater than 0."
    });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let query = { madrasa: req.user.madrasa };

    if (searchTerm) {
      query.fullName = { $regex: new RegExp(searchTerm, 'i') };
    }
    if (genderFilter && ['Male', 'Female', 'Other'].includes(genderFilter)) {
      query.gender = genderFilter;
    }
    if (classNameFilter) {
      query.studentClass = classNameFilter;
    }

    const totalStudents = await Student.countDocuments(query);
    const totalPages = Math.ceil(totalStudents / limit);

    const students = await Student.find(query)
      .populate('studentClass', 'className')
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      students,
      currentPage: page,
      totalPages,
      totalStudents
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/totalStudents', authenticateToken, async (req, res) => {
   try {
      if (!req.user) {
         return res.status(401).json({ error: 'Unauthorized' });
      }

      const query = { madrasa: req.user.madrasa }; // Filtering by the authenticated teacher's 'Madrasa'
      const totalStudents = await Student.countDocuments(query);

      res.status(200).json({ totalStudents });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
});



router.get('/list-test', async(req,res) =>{
   try{
      const students=Student.countDocuments();
      res.status(200).json({total:students})
   } catch(err){
      console.log(err)
   }
})

router.delete('/delete/:id', async (req, res) => {
   const { id } = req.params;

   try {
      const deletedStudent = await Student.findByIdAndDelete(id);

      if (!deletedStudent) {
         return res.status(404).json({ error: 'Student not found' });
      }

      res.status(200).json({ message: 'Student deleted successfully' });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
});



module.exports = router;
