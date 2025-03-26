const express = require("express");
const mongoose = require("mongoose");
const Goal = require("../models/Goal");
const Employee = require("../models/Employee"); 

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const goals = await Goal.find().populate("assignedTo", "name _id goalsAssigned goalsCompleted");
    res.status(200).json(goals);
  } catch (error) {
    console.error("Error fetching all goals:", error);
    res.status(500).json({ message: "Error fetching goals" });
  }
});
router.post("/", async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, managerAssignedValue } = req.body;

    if (!title || !assignedTo || !dueDate) {
      return res.status(400).json({ message: "Title, AssignedTo, and DueDate are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
      return res.status(400).json({ message: "Invalid Employee ID" });
    }

    // Create the new goal
    const goal = new Goal({
      title,
      description,
      assignedTo: new mongoose.Types.ObjectId(assignedTo),
      dueDate,
      completed: false,
      managerAssignedValue: managerAssignedValue || 0,
    });

    // Save the goal
    await goal.save();

    // Increment the goalsAssigned field for the employee
    await Employee.findByIdAndUpdate(assignedTo, { $inc: { goalsAssigned: 1 } });

    res.status(201).json(goal);
  } catch (error) {
    console.error("Error saving goal:", error);
    res.status(500).json({ message: "Error saving goal" });
  }
});


// Fetch goals assigned to a specific employee
router.get("/employee/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: "Invalid Employee ID" });
    }

    const goals = await Goal.find({ assignedTo: employeeId });
    res.status(200).json(goals);
  } catch (error) {
    console.error("Error fetching employee goals:", error);
    res.status(500).json({ message: "Error fetching goals" });
  }
});

// Update a goal by ID
router.put("/:id", async (req, res) => {
  try {
    const goalId = req.params.id;
    const { managerAssignedValue } = req.body; // New field for updating the value

    if (!mongoose.Types.ObjectId.isValid(goalId)) {
      return res.status(400).json({ message: "Invalid Goal ID" });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(goalId, { managerAssignedValue }, { new: true });

    if (!updatedGoal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.status(200).json(updatedGoal);
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({ message: "Error updating goal" });
  }
});


// Mark a goal as completed
router.put("/complete/:id", async (req, res) => {
  try {
    const goalId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(goalId)) {
      return res.status(400).json({ message: "Invalid Goal ID" });
    }

    const goal = await Goal.findByIdAndUpdate(goalId, { completed: true }, { new: true });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Increment the goalsCompleted field for the employee
    await Employee.findByIdAndUpdate(goal.assignedTo, { $inc: { goalsCompleted: 1 } });

    res.status(200).json(goal);
  } catch (error) {
    console.error("Error marking goal as completed:", error);
    res.status(500).json({ message: "Error marking goal as completed" });
  }
});
// Fetch goals assigned to an employee (Alternative to /employee/:id)
router.get("/", async (req, res) => {
  try {
    const { employeeId } = req.query;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: "Invalid Employee ID" });
    }

    const goals = await Goal.find({ assignedTo: employeeId }).populate("assignedTo", "name _id");

    res.status(200).json(goals);
  } catch (error) {
    console.error("Error fetching employee goals:", error);
    res.status(500).json({ message: "Error fetching goals" });
  }
});

module.exports = router;
