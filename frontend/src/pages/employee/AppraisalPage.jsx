import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaChartLine, FaBars, FaTimes, FaFacebook, 
  FaTwitter, FaLinkedin, FaEnvelope, FaPhone 
} from 'react-icons/fa';
import { FaMapMarkerAlt } from "react-icons/fa";
import img from '../../assets/images.png';
import logo from "../../assets/logo.webp";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axiosInstance from "../../axiosInstance";

const AppraisalPage = () => {
  const { user } = useUser();
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchEmployeeData = async () => {
      try {
        const response = await axiosInstance.get(`/employees/${user.id}`);
        setEmployeeData(response.data);
      } catch (err) {
        setEmployeeData({
          name: user?.name || 'Employee',
          department: user?.department || 'Department',
          position: user?.position || 'Position',
          goalsAssigned: 0,
          goalsCompleted: 0,
          performanceScore: 0,
          attendance: { present: 0, total: 0 }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [user, navigate]);

  const getImprovementSuggestion = (score) => {
    if (score >= 90) return "🌟 Exceptional! Ready for leadership roles.";
    if (score >= 75) return "💪 Strong performance! Keep challenging yourself.";
    if (score >= 60) return "👍 Good! Focus on specific areas to improve.";
    if (score >= 40) return "📈 Needs improvement. Create a development plan.";
    return "⚠️ Needs immediate improvement plan.";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FB5607]"></div>
      </div>
    );
  }

  const attendance = employeeData.attendance || { present: 0, total: 0 };
  const attendancePercentage = attendance.total > 0 
    ? Math.round((attendance.present / attendance.total) * 100)
    : 0;

  const goalsAssigned = employeeData.goalsAssigned || 0;
  const goalsCompleted = employeeData.goalsCompleted || 0;
  const completionRate = goalsAssigned > 0 
    ? Math.round((goalsCompleted / goalsAssigned) * 100)
    : 0;

  return (
    <div className="bg-black min-h-screen">
      {/* Navbar (same as homepage) */}
      <nav className="bg-[#140000] shadow-lg sticky top-0 z-50 border-b border-[#EA033F]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-20">
      {/* Logo/Brand */}
      <div className="flex items-center">
  <img
    src={logo}
    alt="SkillScale Logo"
    className="h-50 w-30 object-contain"
  />
</div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-2">
        {["HOME","GOAL", "FEEDBACK", "APPRAISALPAGE", "REVIEW"].map((path, index) => (
          <NavLink
            key={index}
            to={`/${path}`}
            className={({ isActive }) =>
              `px-4 py-2 rounded-md text-sm font-medium transition-colors 
              ${isActive ? "bg-gradient-to-r from-[#EA033F] to-[#FB5607] text-white shadow-md" : 
              "bg-transparent text-[#F7F7F7] hover:bg-[#FB5607]/10 hover:text-white"}`
            }
          >
            <button className="w-full h-full uppercase text-white">{path}</button>
          </NavLink>
        ))}
        <div className="relative ml-2">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center focus:outline-none transition-colors hover:bg-[#FB5607]/10 rounded-full p-1"
          >
            <img
              className="h-9 w-9 rounded-full border-2 border-transparent hover:border-[#FB5607] transition-all"
              src={img}
              alt="Profile"
            />
          </button>

          {/* Dropdown menu */}
          {isProfileOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-xl bg-[#140000] border border-[#EA033F]/20">
              <div className="py-1">
                <NavLink 
                  to="/prof" 
                  onClick={() => setIsProfileOpen(false)} 
                  className="no-underline"
                  style={{ textDecoration: "none" }}
                >
                  <button className="block w-full text-left px-4 py-2 text-sm text-[#F7F7F7] hover:bg-[#FB5607]/10">
                    🧑‍💼 Profile
                  </button>
                </NavLink>
                <NavLink 
                  to="/login" 
                  onClick={() => setIsProfileOpen(false)} 
                  className="no-underline"
                  style={{ textDecoration: "none" }}
                >
                  <button className="block w-full text-left px-4 py-2 text-sm text-[#F7F7F7] hover:bg-[#FB5607]/10">
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
          className="inline-flex items-center justify-center p-2 rounded-md text-[#F7F7F7] hover:text-[#FB5607] hover:bg-[#FB5607]/10 focus:outline-none transition-colors"
        >
          {isMenuOpen ? <FaTimes className="block h-6 w-6" /> : <FaBars className="block h-6 w-6" />}
        </button>
      </div>
    </div>
  </div>

  {/* Mobile Menu */}
  <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
    <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-[#140000] shadow-xl rounded-b-lg border-t border-[#EA033F]/20">
      {["GOAL", "FEEDBACK", "APPRAISALPAGE", "REVIEW"].map((path, index) => (
        <NavLink
          key={index}
          to={`/${path}`}
          className={({ isActive }) =>
            `block px-3 py-3 rounded-md text-base font-medium transition-colors
            ${isActive ? "bg-gradient-to-r from-[#EA033F] to-[#FB5607] text-white" : 
            "text-white hover:bg-[#FB5607]/10 hover:text-white"}`
          }
          onClick={() => setIsMenuOpen(false)}
        >
          <button className="w-full h-full uppercase">{path}</button>
        </NavLink>
      ))}

      {/* Mobile Profile Dropdown */}
      <div className="pt-4 pb-2 border-t border-[#EA033F]/20">
        <div className="flex items-center px-5 py-3">
          <img className="h-10 w-10 rounded-full border-2 border-[#FB5607]" src={img} alt="Profile" />
          <div className="ml-3">
            <div className="text-base font-medium text-[#F7F7F7]">User Profile</div>
          </div>
        </div>
        <div className="mt-1 px-2 space-y-1">
          <NavLink to="/prof" onClick={() => setIsMenuOpen(false)}
          className="no-underline"
          style={{ textDecoration: "none" }}>
            <button className="block w-full text-left px-3 py-2 text-base font-medium text-[#F7F7F7] hover:bg-[#FB5607]/10 rounded-md">
              🧑‍💼 Profile
            </button>
          </NavLink>
          <NavLink to="/login" onClick={() => setIsMenuOpen(false)}
          className="no-underline"
          style={{ textDecoration: "none" }}>
            <button className="block w-full text-left px-3 py-2 text-base font-medium text-[#F7F7F7] hover:bg-[#FB5607]/10 rounded-md">
              ⬅️ Logout
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  </div>

      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white">
          <span class=" text-4xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">Performance Appraisal </span>
          </h1>
          <p className="mt-3 text-xl text-white">
            {new Date().getFullYear()} Annual Review
          </p>
        </motion.div>

        {/* Employee Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-[#0F0F0F] rounded-xl overflow-hidden mb-8 border border-[#1F1F1F] hover:border-[#EA033F]/50 transition-all duration-300"
        >
          <div className="bg-gradient-to-r from-[#EA033F] to-[#FB5607] p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-2xl font-bold text-white">{employeeData.name}</h2>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div>
                    <span className="text-[#F7F7F7]/90">Position:</span>
                    <span className="ml-2 font-medium text-white">{employeeData.position}</span>
                  </div>
                  <div>
                    <span className="text-[#F7F7F7]/90">Department:</span>
                    <span className="ml-2 font-medium text-white">{employeeData.department}</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#140000]/30 rounded-lg px-4 py-2">
                <span className="text-sm text-white">Appraisal Period:</span>
                <span className="ml-2 font-medium text-white">Jan 2025 - Apr 2025</span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="p-6 space-y-8">
            {/* Performance Score */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-white">Overall Performance Score</h3>
                <span className="text-xl font-bold bg-[#FB5607]/10 text-[#FB5607] px-3 py-1 rounded-full">
                  {employeeData.performanceScore || 0}/100
                </span>
              </div>
              <div className="relative pt-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${
                      (employeeData.performanceScore || 0) >= 80 ? 'bg-[#EA033F]/20 text-[#EA033F]' :
                      (employeeData.performanceScore || 0) >= 60 ? 'bg-[#FB5607]/20 text-[#FB5607]' :
                      'bg-[#140000]/20 text-gray-400'
                    }`}>
                      {employeeData.performanceScore >= 80 ? 'Excellent' : 
                       employeeData.performanceScore >= 60 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-[#1A1A1A] mt-2">
                  <div
                    className={`shadow-none flex flex-col text-center whitespace-nowrap justify-center ${
                      (employeeData.performanceScore || 0) >= 80 ? 'bg-[#EA033F]' :
                      (employeeData.performanceScore || 0) >= 60 ? 'bg-[#FB5607]' :
                      'bg-[#140000]'
                    }`}
                    style={{ width: `${employeeData.performanceScore || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Goals Completion Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-[#1A1A1A] p-6 rounded-xl border border-[#1F1F1F] hover:border-[#FB5607]/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">Goals Completion</h4>
                  <span className="bg-[#FB5607]/20 text-[#FB5607] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {completionRate}%
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-400">Assigned:</span>
                    <span className="ml-2 font-medium text-white">{goalsAssigned}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Completed:</span>
                    <span className="ml-2 font-medium text-white">{goalsCompleted}</span>
                  </div>
                  <div className="pt-2">
                    <div className="w-full bg-[#1A1A1A] rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-[#EA033F] to-[#FB5607] h-2.5 rounded-full" 
                        style={{ width: `${completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Attendance Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-[#1A1A1A] p-6 rounded-xl border border-[#1F1F1F] hover:border-[#EA033F]/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">Attendance</h4>
                  <span className="bg-[#EA033F]/20 text-[#EA033F] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {attendancePercentage}%
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-400">Present:</span>
                    <span className="ml-2 font-medium text-white">{attendance.present} days</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Total:</span>
                    <span className="ml-2 font-medium text-white">{attendance.total} days</span>
                  </div>
                  <div className="pt-2">
                    <div className="w-full bg-[#1A1A1A] rounded-full h-2.5">
                      <div 
                        className="bg-[#EA033F] h-2.5 rounded-full" 
                        style={{ width: `${attendancePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-[#1A1A1A] p-6 rounded-xl border border-[#1F1F1F] hover:border-[#EA033F]/50 transition-all duration-300"
  >
    <div className="flex items-center justify-between mb-4">
      <h4 className="text-lg font-semibold text-white">Self Assessment</h4>
      {employeeData.hasCompletedSelfAssessment ? (
        <span className="bg-green-500/20 text-green-500 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
          <FaCheckCircle className="mr-1" /> Completed
        </span>
      ) : (
        <span className="bg-red-500/20 text-red-500 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
          <FaTimesCircle className="mr-1" /> Not Completed
        </span>
      )}
    </div>
    <div className="space-y-3">
      <div>
        <span className="text-sm text-gray-400">Status:</span>
        <span className="ml-2 font-medium text-white">
          {employeeData.hasCompletedSelfAssessment ? 'Completed' : 'Not Completed'}
        </span>
      </div>
      <div>
        <span className="text-sm text-gray-400">Last Completed:</span>
        <span className="ml-2 font-medium text-white">
          {employeeData.lastAssessmentCompletionDate 
            ? new Date(employeeData.lastAssessmentCompletionDate).toLocaleDateString()
            : 'Never'}
        </span>
      </div>
      
    </div>
  </motion.div>

            {/* Improvement Suggestions */}
            <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#1F1F1F]">
              <h3 className="text-lg font-semibold text-white mb-3">Improvement Suggestions</h3>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="bg-[#FB5607]/10 p-2 rounded-full">
                    <svg className="h-5 w-5 text-[#FB5607]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-gray-300">
                    {getImprovementSuggestion(employeeData.performanceScore || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#0F0F0F] px-6 py-4 border-t border-[#1F1F1F]">
            <p className="text-sm text-gray-500 text-center">
              Appraisal generated on {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Footer (same as homepage) */}
      <footer className="bg-[#140000] text-[#F7F7F7] py-8">
       <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Company Info */}
    <div className="space-y-4">
      <div className="flex items-center">
        <img
          src={logo}
          alt="SkillScale Logo"
          className="h-50 w-30 object-contain"
        />
      </div>
      <p className="text-[#F7F7F7]/80">
        Empowering growth through continuous performance tracking.
      </p>
     
    </div>

    {/* Contact Info */}
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-[#F7F7F7] border-b border-[#EA033F]/30 pb-2">
        Contact Us
      </h4>
      <ul className="space-y-3">
        <li className="flex items-start">
          <FaEnvelope className="text-[#FB5607] mt-1 mr-3 flex-shrink-0" />
          
            info@skillscale.com
          
        </li>
        <li className="flex items-start">
          <FaPhone className="text-[#FB5607] mt-1 mr-3 flex-shrink-0" />
         
            +91 6282645889
          
        </li>
        <li className="flex items-start">
          <FaMapMarkerAlt className="text-[#FB5607] mt-1 mr-3 flex-shrink-0" />
          <span>CyberPark, Kozhikode, India</span>
        </li>
      </ul>
    </div>

    {/* Social Links */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#F7F7F7] border-b border-[#EA033F]/30 pb-2">
        Connect With Us
      </h3>
      <div className="flex space-x-6">
        <a href="https://facebook.com" className="bg-[#140000] p-2 rounded-full border border-[#EA033F]/20 hover:bg-[#EA033F]/10 hover:border-[#EA033F]/50 transition-all">
          <FaFacebook size={20} className="text-[#F7F7F7] hover:text-[#EA033F]" />
        </a>
        <a href="https://twitter.com" className="bg-[#140000] p-2 rounded-full border border-[#EA033F]/20 hover:bg-[#EA033F]/10 hover:border-[#EA033F]/50 transition-all">
          <FaTwitter size={20} className="text-[#F7F7F7] hover:text-[#EA033F]" />
        </a>
        <a href="https://linkedin.com" className="bg-[#140000] p-2 rounded-full border border-[#EA033F]/20 hover:bg-[#EA033F]/10 hover:border-[#EA033F]/50 transition-all">
          <FaLinkedin size={20} className="text-[#F7F7F7] hover:text-[#EA033F]" />
        </a>
        <a href="mailto:info@skillscale.com" className="bg-[#140000] p-2 rounded-full border border-[#EA033F]/20 hover:bg-[#EA033F]/10 hover:border-[#EA033F]/50 transition-all">
          <FaEnvelope size={20} className="text-[#F7F7F7] hover:text-[#EA033F]" />
        </a>
      </div>
    </div>
  </div>
  
  {/* Copyright */}
  <div className="mt-8 pt-6 border-t border-[#EA033F]/10 text-center text-[#F7F7F7]/60 text-sm">
    &copy; {new Date().getFullYear()} SkillScale. All Rights Reserved.
  </div>
      </footer>
    </div>
  );
};

export default AppraisalPage;