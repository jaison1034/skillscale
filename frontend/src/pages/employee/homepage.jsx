import React, { useState } from "react";
import img from '../../assets/images.png';
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaPhone, FaChartLine } from "react-icons/fa";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import logo from "../../assets/logo.webp";
import { motion } from "framer-motion";
import dashboardImage from "../../assets/home1.webp";

function HomePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <div className="bg-black min-h-screen">
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
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    {/* Left Side - Image (without box/border) */}
                    <motion.div 
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="w-full md:w-1/2"
                    >
                        <img 
                            src={dashboardImage} 
                            alt="SkillScale Dashboard" 
                            className="rounded-xl transform hover:scale-[1.02] transition-transform duration-500"
                        />
                    </motion.div>

                    {/* Right Side - Content */}
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="w-full md:w-1/2 space-y-8"
                    >
                        <motion.h2 
                            variants={itemVariants}
                            className="text-5xl font-bold text-white"
                        >
                            Elevate Performance with <span class=" text-2xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">SkillScale</span>
                        </motion.h2>

                        <motion.p 
                            variants={itemVariants}
                            className="text-xl text-gray-300"
                        >
                            Transform your workforce with cutting-edge performance management.
                        </motion.p>

                        <motion.p 
                            variants={itemVariants}
                            className="text-lg text-gray-400"
                        >
                            Streamline appraisals and unlock your team's potential with intuitive analytics.
                        </motion.p>

                        
                    </motion.div>
                </div>

                {/* Features Section */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {[
                        {
                            title: "Real-time Analytics",
                            description: "Instant insights into employee performance metrics.",
                            icon: "📊"
                        },
                        {
                            title: "360° Feedback",
                            description: "Holistic evaluations from all stakeholders.",
                            icon: "🔄"
                        },
                        {
                            title: "Goal Tracking",
                            description: "Structured framework for objective management.",
                            icon: "🎯"
                        }
                    ].map((feature, index) => (
                        <div 
                            key={index}
                            className="bg-[#0F0F0F] p-6 rounded-xl hover:border-[#EA033F]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#EA033F]/10"
                        >
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </div>
                    ))}
                </motion.div>
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
}

export default HomePage;