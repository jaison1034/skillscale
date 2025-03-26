import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import img from "../../assets/images.png";
import { FaChartLine } from "react-icons/fa";
import gImg from "../../assets/goalb.avif";
import axios from "axios";
import { useUser } from "../../context/UserContext"; // Import User Context
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaPhone} from "react-icons/fa";
import axiosInstance from "../../axiosInstance";
import { Link } from 'react-router-dom';
const GoalManagement = () => {
  const [goals, setGoals] = useState([]);
  const [completedGoals, setCompletedGoals] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user && user._id) {  // Changed from user.id to user._id
      console.log("User detected, fetching goals...", user._id);
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      console.log("Fetching goals for user ID:", user._id);
      const response = await axiosInstance.get(`/goals/employee/${user._id}`);  // Changed to _id
      
      console.log("Full response data:", response.data);
      
      if (!Array.isArray(response.data)) {
        console.error("Invalid response format:", response.data);
        return;
      }
      
      setGoals(response.data.filter(goal => !goal.completed));
      setCompletedGoals(response.data.filter(goal => goal.completed));
    } catch (error) {
      console.error("Detailed error:", {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
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
      <Navbar className="bg-white shadow-md p-0 m-0">
        <Container fluid>
          <Navbar.Brand href="/" className="flex items-center">
            <FaChartLine className="text-blue-600 text-3xl" />
            <h1 className="text-2xl font-bold text-[#3674B5] ml-2">SkillScale</h1>
          </Navbar.Brand>
          <Nav className="ml-auto flex items-center">
            <Nav.Link as={Link} to="/home">HOME</Nav.Link>
            <Nav.Link as={Link} to="/feedback">FEEDBACK</Nav.Link>
            <Nav.Link as={Link} to="/Appraisal">APPRAISAL DASHBOARD</Nav.Link>
            <Nav.Link as={Link} to="/review">REVIEW</Nav.Link>

            {/* Profile Dropdown */}
            <NavDropdown
              title={<img src={img} alt="Profile" className="rounded-full" width="40" height="40" />}
              id="basic-nav-dropdown"
              align="end"
            >
              <NavDropdown.Item as={Link} to="/prof">🧑‍💼 Profile</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/login">⬅️ Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>

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
