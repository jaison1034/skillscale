const express = require("express");
const Employee = require("../models/Employee");
const router = express.Router();
const vader = require('vader-sentiment');

// Fetch all employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
});

// Update employee review and status
router.put("/:id/review", async (req, res) => {
  const { review, status } = req.body;

  // Analyze sentiment using Vader
  const sentimentScore = vader.SentimentIntensityAnalyzer.polarity_scores(review);
  

  // Scale the sentiment score to be between 0 and 10
  let roundedsentimentScore = Math.round((sentimentScore.compound + 1) * 5);
  
  // Handle edge case for neutral sentiment (score 0)
  if (roundedsentimentScore === 0) {
    roundedsentimentScore = 5;  // Default neutral score
  }
  

  try {
    // Update the employee's review and sentiment score
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { review, status, sentimentScore: roundedsentimentScore },
      { new: true }
    );
    res.json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee review:", error);
    res.status(500).json({ message: 'Failed to update review' });
  }
});
router.get("/profile", async (req, res) => {
  try {
    const employeeId = req.user.id; // Extract from auth token
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    res.json(employee);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});
  

module.exports = router;