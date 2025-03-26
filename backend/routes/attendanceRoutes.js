const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");

// Submit attendance
router.post("/attendance", async (req, res) => {
  try {
    const { date, day, records } = req.body;
    const attendanceRecord = new Attendance({ date, day, records });
    await attendanceRecord.save();
    res.json({ message: "Attendance recorded successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to record attendance" });
  }
});
router.get("/attendance", async (req, res) => {
    try {
      const attendanceRecords = await Attendance.find();
      res.json(attendanceRecords);
    } catch (error) {
      res.status(500).json({ message: "Error fetching attendance records", error });
    }
  });

module.exports = router;
