const mongoose = require("mongoose");

const PerformanceScoreSchema = new mongoose.Schema({
  employeeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Employee', 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  department: { 
    type: String, 
    required: true 
  },
  position: { 
    type: String, 
    required: true 
  },
  components: {
    goalCompletion: { 
      type: Number, 
      required: true 
    },
    selfAssessment: { 
      type: Number, 
      required: true 
    },
    managerReview: { 
      type: Number, 
      required: true 
    },
    peerReview: { 
      type: Number, 
      required: true 
    },
    attendance: { 
      type: Number, 
      required: true 
    }
  },
  totalScore: { 
    type: Number, 
    required: true 
  },
  weightedScore: { 
    type: Number, 
    required: true 
  },
  rating: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("PerformanceScore", PerformanceScoreSchema);