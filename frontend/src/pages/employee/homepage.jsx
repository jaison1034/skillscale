import React, { useState, useEffect } from "react";
import img from '../../assets/images.png';
import bimg from '../../assets/homeb.jpg';
import simg from '../../assets/home.jpg';
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaPhone, FaChartLine} from "react-icons/fa";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function HomePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
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
                       {["HOME","GOAL", "FEEDBACK", "APPRAISAL", "REVIEW"].map((path, index) => (
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
      <div
        className="bg-cover bg-center min-h-screen flex flex-col items-center justify-center"
        style={{ backgroundImage: `url(${bimg})`}} // Replace with your background image URL
      >
         
        <section className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-4xl font-bold text-blue-800 mb-4">Welcome to the SkillScale</h2>
          <p className="text-lg text-gray-700 max-w-2xl mb-6">
            SkillScale is designed to help organizations track, evaluate, and improve employee performance. With our system, you can set goals, provide feedback, and generate detailed reports to ensure continuous growth and development.
          </p>
          <p className="text-lg text-gray-700 max-w-2xl mb-6">
            Whether you're a manager looking to assess your team's performance or an employee seeking to understand your progress, our platform provides the tools you need to succeed. Explore our features and take the first step towards a more efficient and transparent appraisal process.
          </p>
          
        </section>
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
    </>
  );
}

export default HomePage;

