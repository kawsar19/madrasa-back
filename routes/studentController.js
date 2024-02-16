const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { createStudentSchema, createPaymentSchema} = require('../helper/validation');

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
    /*
    await Student.updateMany(
      query,
      { $set: { monthlyFee: 0 } }
    );
*/
    const students = await Student.find(query)
  .populate('studentClass', 'className')
  .populate({
    path: 'payments.receivedBy',
    select: 'name',
    model: 'Teacher' // Assuming 'Teacher' is the name of the model for teachers
  })
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

router.post('/set-monthly-fee/:id', authenticateToken, async (req, res) => {
   const { id } = req.params;
   const { monthlyFee } = req.body;

   try {
     console.log(req.user)
      if (!req.user) {
         return res.status(401).json({ error: 'Unauthorized' });
      }

      const student = await Student.findById(id);

      if (!student) {
         return res.status(404).json({ error: 'Student not found' });
      }

      student.monthlyFee = monthlyFee;
      await student.save();

      res.status(200).json({ message: 'Monthly fee updated successfully', student });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
});
router.post('/create-payment/:studentId', authenticateToken, async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    console.log(req.body)
    /*
    // Validate the request body
    const validationResult = createPaymentSchema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }*/

    // Extract relevant data from the request body
    const { month, year, amount, paid, discount, paymentMethod, receivedBy, paymentDate, transactionID, remarks } = req.body;
    const { studentId } = req.params; // Extract studentId from req.params

    // Check if the student exists
    const existingStudent = await Student.findById(studentId);
    if (!existingStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Create the payment object
    const payment = {
      month,
      year,
      amount,
      paid,
      discount,
      paymentMethod,
      receivedBy, // Assuming receivedBy is the teacher's ID
      paymentDate,
      transactionID,
      remarks
    };

    // Add the payment to the student's payments array
    existingStudent.payments.push(payment);

    // Save the updated student document
    await existingStudent.save();

    // Respond with success message and the created payment
    res.status(201).json({ message: 'Payment created successfully', payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})


module.exports = router;
