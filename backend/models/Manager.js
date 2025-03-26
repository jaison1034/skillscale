const mongoose = require("mongoose");

const ManagerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "manager" },
  department: { type: String, required: true },
  position: { type: String, required: true }, // Manager-specific field
});

module.exports = mongoose.model("Manager", ManagerSchema);
