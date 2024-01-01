const express = require('express');
const router = express.Router();
const ClassName = require('../models/ClassName');
const authenticateToken = require('../middlewares/authCheck');

router.post('/create', authenticateToken, async (req, res) => {
  try {
        if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    } 
    const {madrasa}=req.user
    const { className } = req.body;
    const newClass = new ClassName({ className, madrasa: madrasa });
    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.get('/list', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const classes = await ClassName.find({ madrasa: req.user.madrasa }).populate('madrasa', 'name');
    res.status(200).json(classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});


router.get('/classes/:id', async (req, res) => {
  try {
    const classId = req.params.id;
    const foundClass = await ClassName.findById(classId).populate('madrasa', 'name'); // Assuming 'name' as the field to be populated
    if (!foundClass) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.status(200).json(foundClass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const classId = req.params.id;
    const { className } = req.body;
    const updatedClass = await ClassName.findByIdAndUpdate(
      classId,
      { className },
      { new: true }
    );
    if (!updatedClass) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.status(200).json(updatedClass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const classId = req.params.id;
    const deletedClass = await ClassName.findByIdAndDelete(classId);
    if (!deletedClass) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.get('/total-classes', authenticateToken, async (req, res) => {
   try {
      if (!req.user) {
         return res.status(401).json({ error: 'Unauthorized' });
      }

      const query = { madrasa: req.user.madrasa }; // Filtering by the authenticated teacher's 'Madrasa'
      const totalClassName = await ClassName.countDocuments(query);

      res.status(200).json({ totalClassName});
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
});

module.exports = router;
