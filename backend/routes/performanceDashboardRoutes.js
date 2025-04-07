const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const Goal = require('../models/Goal');
const Review = require('../models/review');

// Get all employee performance data for dashboard
router.get('/dashboard', async (req, res) => {
  try {
    // Get all employees (excluding passwords)
    const employees = await Employee.find({}, '-password');

    // Get all goals and group by employee
    const allGoals = await Goal.find();
    const goalsByEmployee = allGoals.reduce((acc, goal) => {
      const empId = goal.assignedTo.toString();
      if (!acc[empId]) acc[empId] = [];
      acc[empId].push(goal);
      return acc;
    }, {});

    // Get all reviews and group by reviewed employee
    const allReviews = await Review.find().populate('reviewerId', 'name position');
    const reviewsByEmployee = allReviews.reduce((acc, review) => {
      const empId = review.reviewedId.toString();
      if (!acc[empId]) acc[empId] = [];
      acc[empId].push(review);
      return acc;
    }, {});

    // Process each employee with their performance data
    const employeePerformanceData = employees.map(employee => {
      const empId = employee._id.toString();
      const goals = goalsByEmployee[empId] || [];
      const reviews = reviewsByEmployee[empId] || [];
      
      const completedGoals = goals.filter(g => g.completed).length;
      const avgReviewScore = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length
        : 0;

      return {
        ...employee.toObject(),
        goals,
        reviews,
        performanceMetrics: {
          goalsAssigned: goals.length,
          goalsCompleted: completedGoals,
          goalCompletionRate: goals.length > 0 ? (completedGoals / goals.length) * 100 : 0,
          reviewCount: reviews.length,
          averageReviewScore: parseFloat(avgReviewScore.toFixed(1)),
          sentimentScore: employee.sentimentScore || 0
        }
      };
    });

    res.json(employeePerformanceData);
  } catch (err) {
    console.error('Error fetching performance dashboard data:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get detailed performance data for a single employee
router.get('/employee/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id, '-password');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const [goals, reviews] = await Promise.all([
      Goal.find({ assignedTo: req.params.id }).sort({ dueDate: 1 }),
      Review.find({ reviewedId: req.params.id })
        .populate('reviewerId', 'name position department')
        .sort({ createdAt: -1 })
    ]);

    const completedGoals = goals.filter(g => g.completed).length;
    const avgReviewScore = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length
      : 0;

    const performanceData = {
      employee,
      goals,
      reviews,
      performanceMetrics: {
        goalsAssigned: goals.length,
        goalsCompleted: completedGoals,
        goalCompletionRate: goals.length > 0 ? (completedGoals / goals.length) * 100 : 0,
        reviewCount: reviews.length,
        averageReviewScore: parseFloat(avgReviewScore.toFixed(1)),
        sentimentScore: employee.sentimentScore || 0
      }
    };

    res.json(performanceData);
  } catch (err) {
    console.error('Error fetching employee performance data:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;