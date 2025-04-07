const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const Goal = require("../models/Goal");
const Review = require("../models/review");

router.get("/dashboard", async (req, res) => {
  try {
    const employees = await Employee.find();
    
    const employeesWithScores = await Promise.all(employees.map(async (employee) => {
      // Generate random attendance (15-20 days present out of 20)
      const presentDays = Math.floor(Math.random() * 6) + 15;
      const attendanceScore = (presentDays / 20) * 20;

      // ✅ Goal completion score (40% weight, max 40)
      const goals = await Goal.find({ assignedTo: employee._id });
      const completedGoals = goals.filter(goal => goal.completed);
      const totalGoalValue = goals.reduce((sum, goal) => sum + (goal.managerAssignedValue || 1), 0);
      const completedGoalValue = completedGoals.reduce((sum, goal) => sum + (goal.managerAssignedValue || 1), 0);
      const goalScore = totalGoalValue > 0 ? Math.min((completedGoalValue / totalGoalValue) * 40, 40) : 0;

      // ✅ Manager review score using normalized sentimentScore (out of 20)
      const maxSentimentScore = 10; // Change based on your data scale
      const sentimentScore = Math.min(employee.sentimentScore, maxSentimentScore);
      const managerReviewScore = Math.min((sentimentScore / maxSentimentScore) * 20, 20);

      // ✅ Peer review score (20% weight, max 20)
      const peerReviews = await Review.find({
        reviewedId: employee._id,
        reviewerId: { $ne: employee._id }
      });
      const peerReviewScore = peerReviews.length > 0
        ? Math.min((peerReviews.reduce((sum, review) => sum + review.score, 0) / peerReviews.length * 4), 20)
        : 0;

      // ✅ Final performance score (out of 100)
      const performanceScore = Math.round(goalScore + managerReviewScore + peerReviewScore + attendanceScore);

      // ✅ Update employee in DB
      await Employee.findByIdAndUpdate(employee._id, {
        performanceScore,
        attendance: { present: presentDays, total: 20 }
      });

      return {
        ...employee.toObject(),
        performanceScore,
        goalScore: Math.round(goalScore),
        managerReviewScore: Math.round(managerReviewScore),
        peerReviewScore: Math.round(peerReviewScore),
        attendanceScore: Math.round(attendanceScore)
      };
    }));

    res.json(employeesWithScores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
