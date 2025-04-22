const express = require('express');
const router = express.Router();
const multer = require('../utils/cloudinary'); // Import the configured multer instance
const Employee = require('../models/Employee');

// Get logged-in user details
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Upload profile image
router.put('/:id/upload', multer.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // Get secure HTTPS URL from Cloudinary
    const secureUrl = req.file.path.replace('http://', 'https://');
    
    employee.profilePicture = secureUrl;
    await employee.save();

    res.json({ 
      message: 'Image uploaded successfully',
      profilePicture: secureUrl // Return the secure URL
    });
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ 
      message: 'Error uploading image',
      error: err.message 
    });
  }
});

module.exports = router;