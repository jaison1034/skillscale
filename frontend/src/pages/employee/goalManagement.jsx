import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import img from "../../assets/images.png";
import gImg from "../../assets/goalb.avif";
import axios from "axios";
import { useUser } from "../../context/UserContext"; // Import User Context
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaPhone} from "react-icons/fa";
import axiosInstance from "../../axiosInstance";
import { NavLink } from "react-router-dom";
import { FaChartLine, FaBars, FaTimes } from "react-icons/fa";

const GoalManagement = () => {
  const [goals, setGoals] = useState([]); // Pending goals
  const [completedGoals, setCompletedGoals] = useState([]); // Completed goals
  const { user } = useUser(); // Get logged-in user from context
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  console.log("Logged-in user:", user); // Debugging

  // Fetch goals when the user is available
  useEffect(() => {
    // Debugging
    if (user && user.id) {
      console.log("User detected, fetching goals...", user.id);
      fetchGoals();
    }
  }, [user]); // Runs only when `user` is updated

  // Fetch employee goals from API
  const fetchGoals = async () => {
    try {
      console.log("Fetching goals for user ID:", user._id);
      const response = await axiosInstance.get(`/goals/employee/${user.id}`);
      console.log("API Response:", response);  // Check API Response
  
      if (!Array.isArray(response.data)) {
        console.error("Invalid response format:", response.data);
        return;
      }
  
      // Filter goals based on completion status
      setGoals(response.data.filter(goal => !goal.completed)); // Pending goals
      setCompletedGoals(response.data.filter(goal => goal.completed)); // Completed goals
  
    } catch (error) {
      console.error("❌ Error fetching goals:", error.response?.data || error.message);
    }
  };

  // Mark goal as completed
  const markGoalAsCompleted = async (goalId) => {
    try {
      const response = await axiosInstance.put(
        `/goals/complete/${goalId}`,
        {}, // Empty body
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedGoal = response.data;

        // Update UI
        setGoals((prev) => prev.filter((goal) => goal._id !== goalId));
        setCompletedGoals((prev) => [...prev, updatedGoal]);
      }
    } catch (error) {
      console.error("❌ Error marking goal as completed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
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
                               {["HOME","GOAL", "FEEDBACK", "APPRAISALPAGE", "REVIEW"].map((path, index) => (
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
                <NavLink 
                  to="/prof" 
                  onClick={() => setIsProfileOpen(false)} 
                  className="no-underline"
                  style={{ textDecoration: "none" }}
                >
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
                    🧑‍💼 Profile
                  </button>
                </NavLink>
                <NavLink 
                  to="/login" 
                  onClick={() => setIsProfileOpen(false)} 
                  className="no-underline"
                  style={{ textDecoration: "none" }}
                >
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
                             {["GOAL", "FEEDBACK", "APPRAISAL", "REVIEW"].map((path, index) => (
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
                                 <NavLink to="/prof" onClick={() => setIsMenuOpen(false)}
                                 className="no-underline"
                                 style={{ textDecoration: "none" }}>
                                   <button className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-200">
                                     🧑‍💼 Profile
                                   </button>
                                 </NavLink>
                                 <NavLink to="/login" onClick={() => setIsMenuOpen(false)}
                                 className="no-underline"
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

      {/* Goal Management Section */}
      <div className="bg-cover bg-center min-h-screen pt-4" style={{ backgroundImage: `url(${gImg})` }}>
        <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Completed Goals */}
          <div className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-green-600">✅ Completed Goals</h2>
            {completedGoals.length === 0 ? (
              <p className="text-gray-500">No goals completed yet.</p>
            ) : (
              completedGoals.map((goal) => (
                <div key={goal._id} className="p-4 rounded-lg bg-green-100 mb-3 border-l-4 border-green-500 shadow-sm transition-all duration-300 hover:bg-green-50">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-green-800">{goal.title}</p>
                    <p className="text-sm text-gray-500">
                      Completed on: {new Date(goal.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pending Goals */}
          <div className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-yellow-600">⚠️ Pending Goals</h2>
            {goals.length > 0 ? (
              goals.map((goal) => (
                <div key={goal._id} className="p-4 rounded-lg bg-yellow-100 mb-3 border-l-4 border-yellow-500 shadow-sm transition-all duration-300 hover:bg-yellow-50">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-yellow-800">{goal.title}</p>
                    <p className="text-sm text-gray-500">Due by: {new Date(goal.dueDate).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => markGoalAsCompleted(goal._id)}
                    className="mt-3 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                  >
                    Mark as Completed
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No active goals.</p>
            )}
          </div>

          {/* Calendar */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">📅 Upcoming Goals </h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-600 mb-2">Upcoming Goals:</p>
              {goals.length > 0 ? (
                goals.map((goal) => {
                  const dueDate = new Date(goal.dueDate);
                  const today = new Date();
                  const diffTime = dueDate - today;
                  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Days remaining

                  return (
                    <div
                      key={goal._id}
                      className="p-4 mb-4 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {/* Goal Icon */}
                          <FaChartLine className="text-blue-500 text-xl" />
                          <span className="font-semibold text-gray-700">{goal.title}</span>
                        </div>
                        
                        {/* Countdown Timer */}
                        <span
                          className={`text-sm font-semibold ${
                            daysLeft <= 5 ? "text-red-500" : "text-green-500"
                          }`}
                        >
                          {daysLeft <= 0 ? "Due Today!" : `${daysLeft} days left`}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="relative pt-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                                In Progress
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">{daysLeft <= 0 ? "Completed!" : `Due in ${daysLeft} days`}</span>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full">
                            <div
                              className="bg-teal-500 text-xs font-medium text-teal-100 text-center p-0.5 leading-none rounded-full"
                              style={{
                                width: `${Math.min(100, Math.max(0, (100 - daysLeft) / 100 * 100))}%`,
                              }}
                            >
                              {/* The width of this progress bar will represent the percentage of completion */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">No upcoming goals.</p>
              )}
            </div>
          </div>

        </div>
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

export default GoalManagement;
