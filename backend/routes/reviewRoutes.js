const express = require("express");
const Employee = require("../models/Employee");
const Review = require("../models/review"); // Import Review model
const router = express.Router();
const analyzeReview = require("../utils/sentimentAnalysis");

// Fetch all employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
});

// Create and update review
router.put("/:id/review", async (req, res) => {
  try {
  
  const { reviewerId, feedback, status } = req.body;
  if (!feedback) {
    return res.status(400).json({ error: "Feedback cannot be empty" });
}

// Get NLP Score
const score = analyzeReview(feedback);

// Save to Database
const review = new Review({
    reviewedId: req.params.id,
    reviewerId,
    feedback,
    score,  // Store the NLP score
    status: "completed",
});

await review.save();
res.json({ message: "Review submitted successfully", score });

} catch (error) {
console.error("Error submitting review:", error);
res.status(500).json({ error: "Server error" });
}
});
router.get('/reviews/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch completed reviews (reviews submitted by the user)
    const completedReviews = await Review.find({ reviewerId: userId, status: 'completed' })
      .populate({ path: "reviewedId", select: "name" });

    // Get all employees except the logged-in user
    const allEmployees = await Employee.find({ _id: { $ne: userId } });

    // Find employees who have already been reviewed
    const reviewedEmployeeIds = completedReviews.map(review => review.reviewedId._id.toString());

    // Find employees who have not yet been reviewed by this user
    const pendingEmployees = allEmployees.filter(emp => !reviewedEmployeeIds.includes(emp._id.toString()));

    // Convert to the expected format
    const pendingReviews = pendingEmployees.map(emp => ({
      _id: emp._id,
      reviewedId: { _id: emp._id, name: emp.name },
    }));

    res.json({
      completed: completedReviews,
      pending: pendingReviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});


module.exports = router;
