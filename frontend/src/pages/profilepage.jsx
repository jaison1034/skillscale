import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import axiosInstance from "../axiosInstance";

import logo from "../assets/logo.webp"; // Update path
import img from "../assets/images.png";
import { NavLink } from "react-router-dom";
import { 
    FaChartLine, FaBars, FaTimes, FaEnvelope, 
    FaPhone, FaFacebook, FaTwitter, FaLinkedin, 
    FaMapMarkerAlt 
  } from "react-icons/fa";

const ProfilePage = () => {
  const { user } = useUser();
  const [employee, setEmployee] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        try {
          const response = await axiosInstance.get(`/profile/${user.id}`);
          // Ensure the profile picture URL is secure (HTTPS)
          const profileData = response.data;
          if (profileData.profilePicture && profileData.profilePicture.startsWith('http://')) {
            profileData.profilePicture = profileData.profilePicture.replace('http://', 'https://');
          }
          setEmployee(profileData);
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      }
    };
  
    fetchProfile();
  }, [user, image]);

  const handleImageUpload = async () => {
    if (!image) {
      alert('Please select an image first');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', image);
  
    setLoading(true);
    try {
      const res = await axiosInstance.put(`/profile/${user.id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setEmployee(prev => ({ 
        ...prev, 
        profilePicture: res.data.profilePicture 
      }));
      
      // Clear the file input
      setImage(null);
    } catch (err) {
      console.error('Error uploading image:', err);
      alert(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };
  if (!employee) return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0E17] to-[#1A1B2F] flex items-center justify-center">
      <div className="animate-pulse text-xl text-white">Loading profile...</div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0F0E17] to-[#1A1B2F]">
      {/* Navbar */}
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
           {["GOAL", "FEEDBACK", "APPRAISALPAGE", "REVIEW"].map((path, index) => (
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
      <main className="flex-grow">
        <div className="min-h-[calc(100vh-160px)] w-full bg-gradient-to-br from-[#1E1E2F] via-[#2C2C3A] to-[#1B1B2A] text-white flex flex-col items-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-6xl backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl rounded-2xl p-8 sm:p-12 transition-all duration-500 hover:shadow-[0_10px_30px_rgba(234,3,63,0.2)]">
            <h1 className="text-4xl sm:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-[#EA033F] via-[#FB5607] to-[#EA033F] text-transparent bg-clip-text animate-fadeIn">
              My Profile
            </h1>

            <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center space-y-6">
                <div className="relative group">
                <img
  src={employee.profilePicture 
    ? employee.profilePicture.replace('http://', 'https://') 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=EA033F&color=fff&size=256`}
  alt="Profile"
  className="w-44 h-44 sm:w-52 sm:h-52 rounded-full object-cover border-4 border-[#FB5607] shadow-lg transition-all duration-300 group-hover:scale-105"
  onError={(e) => {
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=EA033F&color=fff&size=256`;
  }}
/>
                  <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <label className="cursor-pointer p-3 bg-[#EA033F] rounded-full hover:bg-[#FB5607] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                
                {image && (
                  <button
                    onClick={handleImageUpload}
                    disabled={loading}
                    className="relative overflow-hidden bg-gradient-to-r from-[#EA033F] to-[#FB5607] hover:from-[#FB5607] hover:to-[#EA033F] px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-[0_5px_15px_rgba(251,86,7,0.4)]"
                  >
                    {loading ? (
                      <>
                        <span className="relative z-10 flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-[#EA033F] to-[#FB5607] opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                      </>
                    ) : (
                      "Update Profile Picture"
                    )}
                  </button>
                )}
              </div>

              {/* Profile Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {[
                  { label: "Name", value: employee.name, icon: "👤" },
                  { label: "Email", value: employee.email, icon: "✉️" },
                  { label: "Department", value: employee.department, icon: "🏢" },
                  { label: "Position", value: employee.position, icon: "💼" },
                  { 
                    label: "Performance Score", 
                    value: (
                      <div className="flex items-center">
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mr-2">
                          <div 
                            className="h-2.5 rounded-full bg-gradient-to-r from-[#EA033F] to-[#FB5607]" 
                            style={{ width: `${employee.performanceScore}%` }}
                          ></div>
                        </div>
                        <span>{employee.performanceScore}%</span>
                      </div>
                    ), 
                    icon: "📊" 
                  },
                  { 
                    label: "Attendance", 
                    value: (
                      <div className="flex items-center">
                        <span className="mr-2">{employee.attendance?.present ?? 0}/{employee.attendance?.total ?? 0}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-[#EA033F]/20 text-[#FB5607]">
                          {employee.attendance?.total ? Math.round((employee.attendance.present / employee.attendance.total) * 100) : 0}%
                        </span>
                      </div>
                    ), 
                    icon: "📅" 
                  },
                ].map(({ label, value, icon }, i) => (
                  <div key={i} className="bg-[#1A1B2F]/50 p-4 rounded-xl border border-[#EA033F]/10 hover:border-[#FB5607]/30 transition-colors duration-300">
                    <div className="flex items-center mb-2">
                      <span className="mr-2 text-lg">{icon}</span>
                      <h3 className="font-semibold text-white/90">{label}</h3>
                    </div>
                    <div className="pl-7 text-white/80">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#140000] text-white py-12">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img src={logo} alt="SkillScale Logo" className="h-12 w-auto object-contain" />
            </div>
            <p className="text-[#F7F7F7]/80">
              Empowering growth through continuous performance tracking.
            </p>
            <div className="flex space-x-4 md:hidden">
              <a href="https://facebook.com" className="text-[#F7F7F7]/70 hover:text-[#EA033F] transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-[#F7F7F7]/70 hover:text-[#EA033F] transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="https://linkedin.com" className="text-[#F7F7F7]/70 hover:text-[#EA033F] transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#F7F7F7] border-b border-[#EA033F]/30 pb-2">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaEnvelope className="text-[#FB5607] mt-1 mr-3 flex-shrink-0" />
                <span>info@skillscale.com</span>
              </li>
              <li className="flex items-start">
                <FaPhone className="text-[#FB5607] mt-1 mr-3 flex-shrink-0" />
                <span>+91 6282645889</span>
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-[#FB5607] mt-1 mr-3 flex-shrink-0" />
                <span>CyberPark, Kozhikode, India</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#F7F7F7] border-b border-[#EA033F]/30 pb-2">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="bg-[#140000] p-3 rounded-full border border-[#EA033F]/20 hover:bg-[#EA033F]/10 hover:border-[#EA033F]/50 transition-all">
                <FaFacebook size={20} className="text-[#F7F7F7] hover:text-[#EA033F]" />
              </a>
              <a href="https://twitter.com" className="bg-[#140000] p-3 rounded-full border border-[#EA033F]/20 hover:bg-[#EA033F]/10 hover:border-[#EA033F]/50 transition-all">
                <FaTwitter size={20} className="text-[#F7F7F7] hover:text-[#EA033F]" />
              </a>
              <a href="https://linkedin.com" className="bg-[#140000] p-3 rounded-full border border-[#EA033F]/20 hover:bg-[#EA033F]/10 hover:border-[#EA033F]/50 transition-all">
                <FaLinkedin size={20} className="text-[#F7F7F7] hover:text-[#EA033F]" />
              </a>
              <a href="mailto:info@skillscale.com" className="bg-[#140000] p-3 rounded-full border border-[#EA033F]/20 hover:bg-[#EA033F]/10 hover:border-[#EA033F]/50 transition-all">
                <FaEnvelope size={20} className="text-[#F7F7F7] hover:text-[#EA033F]" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-[#EA033F]/10 text-center text-[#F7F7F7]/60 text-sm">
          &copy; {new Date().getFullYear()} SkillScale. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default ProfilePage;