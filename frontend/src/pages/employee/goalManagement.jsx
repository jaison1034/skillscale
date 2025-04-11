import React, { useState, useEffect } from "react";
import img from '../../assets/images.png';
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaPhone, FaChartLine } from "react-icons/fa";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import logo from "../../assets/logo.webp";
import { motion } from "framer-motion";
import { useUser } from "../../context/UserContext";
import axiosInstance from "../../axiosInstance";

const GoalManagement = () => {
    const [goals, setGoals] = useState([]);
    const [completedGoals, setCompletedGoals] = useState([]);
    const { user } = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        if (user && user.id) {
            fetchGoals();
        }
    }, [user]);

    const fetchGoals = async () => {
        try {
            const response = await axiosInstance.get(`/goals/employee/${user.id}`);
            if (Array.isArray(response.data)) {
                setGoals(response.data.filter(goal => !goal.completed));
                setCompletedGoals(response.data.filter(goal => goal.completed));
            }
        } catch (error) {
            console.error("Error fetching goals:", error);
        }
    };

    const markGoalAsCompleted = async (goalId) => {
        try {
            const response = await axiosInstance.put(`/goals/complete/${goalId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (response.status === 200) {
                const updatedGoal = response.data;
                setGoals(prev => prev.filter(goal => goal._id !== goalId));
                setCompletedGoals(prev => [...prev, updatedGoal]);
            }
        } catch (error) {
            console.error("Error marking goal as completed:", error);
        }
    };

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
      {["GOAL", "FEEDBACK", "APPRAISAL", "REVIEW"].map((path, index) => (
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
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold text-white mb-12 text-center"
                >
                 <span class=" text-4xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">Goals Dashboard</span>
                </motion.h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Pending Goals */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-[#0F0F0F] p-6 rounded-xl border border-[#1F1F1F] hover:border-[#EA033F]/50 transition-all duration-300"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="w-3 h-3 bg-[#FB5607] rounded-full mr-3"></span>
                            Pending Goals
                        </h2>
                        {goals.length > 0 ? (
                            <div className="space-y-4">
                                {goals.map((goal) => {
                                    const dueDate = new Date(goal.dueDate);
                                    const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
                                    
                                    return (
                                        <div key={goal._id} className="bg-[#1A1A1A] p-4 rounded-lg border-l-4 border-[#FB5607] hover:bg-[#252525] transition-all duration-300">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-white">{goal.title}</h3>
                                                    <p className="text-sm text-gray-400 mt-1">
                                                        Due: {dueDate.toLocaleDateString()} 
                                                        <span className={`ml-2 ${daysLeft <= 3 ? 'text-[#EA033F]' : 'text-[#FB5607]'}`}>
                                                            ({daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'})
                                                        </span>
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => markGoalAsCompleted(goal._id)}
                                                    className="text-xs bg-[#FB5607] hover:bg-[#EA033F] text-white py-1 px-3 rounded transition-colors duration-300"
                                                >
                                                    Complete
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No pending goals at the moment.</p>
                        )}
                    </motion.div>

                    {/* Completed Goals */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-[#0F0F0F] p-6 rounded-xl border border-[#1F1F1F] hover:border-[#EA033F]/50 transition-all duration-300"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                            Completed Goals
                        </h2>
                        {completedGoals.length > 0 ? (
                            <div className="space-y-4">
                                {completedGoals.map((goal) => (
                                    <div key={goal._id} className="bg-[#1A1A1A] p-4 rounded-lg border-l-4 border-green-500 hover:bg-[#252525] transition-all duration-300">
                                        <h3 className="font-semibold text-white">{goal.title}</h3>
                                        <p className="text-sm text-gray-400 mt-1">
                                            Completed on: {new Date(goal.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No completed goals yet.</p>
                        )}
                    </motion.div>

                    {/* Progress Overview */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="bg-[#0F0F0F] p-6 rounded-xl border border-[#1F1F1F] hover:border-[#EA033F]/50 transition-all duration-300"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                            Progress Overview
                        </h2>
                        
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm text-gray-400 mb-2">
                                    <span>Completion Rate</span>
                                    <span>{completedGoals.length}/{goals.length + completedGoals.length} goals</span>
                                </div>
                                <div className="w-full bg-[#1A1A1A] rounded-full h-2.5">
                                    <div 
                                        className="bg-gradient-to-r from-[#EA033F] to-[#FB5607] h-2.5 rounded-full" 
                                        style={{ 
                                            width: `${Math.round((completedGoals.length / (goals.length + completedGoals.length)) * 100) || 0}%` 
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-white mb-3">Upcoming Deadlines</h4>
                                {goals.length > 0 ? (
                                    <div className="space-y-3">
                                        {goals
                                            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                                            .slice(0, 3)
                                            .map(goal => {
                                                const dueDate = new Date(goal.dueDate);
                                                const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
                                                
                                                return (
                                                    <div key={goal._id} className="flex items-center">
                                                        <div className={`w-2 h-2 rounded-full mr-3 ${daysLeft <= 3 ? 'bg-[#EA033F]' : 'bg-[#FB5607]'}`}></div>
                                                        <div className="flex-1">
                                                            <p className="text-sm text-white">{goal.title}</p>
                                                            <p className="text-xs text-gray-400">
                                                                Due in {daysLeft} days • {dueDate.toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm italic">No upcoming deadlines</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            
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
      <h4 className="text-lg font-semibold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text border-b border-[#EA033F]/30 pb-2">
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
      <h3 className="text-lg font-semibold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text border-b border-[#EA033F]/30 pb-2">
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

export default GoalManagement;