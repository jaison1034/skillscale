import React from "react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import img from '../../assets/images.png';
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa";
import { FaChartLine, FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";


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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br bg-sky-200">
       <nav className="bg-white shadow-lg sticky top-0 z-50">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                   <div className="flex items-center justify-between h-20">
                     {/* Logo/Brand */}
                     <div className="flex items-center">
                       <FaChartLine className="text-blue-600 text-3xl" />
                       <h1 className="text-2xl font-bold text-gray-700 ml-2">SkillScale</h1>
                     </div>
           
                     {/* Desktop Menu */}
                     <div className="hidden md:flex items-center space-x-2">
                       {["HOME","GOAL", "FEEDBACK", "APPRAISAL", "REVIEW"].map((path, index) => (
                         <NavLink
                           key={index}
                           to={`/${path}`}
                           
                           className={({ isActive }) =>
                             `px-4 py-2 rounded-md text-sm font-medium transition-colors 
                             ${isActive ? "bg-gray-300 text-gray-800" : "bg-transparent text-gray-700 hover:bg-gray-200"}`
                           
                            }
                         >
                           <button className="w-full h-full uppercase">{path}</button>
                         </NavLink>
                       ))}
           
                       {/* Profile Dropdown */}
                       <div className="relative ml-2">
                         <button
                           onClick={() => setIsProfileOpen(!isProfileOpen)}
                           className="flex items-center focus:outline-none transition-colors hover:bg-gray-200 rounded-full p-1"
                         >
                           <img
                             className="h-9 w-9 rounded-full border-2 border-transparent hover:border-gray-300 transition-all"
                             src={img}
                             alt="Profile"
                           />
                         </button>
           
                         {/* Dropdown menu */}
                         {isProfileOpen && (
                           <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5">
                             <div className="py-1">
                               <NavLink to="/prof" onClick={() => setIsProfileOpen(false)} className="no-underline"
          style={{ textDecoration: "none" }}>
                                 <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
                                   🧑‍💼 Profile
                                 </button>
                               </NavLink>
                               <NavLink to="/login" onClick={() => setIsProfileOpen(false)}className="no-underline"
          style={{ textDecoration: "none" }}>
                                 <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
                                   ⬅️ Logout
                                 </button>
                               </NavLink>
                             </div>
                           </div>
                         )}
                       </div>
                     </div>
           
                     {/* Mobile menu button */}
                     <div className="md:hidden flex items-center">
                       <button
                         onClick={() => setIsMenuOpen(!isMenuOpen)}
                         className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-200 focus:outline-none transition-colors"
                       >
                         {isMenuOpen ? <FaTimes className="block h-6 w-6" /> : <FaBars className="block h-6 w-6" />}
                       </button>
                     </div>
                   </div>
                 </div>
           
                 {/* Mobile Menu */}
                 <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
                   <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-white shadow-xl rounded-b-lg">
                     {["HOME","GOAL", "FEEDBACK", "APPRAISAL", "REVIEW"].map((path, index) => (
                       <NavLink
                         key={index}
                         to={`/${path}`}
                         className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-200"
                         onClick={() => setIsMenuOpen(false)}
                       >
                         <button className="w-full h-full uppercase">{path}</button>
                       </NavLink>
                     ))}
           
                     {/* Mobile Profile Dropdown */}
                     <div className="pt-4 pb-2 border-t border-gray-200">
                       <div className="flex items-center px-5 py-3">
                         <img className="h-10 w-10 rounded-full border-2 border-gray-300" src={img} alt="Profile" />
                         <div className="ml-3">
                           <div className="text-base font-medium text-gray-800">User Profile</div>
                         </div>
                       </div>
                       <div className="mt-1 px-2 space-y-1">
                         <NavLink to="/prof" onClick={() => setIsMenuOpen(false)} className="no-underline"
          style={{ textDecoration: "none" }}>
                           <button className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-200">
                             🧑‍💼 Profile
                           </button>
                         </NavLink>
                         <NavLink to="/login" onClick={() => setIsMenuOpen(false)} className="no-underline"
          style={{ textDecoration: "none" }}>
                           <button className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-200">
                             ⬅️ Logout
                           </button>
                         </NavLink>
                       </div>
                     </div>
                   </div>
                 </div>
               </nav>

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