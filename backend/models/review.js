const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  reviewedId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  feedback: { type: String, required: true },
  score: { type: Number, required: true }, // NLP score (0 to 5)
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
});

module.exports = mongoose.model("Review", ReviewSchema);
