const express = require('express');
const router = express.Router();
const Madrasa = require('../models/Madrasa');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');



const ClassName = require('../models/ClassName');
// Create Madrasa
router.post('/create', async (req, res) => {
  try {
    const { name, location, contactInformation, foundingDate, headTeacher, students, teachers, classes } = req.body;
    
    const madrasa = new Madrasa({
      name,
      location,
      contactInformation,
      foundingDate,
      headTeacher,
      students,
      teachers,
      classes,
    });

    await madrasa.save();
    res.status(201).json(madrasa);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get list of Madrasas with teacher count
router.get('/list', async (req, res) => {
  try {
    const madrasas = await Madrasa.aggregate([
      {
        $lookup: {
          from: "teachers",
          localField: "_id",
          foreignField: "madrasa",
          as: "teachers"
        }
      },
      {
        $lookup: {
          from: "classnames",
          localField: "_id",
          foreignField: "madrasa",
          as: "classnames"
        }
      },
      {
        $project: {
          name: 1,
          location: 1,
          teacherCount: { $size: "$teachers" },
          classCount: { $size: "$classnames" }
        }
      }
    ]);
    res.json(madrasas);
  // res.send("ok")
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/totalcount/:id', async (req, res) => {
  try {
    const madrasaId = req.params.id;

    const madrasa = await Madrasa.findById(madrasaId);

    if (!madrasa) {
      return res.status(404).json({ error: 'Madrasa not found' });
    }

    const teachersCount = await Teacher.countDocuments({ madrasa: madrasaId });
    const classesCount = await ClassName.countDocuments({ madrasa: madrasaId });
    const studentsCount = await Student.countDocuments({ madrasa: madrasaId });

    // Calculate the sum of all students' monthly fees
    




    // Extract the total monthly fee sum from the aggregation result


    res.json({
      madrasa,
      teachersCount,
      classesCount,
      studentsCount
      
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.delete('/delete/:id', async (req, res) => {
  try {
    const madrasaId = req.params.id;
    const madrasa = await Madrasa.findByIdAndDelete(madrasaId);

    if (!madrasa) {
      return res.status(404).json({ error: 'Madrasa not found ok ' });
    }

    res.json({ message: 'Madrasa deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
