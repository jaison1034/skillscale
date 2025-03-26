const express = require("express");
const router = express.Router();
const SelfAssessment = require("../models/selfAssessment");
const Employee = require("../models/Employee");

// Fetch completed assessments with employee names and categories
router.get("/get-completed-assessments", async (req, res) => {
  try {
    const assessments = await SelfAssessment.find({ "completedBy.userId": { $exists: true, $ne: [] } });
    const completedAssessments = [];

    for (const assessment of assessments) {
      for (const completed of assessment.completedBy) {
        const employee = await Employee.findById(completed.userId);
        if (employee) {
          completedAssessments.push({
            userName: employee.name,
            category: assessment.category,
          });
        }
      }
    }

    res.json(completedAssessments);
  } catch (error) {
    console.error("Error fetching completed assessments", error);
    res.status(500).json({ message: "Error fetching completed assessments" });
  }
});
router.get("/get-pending-assessments", async (req, res) => {
    try {
      const employees = await Employee.find({ status: "pending" });
      const pendingAssessments = [];
  
      for (const employee of employees) {
        const assessments = await SelfAssessment.find({ "completedBy.userId": { $ne: employee._id } });
        for (const assessment of assessments) {
          pendingAssessments.push({
            userName: employee.name,
            category: assessment.category,
          });
        }
      }
  
      res.json(pendingAssessments);
    } catch (error) {
      console.error("Error fetching pending assessments", error);
      res.status(500).json({ message: "Error fetching pending assessments" });
    }
  });

module.exports = router;