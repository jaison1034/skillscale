import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import imgn from '../../assets/feedback.avif';
import img from "../../assets/images.png";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../../context/UserContext";
import { FaChartLine, FaBars, FaTimes } from "react-icons/fa";
import { FaEnvelope, FaPhone, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import axiosInstance from "../../axiosInstance";
import { NavLink } from "react-router-dom";

const EmployeeSelfAssessment = () => {
  const { user } = useUser();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [completedAssessments, setCompletedAssessments] = useState([]);
  const [pendingAssessments, setPendingAssessments] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
      toast.error("Failed to load categories");
    }
  };

  const fetchCompletedAssessments = async () => {
    if (!user?.id) return;
    try {
      const response = await axiosInstance.get(
        `/self-assessment/get-completed-assessments/${user.id}`
      );
      setCompletedAssessments(response.data);
    } catch (error) {
      console.error("Error fetching completed assessments", error);
      toast.error("Failed to load completed assessments");
    }
  };

  const fetchPendingAssessments = async () => {
    if (!user?.id) return;
    try {
      const response = await axiosInstance.get(
        `/self-assessment/get-pending-assessments/${user.id}`
      );
      setPendingAssessments(response.data);
    } catch (error) {
      console.error("Error fetching pending assessments", error);
      toast.error("Failed to load pending assessments");
    }
  };

  const fetchQuestions = async (category) => {
    try {
      const response = await axiosInstance.get(
        `/self-assessment/get-questions/${category}`
      );
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions", error);
      toast.error("Failed to load questions");
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSaveAnswers = async () => {
    if (!user || !user.id) {
      toast.error("You must be logged in to save answers.", { position: "top-right" });
      return;
    }

    try {
      for (const questionId in answers) {
        await axios.post(`http://localhost:5000/api/self-assessment/save-answer/${questionId}`, {
          userId: user.id,
          answer: answers[questionId],
        });
      }

      // Refetch completed and pending assessments to update the UI
      await fetchCompletedAssessments();
      await fetchPendingAssessments();

      // Clear the Attend Assessment card
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
    
        {/* Main Content */}
        <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 flex-grow">
          {/* Completed Assessments */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-green-600">✅ Completed Assessments</h2>
            {completedAssessments.length === 0 ? (
              <p className="text-gray-500">No assessments completed yet.</p>
            ) : (
              completedAssessments.map((category, index) => (
                <div key={index} className="p-4 rounded-lg bg-green-100 mb-3">
                  <p className="font-semibold">{category}</p>
                </div>
              ))
            )}
          </div>
    
          {/* Pending Assessments */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-yellow-600">📅 Pending Assessments</h2>
            {pendingAssessments.length === 0 ? (
              <p className="text-gray-500">No pending assessments.</p>
            ) : (
              pendingAssessments.map((category, index) => (
                <div key={index} className="p-4 rounded-lg bg-yellow-100 mb-3">
                  <p className="font-semibold">{category}</p>
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      fetchQuestions(category);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-lg text-sm"
                  >
                    Attend Assessment
                  </button>
                </div>
              ))
            )}
          </div>
    
          {/* Attend Assessment Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-blue-600">📝 Attend Assessment</h2>
            {selectedCategory ? (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Questions for {selectedCategory}
                </h4>
                <ul className="divide-y divide-gray-300">
                  {questions.length === 0 ? (
                    <p className="text-gray-500">No questions available for this category.</p>
                  ) : (
                    questions.map((q) => (
                      <li key={q._id} className="py-3 px-4 bg-gray-50 rounded-lg shadow-sm mb-2">
                        <div className="flex flex-col space-y-2">
                          <span className="text-gray-700">{q.question}</span>
                          <textarea
                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Enter your answer..."
                            value={answers[q._id] || ""}
                            onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                          />
                        </div>
                      </li>
                    ))
                  )}
                </ul>
                <button
                  onClick={handleSaveAnswers}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all text-lg shadow-md w-full mt-4"
                >
                  Save Answers
                </button>
              </div>
            ) : (
              <p className="text-gray-500">Select a category to attend the assessment.</p>
            )}
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
    </div>
  );
};

export default EmployeeSelfAssessment;