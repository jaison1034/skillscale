const express = require("express");
const router = express.Router();
const SelfAssessment = require("../models/selfAssessment");
const Employee = require("../models/Employee");

// Add questions under a category
router.post("/add-question", async (req, res) => {
  try {
    const { question, category } = req.body;
    if (!question || !category) return res.status(400).json({ error: "Question and category are required" });

    const newQuestion = new SelfAssessment({ question, category });
    await newQuestion.save();
    res.status(201).json({ message: "Question added successfully", question: newQuestion });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all categories
router.get("/get-categories", async (req, res) => {
  try {
    const categories = await SelfAssessment.distinct("category"); // Fetch unique categories
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get questions by category
router.get("/get-questions/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const questions = await SelfAssessment.find({ category });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Save employee answers
router.post("/save-answer/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;
    const { userId, answer } = req.body;

    if (!userId || !answer) {
      return res.status(400).json({ error: "User ID and answer are required" });
    }

    const question = await SelfAssessment.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    question.answers.push({ userId, answer });
    question.completedBy.push({ userId }); // Mark the user as completed
    await question.save();

    // Update employee's assessment completion status
    await Employee.findByIdAndUpdate(
      userId,
      { 
        hasCompletedSelfAssessment: true,
        lastAssessmentCompletionDate: new Date(),
        $inc: { assessmentsCompleted: 1 }
      }
    );

    res.status(200).json({ message: "Answer saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get completed assessments for a user
router.get("/get-completed-assessments/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const assessments = await SelfAssessment.find({ "completedBy.userId": userId }).distinct("category");
    res.status(200).json(assessments);
  } catch (error) {
    console.error("Error fetching completed assessments", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get pending assessments for a user
router.get("/get-pending-assessments/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const allCategories = await SelfAssessment.distinct("category");
    const completedCategories = await SelfAssessment.find({ "completedBy.userId": userId }).distinct("category");
    const pendingCategories = allCategories.filter((cat) => !completedCategories.includes(cat));
    res.status(200).json(pendingCategories);
  } catch (error) {
    console.error("Error fetching pending assessments", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-categories-count", async (req, res) => {
  try {
    const count = await SelfAssessment.distinct("category").then((categories) => categories.length);
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching categories count", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete-question/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await SelfAssessment.findByIdAndDelete(id);
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;