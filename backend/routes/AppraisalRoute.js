const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const mongoose = require('mongoose');

// routes/employees.js
router.get('/:id', async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid employee ID' });
      }
  
      const employee = await Employee.findById(req.params.id)
        .select('-password -__v') // Exclude sensitive/unnecessary fields
        .lean(); // Convert to plain JavaScript object
  
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      // Ensure all required fields have default values
      const employeeData = {
        ...employee,
        attendance: employee.attendance || { present: 0, total: 0 },
        goalsAssigned: employee.goalsAssigned || 0,
        goalsCompleted: employee.goalsCompleted || 0,
        performanceScore: employee.performanceScore || 0
      };
  
      res.json(employeeData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
module.exports = router;