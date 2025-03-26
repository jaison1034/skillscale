const mongoose = require("mongoose");

const employeeAssessmentSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee", // Reference to the Employee model
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  questions: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SelfAssessment", // Reference to the SelfAssessment model
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
});

const EmployeeAssessment = mongoose.model("EmployeeAssessment", employeeAssessmentSchema);
module.exports = EmployeeAssessment;
