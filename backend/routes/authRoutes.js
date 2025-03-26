const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");
const Manager = require("../models/Manager");

const router = express.Router();
const SECRET_KEY = "your_secret_key";

// Add CORS headers middleware specifically for auth routes
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://skillscale1.onrender.com");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Register API
router.post("/register", async (req, res) => {
  const { name, email, password, role, department, position } = req.body;

  try {
    const existingEmployee = await Employee.findOne({ email });
    const existingManager = await Manager.findOne({ email });

    if (existingEmployee || existingManager) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "employee") {
      const newEmployee = new Employee({ name, email, password: hashedPassword, role, department, position, status: "pending", review: "" });
      await newEmployee.save();
    } else if (role === "manager") {
      const newManager = new Manager({ name, email, password: hashedPassword, role, department, position });
      await newManager.save();
    } else {
      return res.status(400).json({ message: "Invalid role selected!" });
    }

    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error!" });
  }
});

// Login API
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    if (name === "admin" && password === "admin123") {
      const token = jwt.sign({ role: "admin" }, SECRET_KEY, { expiresIn: "1h" });
      return res.json({ token, user: { name: "admin", role: "admin" } });
    }

    let user = await Employee.findOne({ name });
    let role = "employee";

    if (!user) {
      user = await Manager.findOne({ name });
      role = "manager";
    }

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign({ id: user._id, role }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token, user: { id: user._id, name: user.name, role } });
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
});

module.exports = router;