const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  dueDate: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  managerAssignedValue: { type: Number, default: 0 } // New field for manager's assigned value
});

// Ensure assignedTo is stored as an ObjectId
goalSchema.pre("save", function (next) {
  if (typeof this.assignedTo === "string") {
    this.assignedTo = new mongoose.Types.ObjectId(this.assignedTo);
  }
  next();
});

const Goal = mongoose.model("Goal", goalSchema);

module.exports = Goal;

