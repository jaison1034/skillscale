import './Login.css';
import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import loginImage from '../../assets/login_back.jpg';
import { FaEyeSlash, FaEye, FaChartLine } from "react-icons/fa";
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from '../../axiosInstance';


const Login = () => {
  const [loginData, setLoginData] = useState({
    name: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useUser(); // Change from `login` to `setUser`
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    console.log("Login data being sent:", {
      name: loginData.name,
      password: loginData.password,
    });
  
    try {
      const response = await axiosInstance.post("/auth/login", {
        name: loginData.name,
        password: loginData.password,
      });
      
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Use setUser instead of login
        setUser(response.data.user);

        toast.success("Login successful!", { position: "top-right" });
        if (response.data.user.role === "admin") navigate("/admin");
        else if (response.data.user.role === "manager") navigate("/manager");
        else navigate("/home");
      } else {
        toast.error("Login failed!", { position: "top-right" });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Username or Password wrong. Please try again.", { position: "top-right" });
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#D1F8EF] to-[#A1E3F9] min-h-screen flex items-center justify-center relative">
      <div className="absolute top-6 left-6 flex items-center space-x-2 z-10">
        <FaChartLine className="text-blue-600 text-3xl" />
        <h1 className="text-2xl font-bold text-[#3674B5]">SkillScale</h1>
      </div>

      <div className="hidden lg:block w-1/2 h-screen overflow-hidden z-0">
        <img 
          src={loginImage} 
          alt="SkillScale" 
          className="w-full h-full object-cover transform scale-110" 
        />
      </div>

      <div className="w-full lg:w-1/2 flex justify-center items-center p-8 z-20">
        <div className="text-left max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 border border-[#578FCA]">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Login to Your Account</h2>

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-[#3674B5] font-medium mb-2">Name:</label>
              <input 
                type="text"
                name="name"
                value={loginData.name} 
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-[#A1E3F9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#578FCA] transition-all"
                required
              />
            </div>

            <div className="mb-6 relative">
              <label className="block text-[#3674B5] font-medium mb-2">Password:</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-[#A1E3F9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#578FCA] transition-all pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#3674B5] text-white py-3 rounded-lg hover:bg-[#578FCA] transition-all font-semibold"
            >
              Sign In
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#3674B5] hover:underline font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
