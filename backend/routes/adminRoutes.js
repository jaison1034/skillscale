// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Manager = require('../models/Manager');

// Fetch all employees and managers
router.get('/users', async (req, res) => {
  try {
    const employees = await Employee.find({});
    const managers = await Manager.find({});
    res.json({ employees, managers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an employee
router.delete('/employees/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a manager
router.delete('/managers/:id', async (req, res) => {
  try {
    await Manager.findByIdAndDelete(req.params.id);
    res.json({ message: 'Manager deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;