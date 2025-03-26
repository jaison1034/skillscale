const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  date: { type: String, required: true },
  day: { type: String, required: true },
  records: [
    {
      employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
      name: String,
      present: Boolean,
    },
  ],
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
