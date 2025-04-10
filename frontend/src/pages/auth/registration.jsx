import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaChevronDown, FaChartLine } from "react-icons/fa";
import { User, Mail } from "lucide-react";
import img from '../../assets/people.avif';
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import  { Building } from "lucide-react";
import { FcBusinessman } from "react-icons/fc";
import axiosInstance from "../../axiosInstance";
import logo from "../../assets/logo.webp";

const Registration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    department: "",
    position: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/; // At least 8 chars, 1 letter, 1 number, 1 special char
  const nameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate Full Name
    if (!formData.fullName.match(nameRegex)) {
      newErrors.fullName = "Full name should contain only letters and spaces.";
    }

    // Validate Email
    if (!formData.email.match(emailRegex)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Validate Password
    if (!formData.password.match(passwordRegex)) {
      newErrors.password =
        "Password must be at least 8 characters long, include a number, and a special character.";
    }

    // Validate Confirm Password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
    }

    // Validate Role
    if (!formData.role) {
      newErrors.role = "Please select a role.";
    }

    // Validate Department (if role is manager)
    if (formData.role === "manager" && !formData.department) {
      newErrors.department = "Please enter a department.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      const response = await axiosInstance.post("/auth/register", {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        department: formData.department,
        position: formData.position,
      });

      if (response.status === 201) {
        toast.success("Registration successful!", { position: "top-right" });
        navigate("/login");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong!", { position: "top-right" });
    }
  };

  return (
    <div
    className="min-h-screen flex items-center justify-center relative bg-cover bg-center"
    style={{
      backgroundImage: `url(${img})`,
      filter: "brightness(1.0)",
    }}
  >
    <div className="absolute top-6 left-6">
    <img
      src={logo}
      alt="SkillScale Logo"
      className="h-50 w-30  object-contain"
    />
  </div>
  
    {/* Registration Card */}
    <div className="relative z-10 w-full max-w-md p-8 bg-[#F7F7F7] bg-opacity-90 rounded-xl shadow-xl text-left mt-20">
      <h2 className="text-2xl font-semibold text-[#EA033F] mb-6 text-center">Register</h2>
  
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div className="relative">
          <label className="block text-[#140000] font-medium mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FB5607]" />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA033F] transition-all"
              required
            />
          </div>
          {errors.fullName && (
            <p className="text-[#EA033F] text-sm mt-1">{errors.fullName}</p>
          )}
        </div>
  
        {/* Email */}
        <div className="relative">
          <label className="block text-[#140000] font-medium mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FB5607]" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA033F] transition-all"
              required
            />
          </div>
          {errors.email && (
            <p className="text-[#EA033F] text-sm mt-1">{errors.email}</p>
          )}
        </div>
  
        {/* Password */}
        <div className="relative">
          <label className="block text-[#140000] font-medium mb-2">Password</label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FB5607]" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA033F] transition-all"
              required
            />
          </div>
          {errors.password && (
            <p className="text-[#EA033F] text-sm mt-1">{errors.password}</p>
          )}
        </div>
  
        {/* Confirm Password */}
        <div className="relative">
          <label className="block text-[#140000] font-medium mb-2">Confirm Password</label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FB5607]" />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full px-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA033F] transition-all"
              required
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-[#EA033F] text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>
  
        {/* Role */}
        <div className="relative">
          <label className="block text-[#140000] font-medium mb-2">Role</label>
          <div className="relative">
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FB5607]" />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA033F] transition-all appearance-none"
              required
            >
              <option value="">Select a role</option>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          {errors.role && (
            <p className="text-[#EA033F] text-sm mt-1">{errors.role}</p>
          )}
        </div>
  
        {/* Department */}
        <div className="relative">
          <label className="block text-[#140000] font-medium mb-2">Department</label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FB5607]" />
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Enter your department"
              className="w-full px-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA033F] transition-all"
              required
            />
          </div>
          {errors.department && (
            <p className="text-[#EA033F] text-sm mt-1">{errors.department}</p>
          )}
        </div>
  
        {/* Position */}
        <div className="relative">
          <label className="block text-[#140000] font-medium mb-2">Position</label>
          <div className="relative">
            <FcBusinessman className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FB5607]" />
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Enter your Position"
              className="w-full px-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA033F] transition-all"
              required
            />
          </div>
          {errors.position && (
            <p className="text-[#EA033F] text-sm mt-1">{errors.position}</p>
          )}
        </div>
  
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#EA033F] text-white py-3 rounded-lg hover:bg-[#c20234] transition-all"
        >
          Register
        </button>
      </form>
  
      {/* Login Link */}
      <p className="text-center mt-6 text-[#140000]">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold underline hover:text-[#EA033F] transition-all"
        >
          Login here
        </Link>
      </p>
    </div>
  </div>
  );
};

export default Registration;