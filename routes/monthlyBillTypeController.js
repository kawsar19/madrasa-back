const express = require('express');
const router = express.Router();
const MonthlyBillType = require('../models/MonthlyBillType');
const authenticateToken = require('../middlewares/authCheck');

// Create a new monthly bill type
router.post('/create', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    } 
    const { madrasa } = req.user;
    const { typeName, description } = req.body;
    const newBillType = new MonthlyBillType({ typeName, description, madrasa });
    const savedBillType = await newBillType.save();
    res.status(201).json(savedBillType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get a list of monthly bill types
router.get('/list', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const billTypes = await MonthlyBillType.find({ madrasa: req.user.madrasa });
    res.status(200).json(billTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get a specific monthly bill type by ID
router.get('/:id', async (req, res) => {
  try {
    const billTypeId = req.params.id;
    const foundBillType = await MonthlyBillType.findById(billTypeId);
    if (!foundBillType) {
      return res.status(404).json({ error: 'Monthly bill type not found' });
    }
    res.status(200).json(foundBillType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Update a monthly bill type by ID
router.put('/update/:id', async (req, res) => {
  try {
    const billTypeId = req.params.id;
    const { typeName, description } = req.body;
    const updatedBillType = await MonthlyBillType.findByIdAndUpdate(
      billTypeId,
      { typeName, description },
      { new: true }
    );
    if (!updatedBillType) {
      return res.status(404).json({ error: 'Monthly bill type not found' });
    }
    res.status(200).json(updatedBillType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Delete a monthly bill type by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const billTypeId = req.params.id;
    const deletedBillType = await MonthlyBillType.findByIdAndDelete(billTypeId);
    if (!deletedBillType) {
      return res.status(404).json({ error: 'Monthly bill type not found' });
    }
    res.status(200).json({ message: 'Monthly bill type deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;