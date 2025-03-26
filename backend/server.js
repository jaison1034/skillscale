require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors"); 
const goalRoutes = require("./routes/goalRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const reviewRoutes = require("./routes/reviewRoutes.js");
const attendanceRoutes = require("./routes/attendanceRoutes");
const selfAssessmentRoutes = require("./routes/selfAssessmentRoutes");
const employeeAssessmentRoutes = require("./routes/employeeAssessmentRoutes");
const managerAssessmentRoutes = require("./routes/managerSelfAssement.js");
const adminRoutes = require('./routes/adminRoutes.js');
const feedbackRoutes = require('./routes/feedbackRoutes.js');


const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5174"],
  credentials: true}
)); 
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/reviews", feedbackRoutes);
app.use("/api", attendanceRoutes);
app.use("/api/self-assessment", selfAssessmentRoutes);
app.use("/api/employee-assessment", employeeAssessmentRoutes);
app.use("/api/manager-assessment", managerAssessmentRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
