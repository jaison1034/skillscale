const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "employee" },
  department: { type: String, required: true},
  position: { type: String, required: true},
  status: { type: String, enum: ["pending", "completed"], default: "pending" }, // Review Status
  review: { type: String, default: "" },
  sentimentScore: { type: Number, default: 0 },
  goalsAssigned: { type: Number, default: 0 }, 
  goalsCompleted: { type: Number, default: 0 },
  assessmentsAssigned: { type: Number, default: 0 }, 
  assessmentsCompleted: { type: Number, default: 0 },
  hasCompletedSelfAssessment: {
    type: Boolean,
    default: false
  },
  lastAssessmentCompletionDate: Date,
  performanceScore: { 
    type: Number 
  },
  performanceScore: { type: Number, default: 0 },
  attendance: { 
    present: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  }
});

const Employee = mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;
