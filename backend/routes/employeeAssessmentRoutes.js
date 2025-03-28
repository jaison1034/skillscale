const express = require("express");
const router = express.Router();
const EmployeeAssessment = require("../models/employeeAssessment");
const SelfAssessment = require("../models/selfAssessment");
const Employee = require("../models/Employee");

// Get pending assessments for an employee
router.get("/get-pending-assessments/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    // Validate employeeId
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ error: "Invalid employee ID" });
    }

    const pendingAssessments = await EmployeeAssessment.find({ 
      employeeId, 
      status: "pending" 
    }).distinct("category");
    
    res.status(200).json(pendingAssessments);
  } catch (error) {
    console.error("Error fetching pending assessments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get completed assessments for an employee
router.get("/get-completed-assessments/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    // Validate employeeId
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ error: "Invalid employee ID" });
    }

    const completedAssessments = await EmployeeAssessment.find({ 
      employeeId, 
      status: "completed" 
    }).distinct("category");
    
    res.status(200).json(completedAssessments);
  } catch (error) {
    console.error("Error fetching completed assessments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get questions for a category
router.get("/get-questions/:category", async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!category || typeof category !== 'string') {
      return res.status(400).json({ error: "Invalid category" });
    }

    const questions = await SelfAssessment.find({ category }).select('-__v');
    
    if (!questions || questions.length === 0) {
      return res.status(404).json({ error: "No questions found for this category" });
    }
    
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Submit answers and mark assessment as completed
router.post("/submit-assessment/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { category, answers } = req.body;

    // Update the employee's assessment answers and mark as completed
    const assessment = await EmployeeAssessment.findOneAndUpdate(
      { employeeId, category, status: "pending" },
      { $set: { questions: answers, status: "completed" } },
      { new: true }
    );
    
    if (!assessment) {
      return res.status(400).json({ error: "Assessment not found" });
    }
    
    res.status(200).json({ message: "Assessment completed successfully", assessment });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all distinct categories
router.get("/get-categories", async (req, res) => {
  try {
    const categories = await SelfAssessment.distinct("category");
    
    if (!categories || categories.length === 0) {
      return res.status(404).json({ error: "No categories found" });
    }
    
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
