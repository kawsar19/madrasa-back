
const express = require('express');
const router = express.Router();
const ClassName = require('../models/ClassName');
router.post('/create', async (req, res) => {
  try {
    const { className } = req.body;
    const newClass = new ClassName({ className });
    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});
router.get('/list', async (req, res) => {
  try {
    const classes = await ClassName.find();
    res.status(200).json(classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});
router.get('/classes/:id', async (req, res) => {
  try {
    const classId = req.params.id;
    const foundClass = await ClassName.findById(classId);
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

module.exports=router;
