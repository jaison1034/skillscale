import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import img from '../../assets/images.png';
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaPhone ,FaChartLine} from "react-icons/fa";


const Button = ({ children, onClick }) => (
  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all" onClick={onClick}>
    {children}
  </button>
);

const Card = ({ children, className }) => <div className={`bg-white shadow-lg rounded-xl p-6 border border-gray-100 ${className}`}>{children}</div>;
const CardContent = ({ children }) => <div className="p-4">{children}</div>;

const Progress = ({ value }) => (
  <div className="w-full bg-gray-200 rounded-full h-3">
    <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all" style={{ width: `${value}%` }}></div>
  </div>
);

const employeeAppraisal = {
  Name: "Adwaith",
  Department: "Software Engineering",
  Position: "Software Engineer",
  GoalsCompleted: 5,
  TotalGoals: 6,
  SelfAssessment: "Completed",
  Attendance: "95%",
  PerformanceScore: 85,
  Feedback: "Adwaith has consistently met deadlines and delivered high-quality code.",
  ImprovementSuggestions: "Improve time management and explore new tech trends."
};

const oldAppraisals = [
  { id: 1, title: "2024 Year-End Review", completed: "December 30, 2024" },
  { id: 2, title: "Q3 Performance Review", completed: "September 30, 2024" },
];

const performanceData = [
  { name: "Q1", score: 80 },
  { name: "Q2", score: 75 },
  { name: "Q3", score: 85 },
  { name: "Q4", score: 90 },
];

const ratingData = [
  { name: "Excellent", value: 40 },
  { name: "Good", value: 35 },
  { name: "Average", value: 15 },
  { name: "Needs Improvement", value: 10 },
];

const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#F44336"];

const AppraisalDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br bg-sky-200">
      {/* Navbar */}
      <Navbar className="bg-white shadow-sm p-0 m-0">
        <Container fluid>
          <Navbar.Brand href="/" className="flex items-center">
            
            <FaChartLine className="text-blue-600 text-3xl" />
            <h1 className="text-2xl font-bold text-[#3674B5] ml-2">SkillScale</h1>
          </Navbar.Brand>
          <Nav className="ml-auto flex items-center">
            <Nav.Link href="/home" className="text-gray-700 hover:text-blue-500 px-3">HOME</Nav.Link>
            <Nav.Link href="/goal" className="text-gray-700 hover:text-blue-500 px-3">GOAL</Nav.Link>
            <Nav.Link href="/feedback" className="text-gray-700 hover:text-blue-500 px-3">FEEDBACK</Nav.Link>
            <Nav.Link href="/review" className="text-gray-700 hover:text-blue-500 px-3">REVIEW</Nav.Link>
            <NavDropdown
              title={
                <img
                  src={img}
                  alt="Profile"
                  className="rounded-full"
                  width="40"
                  height="40"
                />
              }
              id="basic-nav-dropdown"
              align="end"
            >
              <NavDropdown.Item href="#profile" className="text-gray-700 hover:bg-gray-100">🧑‍💼Profile</NavDropdown.Item>
              <NavDropdown.Item href="/login" className="text-gray-700 hover:bg-gray-100">⬅️Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Employee Appraisal Card */}
        <Card className="lg:col-span-2">
          <CardContent>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Employee Appraisal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(employeeAppraisal).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="text-lg font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Old Appraisals Card */}
        <Card>
          <CardContent>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Old Appraisals</h2>
            {oldAppraisals.map(({ id, title, completed }) => (
              <div key={id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">{title}</p>
                <p className="text-sm text-gray-500">Completed: {completed}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance Over Time Card */}
        <Card className="lg:col-span-2">
          <CardContent>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Performance Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="score" fill="#4CAF50" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Goal Completion Card */}
        <Card>
          <CardContent>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Goal Completion</h2>
            <p className="text-sm text-gray-600 mb-4">75% of your appraisal goals are completed</p>
            <Progress value={75} />
          </CardContent>
        </Card>

        {/* Appraisal Ratings Card */}
        <Card>
          <CardContent>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Appraisal Ratings</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ratingData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  dataKey="value"
                  label
                >
                  {ratingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-2 items-center">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        {/* Company Info */}
        <div>
          <h2 className="text-lg font-bold">SkillScale</h2>
          <p className="mt-2 text-gray-400">Empowering growth through continuous performance tracking.</p>
        </div>

        {/* Quick Links */}
        <div className="mb-6 items-center">
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaEnvelope className="mr-2" />
                info@skillscale.com
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2" />
                6282645889
              </li>
              <li className="flex items-center">
                <span className="mr-2">📍</span>
                <span>CyberPark, Kozhikode, India</span>
              </li>
            </ul>
          </div>

        {/* Contact & Social */}
        <div className="items-center">
          <h3 className="text-lg font-semibold">Connect With Us</h3>
          <div className="mt-6 flex space-x-4 items-center">
            <a href="https://facebook.com" className="text-gray-400 hover:text-white items-center"><FaFacebook size={20} /></a>
            <a href="https://twitter.com" className="text-gray-400 hover:text-white"><FaTwitter size={20} /></a>
            <a href="https://linkedin.com" className="text-gray-400 hover:text-white"><FaLinkedin size={20} /></a>
            <a href="mailto:info@skillscale.com" className="text-gray-400 hover:text-white"><FaEnvelope size={20} /></a>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className=" text-center text-gray-500 text-sm border-t border-gray-600 text-center">
        &copy; 2025 SkillScale. All Rights Reserved.
      </div>
    </footer>
      
    </div>
  );
};

export default AppraisalDashboard;