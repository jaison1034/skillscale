const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee'); // Adjust the path if needed

// @route   GET /api/employees/performance
// @desc    Get all employees' performance data
router.get('/performance', async (req, res) => {
  try {
    const employees = await Employee.find({}, 'name position performanceScore').sort({ performanceScore: -1 });
    res.json(employees);
  } catch (error) {
    console.error('Error fetching performance data:', error);
    res.status(500).json({ message: 'Error fetching performance data' });
  }
});

module.exports = router;
