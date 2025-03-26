import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { FaChartLine } from "react-icons/fa";
import { useUser } from "../../context/UserContext";
import rImg from "../../assets/images.png";
import bImg from "../../assets/review.jpg";
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../axiosInstance";
import { Link } from 'react-router-dom';
const ReviewPage = () => {
  const { user } = useUser();
  const [employees, setEmployees] = useState([]);
  const [completedReviews, setCompletedReviews] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [newReview, setNewReview] = useState({ employee: "", feedback: "" });

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
      <Navbar className="bg-white shadow-md p-0 m-0">
        <Container fluid>
          <Navbar.Brand href="/" className="flex items-center">
            <FaChartLine className="text-blue-600 text-3xl" />
            <h1 className="text-2xl font-bold text-[#3674B5] ml-2">SkillScale</h1>
          </Navbar.Brand>
          <Nav className="ml-auto flex items-center">
            <Nav.Link as={Link} to="/home" className="text-gray-700 hover:text-blue-500 px-3">HOME</Nav.Link>
            <Nav.Link as={Link} to="/goal" className="text-gray-700 hover:text-blue-500 px-3">GOAL</Nav.Link>
            <Nav.Link as={Link} to="/feedback" className="text-gray-700 hover:text-blue-500 px-3">FEEDBACK</Nav.Link>
            <Nav.Link as={Link} to="/Appraisal" className="text-gray-700 hover:text-blue-500 px-3">APPRAISAL DASHBOARD</Nav.Link>
            <NavDropdown
              title={
                <img
                  src={rImg}
                  alt="Profile"
                  className="rounded-full"
                  width="40"
                  height="40"
                />
              }
              id="basic-nav-dropdown"
              align="end"
            >
              <NavDropdown.Item as={Link} to="/prof" className="text-gray-700 hover:bg-gray-100">🧑‍💼Profile</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/login" className="text-gray-700 hover:bg-gray-100">⬅️Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
      
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
