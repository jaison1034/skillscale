const express = require('express');
const router = express.Router();
const multer = require('../utils/cloudinary');
const Employee = require('../models/Employee');

// Add error handling for multer
const upload = multer.single('image');

router.put('/:id/upload', async (req, res) => {
  try {
    upload(req, res, async function(err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        return res.status(400).json({ 
          message: 'File upload error',
          error: err.message 
        });
      } else if (err) {
        // An unknown error occurred
        return res.status(500).json({ 
          message: 'Internal server error',
          error: err.message 
        });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const employee = await Employee.findById(req.params.id);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      // Ensure HTTPS URL
      let secureUrl = req.file.path;
      if (secureUrl.startsWith('http://')) {
        secureUrl = secureUrl.replace('http://', 'https://');
      }

      employee.profilePicture = secureUrl;
      await employee.save();

      res.json({ 
        message: 'Image uploaded successfully',
        profilePicture: secureUrl
      });
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