const mongoose = require("mongoose");

const selfAssessmentSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answers: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
    },
  ],
  completedBy: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    },
  ],
  assignedTo: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    },
  ],
});

const SelfAssessment = mongoose.model("SelfAssessment", selfAssessmentSchema);
module.exports = SelfAssessment;