import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import imgn from '../../assets/feedback.avif';
import img from "../../assets/images.png";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../../context/UserContext";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import { FaChartLine, FaBars, FaTimes } from "react-icons/fa";
import { FaEnvelope, FaPhone, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import axiosInstance from "../../axiosInstance";
import { Link } from 'react-router-dom';

const EmployeeSelfAssessment = () => {
  const { user } = useUser();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [completedAssessments, setCompletedAssessments] = useState([]);
  const [pendingAssessments, setPendingAssessments] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      fetchCategories();
      fetchCompletedAssessments();
      fetchPendingAssessments();
    }
  }, [user]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/self-assessment/get-categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchCompletedAssessments = async () => {
    if (!user || !user.id) return;
    try {
      const response = await axiosInstance.get(`/get-completed-assessments/${user.id}`);
      setCompletedAssessments(response.data);
    } catch (error) {
      console.error("Error fetching completed assessments", error);
    }
  };

  const fetchPendingAssessments = async () => {
    if (!user || !user.id) return;
    try {
      const response = await axiosInstance.get(`/self-assessment/get-pending-assessments/${user.id}`);
      setPendingAssessments(response.data);
    } catch (error) {
      console.error("Error fetching pending assessments", error);
    }
  };

  const fetchQuestions = async (category) => {
    try {
      const response = await axiosInstance.get(`/self-assessment/get-questions/${category}`);
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions", error);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSaveAnswers = async () => {
    if (!user || !user.id) {
      toast.error("You must be logged in to save answers.", { position: "top-right" });
      return;
    }

    try {
      for (const questionId in answers) {
        await axiosInstance.post(`/self-assessment/save-answer/${questionId}`, {
          userId: user.id,
          answer: answers[questionId],
        });
      }

      await fetchCompletedAssessments();
      await fetchPendingAssessments();

      setSelectedCategory(null);
      setQuestions([]);
      setAnswers({});

      toast.success("Answers saved successfully!", { position: "top-right" });
    } catch (error) {
      console.error("Error saving answers", error);
      toast.error("Failed to save answers", { position: "top-right" });
    }
  };

  return (
    <div className="bg-cover bg-center min-h-screen flex flex-col" style={{ backgroundImage: `url(${imgn})` }}>
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
    
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Responsive Navbar */}
        <Navbar expand="lg" className="bg-white shadow-md p-0 m-0" expanded={expanded}>
          <Container fluid>
            <Navbar.Brand href="/" className="flex items-center">
              <FaChartLine className="text-blue-600 text-3xl" />
              <h1 className="text-2xl font-bold text-[#3674B5] ml-2">SkillScale</h1>
            </Navbar.Brand>
            
            <Navbar.Toggle 
              aria-controls="basic-navbar-nav" 
              onClick={() => setExpanded(!expanded)}
              className="border-0 focus:outline-none"
            >
              {expanded ? <FaTimes /> : <FaBars />}
            </Navbar.Toggle>
            
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto flex items-center">
                <Nav.Link 
                  as={Link} 
                  to="/home" 
                  className="text-gray-700 hover:text-blue-500 px-3 py-2"
                  onClick={() => setExpanded(false)}
                >
                  HOME
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/goal" 
                  className="text-gray-700 hover:text-blue-500 px-3 py-2"
                  onClick={() => setExpanded(false)}
                >
                  GOAL
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/Appraisal" 
                  className="text-gray-700 hover:text-blue-500 px-3 py-2"
                  onClick={() => setExpanded(false)}
                >
                  APPRAISAL DASHBOARD
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/review" 
                  className="text-gray-700 hover:text-blue-500 px-3 py-2"
                  onClick={() => setExpanded(false)}
                >
                  REVIEW
                </Nav.Link>
                <NavDropdown
                  title={<img src={img} alt="Profile" className="rounded-full" width="40" height="40" />}
                  id="basic-nav-dropdown"
                  align="end"
                  className="px-3 py-2"
                >
                  <NavDropdown.Item as={Link} to="/prof" onClick={() => setExpanded(false)}>🧑‍💼 Profile</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/login" onClick={() => setExpanded(false)}>⬅️ Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
    
        {/* Main Content */}
        <div className="container mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6 flex-grow">
          {/* Completed Assessments */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
            <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-green-600">✅ Completed Assessments</h2>
            {completedAssessments.length === 0 ? (
              <p className="text-gray-500 text-sm md:text-base">No assessments completed yet.</p>
            ) : (
              completedAssessments.map((category, index) => (
                <div key={index} className="p-3 md:p-4 rounded-lg bg-green-100 mb-2 md:mb-3">
                  <p className="font-semibold text-sm md:text-base">{category}</p>
                </div>
              ))
            )}
          </div>
    
          {/* Pending Assessments */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
            <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-yellow-600">📅 Pending Assessments</h2>
            {pendingAssessments.length === 0 ? (
              <p className="text-gray-500 text-sm md:text-base">No pending assessments.</p>
            ) : (
              pendingAssessments.map((category, index) => (
                <div key={index} className="p-3 md:p-4 rounded-lg bg-yellow-100 mb-2 md:mb-3">
                  <p className="font-semibold text-sm md:text-base mb-2">{category}</p>
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      fetchQuestions(category);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-lg text-xs md:text-sm"
                  >
                    Attend Assessment
                  </button>
                </div>
              ))
            )}
          </div>
    
          {/* Attend Assessment Section */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg md:col-span-1">
            <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-blue-600">📝 Attend Assessment</h2>
            {selectedCategory ? (
              <div>
                <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
                  Questions for {selectedCategory}
                </h4>
                <ul className="divide-y divide-gray-300">
                  {questions.length === 0 ? (
                    <p className="text-gray-500 text-sm md:text-base">No questions available for this category.</p>
                  ) : (
                    questions.map((q) => (
                      <li key={q._id} className="py-2 md:py-3 px-2 md:px-4 bg-gray-50 rounded-lg shadow-sm mb-2">
                        <div className="flex flex-col space-y-2">
                          <span className="text-gray-700 text-sm md:text-base">{q.question}</span>
                          <textarea
                            className="p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm md:text-base"
                            placeholder="Enter your answer..."
                            value={answers[q._id] || ""}
                            onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                            rows={3}
                          />
                        </div>
                      </li>
                    ))
                  )}
                </ul>
                <button
                  onClick={handleSaveAnswers}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 md:px-6 md:py-3 rounded-lg transition-all text-sm md:text-base shadow-md w-full mt-3 md:mt-4"
                >
                  Save Answers
                </button>
              </div>
            ) : (
              <p className="text-gray-500 text-sm md:text-base">Select a category to attend the assessment.</p>
            )}
          </div>
        </div>
    
        {/* Footer */}
        <footer className="bg-gray-900 text-white py-4 md:py-6">
          <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-center md:text-left">
            {/* Company Info */}
            <div className="mb-4 md:mb-0">
              <h2 className="text-base md:text-lg font-bold">SkillScale</h2>
              <p className="mt-1 md:mt-2 text-gray-400 text-sm md:text-base">
                Empowering growth through continuous performance tracking.
              </p>
            </div>
    
            {/* Quick Links */}
            <div className="mb-4 md:mb-0">
              <h4 className="text-base md:text-lg font-semibold mb-2 md:mb-4">Contact Us</h4>
              <ul className="space-y-1 md:space-y-2">
                <li className="flex items-center justify-center md:justify-start">
                  <FaEnvelope className="mr-2" size={14} />
                  <span className="text-sm md:text-base">info@skillscale.com</span>
                </li>
                <li className="flex items-center justify-center md:justify-start">
                  <FaPhone className="mr-2" size={14} />
                  <span className="text-sm md:text-base">6282645889</span>
                </li>
                <li className="flex items-center justify-center md:justify-start">
                  <span className="mr-2">📍</span>
                  <span className="text-sm md:text-base">CyberPark, Kozhikode, India</span>
                </li>
              </ul>
            </div>
    
            {/* Contact & Social */}
            <div className="mb-4 md:mb-0">
              <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-4">Connect With Us</h3>
              <div className="flex justify-center md:justify-start space-x-3 md:space-x-4">
                <a href="https://facebook.com" className="text-gray-400 hover:text-white">
                  <FaFacebook size={16} />
                </a>
                <a href="https://twitter.com" className="text-gray-400 hover:text-white">
                  <FaTwitter size={16} />
                </a>
                <a href="https://linkedin.com" className="text-gray-400 hover:text-white">
                  <FaLinkedin size={16} />
                </a>
                <a href="mailto:info@skillscale.com" className="text-gray-400 hover:text-white">
                  <FaEnvelope size={16} />
                </a>
              </div>
            </div>
          </div>
    
          {/* Copyright */}
          <div className="text-center text-gray-500 text-xs md:text-sm border-t border-gray-600 pt-3 mt-4">
            &copy; 2025 SkillScale. All Rights Reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default EmployeeSelfAssessment;