const express = require('express');
const router = express.Router();
const Madrasa = require('../models/Madrasa');

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
router.get('/list', async (req, res) => {
  try {
    const madrasas = await Madrasa.find();
    res.json(madrasas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete Madrasa
router.delete('/delete/:id', async (req, res) => {
  try {
    const madrasaId = req.params.id;
    const madrasa = await Madrasa.findByIdAndDelete(madrasaId);

    if (!madrasa) {
      return res.status(404).json({ error: 'Madrasa not found' });
    }

    res.json({ message: 'Madrasa deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
