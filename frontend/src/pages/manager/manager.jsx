import { useState } from "react";
import { FaTachometerAlt, FaBullseye, FaComment } from "react-icons/fa";
import { MdReviews } from "react-icons/md";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link, Outlet, useNavigate } from "react-router-dom";
import img from "../../assets/images.png";
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope,FaChartLine , FaPhone} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import bImg from '../../assets/managerb.jpg';
import logo from "../../assets/logo.webp";
import { FaMapMarkerAlt } from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("/admin");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, key: "/manager" },
    { name: "🌟performance-review", key: "/manager/marev" },
    { name: "🏹goal-tracking", key: "/manager/goals" },
    { name: "📢Assessment", key: "/manager/feedbacka" },
    { name: "📊Analytics", key:"/manager/Analytics"  },
    { name: "👥Dashboard", key: "/manager/dashboard" },
  ];

  const handleTabClick = (path) => {
    setActiveTab(path);
    navigate(path);
    setIsSidebarOpen(false); // Close sidebar on mobile
  };

  return (
    <div
  className="min-h-screen flex flex-col"
  style={{
    background: "linear-gradient(135deg, #FF6B81 0%, #FF8C42 50%, #FFD97D 100%)",
    backgroundAttachment: "fixed"
  }}
>
      {/* Navbar */}
      <Navbar className="bg-[#140000] shadow-md border-b border-[#EA033F]/20 p-0 m-0">
        <Container fluid className="flex items-center justify-between px-4 py-2">
          {/* Logo & Toggle Button */}
          <div className="flex items-center">
            <button 
              className="lg:hidden p-2 text-[#F7F7F7]" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <GiHamburgerMenu size={24} className="hover:text-[#FB5607] transition-colors" />
            </button>
    
            <div className="flex items-center ml-2">
              <img
                src={logo}
                alt="SkillScale Logo"
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>
    
          {/* Profile Dropdown */}
          <Nav>
           <NavDropdown 
               title={
                 <img 
                   src={img} 
                   alt="Profile" 
                   className="rounded-full border-2 border-[#FB5607]" 
                   width="40" 
                   height="40" 
                 />
               } 
               id="basic-nav-dropdown" 
               align="end"
               className="text-white"
               menuVariant="dark" // Applies dark Bootstrap styling
               style={{ backgroundColor: 'black' }} // For outer dropdown styling
             >
               <NavDropdown.Item 
                 href="#profile" 
                 className="hover:bg-[#FB5607]/10 text-white"
                 style={{ backgroundColor: 'black' }}
               >
                 <span className="text-white">🧑‍💼 Profile</span>
               </NavDropdown.Item>
           
           <NavDropdown.Item 
             onClick={() => navigate('/login')} 
             className="hover:bg-[#FB5607]/10 text-white cursor-pointer"
             style={{ backgroundColor: 'black' }}
           >
             <span className="text-white">⬅️ Logout</span>
           </NavDropdown.Item>
             </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
    
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`fixed lg:relative top-0 left-0 w-64 bg-[#140000] text-[#F7F7F7] p-4 transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:block h-full lg:h-auto z-50 border-r border-[#EA033F]/20`}>
          <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text border-b border-[#EA033F]/30 pb-3">Manager Panel</h2>
          <nav className="flex flex-col space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleTabClick(item.key)}
                className={`flex items-center space-x-2 p-3 w-full text-left rounded-md transition-all duration-200 ${
                  activeTab === item.key
                    ? "bg-gradient-to-r from-[#EA033F] to-[#FB5607] text-white shadow-md"
                    : "hover:bg-[#FB5607]/10 hover:text-white text-[#F7F7F7]/90"
                }`}
              >
                <span className={activeTab === item.key ? "text-white" : "text-[#FB5607]"}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
    
        {/* Content Area */}
        <div className="flex-1 p-6 backdrop-blur-sm">
          <p className="text-4xl text-left bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text mb-6 font-bold drop-shadow-lg">Manager Dashboard</p>
          <div className="backdrop-blur-lg bg-[#140000]/60 rounded-lg shadow-xl p-6 border border-[#EA033F]/20">
            <Outlet />
          </div>
        </div>
      </div>
    
      <footer className="bg-[#140000] text-[#F7F7F7] py-8 border-t border-[#EA033F]/30">
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
};

export default AdminDashboard;
