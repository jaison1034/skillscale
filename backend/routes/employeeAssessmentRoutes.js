const express = require("express");
const router = express.Router();
const EmployeeAssessment = require("../models/employeeAssessment");
const SelfAssessment = require("../models/selfAssessment");

// Get pending assessments for an employee
router.get("/get-pending-assessments/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    const pendingAssessments = await EmployeeAssessment.find({ employeeId, status: "pending" })
      .populate("questions.questionId") // Populate the question data from SelfAssessment
      .exec();
    res.status(200).json(pendingAssessments);
  } catch (error) {
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

module.exports = router;
