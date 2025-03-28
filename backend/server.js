require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); 
const authRoutes = require("./routes/authRoutes");
const goalRoutes = require("./routes/goalRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const reviewRoutes = require("./routes/reviewRoutes.js");
const attendanceRoutes = require("./routes/attendanceRoutes");
const selfAssessmentRoutes = require("./routes/selfAssessmentRoutes");
const employeeAssessmentRoutes = require("./routes/employeeAssessmentRoutes");
const managerAssessmentRoutes = require("./routes/managerSelfAssement.js");
const adminRoutes = require('./routes/adminRoutes.js');
const feedbackRoutes = require('./routes/feedbackRoutes.js');
const performanceDashboardRoutes = require('./routes/performanceDashboardRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Enhanced CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://skillscale1.onrender.com",
  "https://skillscale-sqip.onrender.com"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

// Set up API routes
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
app.use('/api/dashboard', performanceDashboardRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});