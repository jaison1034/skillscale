import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useUser } from "../../context/UserContext";
import rImg from "../../assets/images.png";
import bImg from "../../assets/review.jpg";
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../axiosInstance";
import { FaChartLine, FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import img from '../../assets/images.png';

const ReviewPage = () => {
  const { user } = useUser();
  const [employees, setEmployees] = useState([]);
  const [completedReviews, setCompletedReviews] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [newReview, setNewReview] = useState({ employee: "", feedback: "" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchEmployees();
      fetchReviews();
    }
  }, [user]);

  // Fetch Employees for Review Submission
  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get("/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axiosInstance.get(`/review/reviews/${user.id}`);
      console.log("Reviews API Response:", data);

      // Ensure the response contains the correct structure
      if (data && data.pending) {
        setPendingReviews(data.pending);
      } else {
        setPendingReviews([]);
      }

      if (data && data.completed) {
        setCompletedReviews(data.completed);
      } else {
        setCompletedReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setCompletedReviews([]);
      setPendingReviews([]);
    }
  };

  // Handle Review Submission
  const handleReviewSubmit = async () => {
    if (newReview.employee && newReview.feedback) {
      try {
        const response = await axiosInstance.put(
          `/review/${newReview.employee}/review`,
          {
            reviewerId: user.id,
            feedback: newReview.feedback,
          }
        );

        console.log(response.data);
         toast.success("Review Submitted!", { position: "top-right" });

        // Refresh reviews
        fetchReviews();
        setNewReview({ employee: "", feedback: "" });
      } catch (error) {
        console.error("Error submitting review:", error.response ? error.response.data : error.message);
      }
    } else {
      console.error("Employee or feedback is missing.");
    }
  };

  return (
    <>
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
      
      {/* Review Section */}
      <div className="bg-cover bg-center min-h-screen relative pt-4 "
          style={{ backgroundImage: `url(${bImg})` }}>
        <h2 className="text-2xl font-bold text-center text-[#3674B5] mb-6 pb-4">Employee Reviews</h2>
        <div className="grid grid-cols-3 gap-6 pl-4 pr-4">
          {/* Add Review */}
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold text-[#3674B5] mb-4">Add Review</h3>
            <select className="w-full p-2 border border-gray-300 rounded mb-4"
              value={newReview.employee}
              onChange={(e) => setNewReview({ ...newReview, employee: e.target.value })}>
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
            <textarea className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Write your review here..."
              value={newReview.feedback}
              onChange={(e) => setNewReview({ ...newReview, feedback: e.target.value })}></textarea>
            <button className="w-full bg-[#3674B5] text-white py-2 rounded-lg" onClick={handleReviewSubmit}>Submit Review</button>
          </div>

          {/* Completed Reviews */}
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3>✅ Completed Reviews</h3>
            {completedReviews.length > 0 ? (
              <ul>
                {completedReviews.map((review) => (
                  <div key={review._id}>
                    <li className="border-b py-2">
                      {review.reviewedId.name} - Score: <strong>{review.score}/10</strong>
                    </li>
                  </div>
                ))}
              </ul>
            ) : (
              <p>No completed reviews</p>
            )}
          </div>

          {/* Pending Reviews */}
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3>📅 Pending Reviews</h3>
            {pendingReviews.length > 0 ? (
              <ul>
                {pendingReviews.map((review) => (
                  <div key={review._id}>
                    <li className="border-b py-2">{review.reviewedId.name}</li>
                  </div>
                ))}
              </ul>
            ) : (
              <p>No pending reviews</p>
            )}
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
                  📧 info@skillscale.com
                </li>
                <li className="flex items-center">
                  📞 6282645889
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
    </>
  );
};

export default ReviewPage;
