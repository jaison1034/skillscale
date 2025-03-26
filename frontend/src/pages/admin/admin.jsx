import { useState } from "react";
import { FaTachometerAlt, FaBullseye, FaComment } from "react-icons/fa";
import { MdReviews } from "react-icons/md";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link, Outlet, useNavigate } from "react-router-dom";
import img from "../../assets/images.png";
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import aImg from '../../assets/admin_b.avif';
import { FaChartLine } from "react-icons/fa";


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("/admin");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle

  const menuItems = [
    
    { name: "Tempalate Management", key: "/admin/goals" },
    { name: "Reports & Analytics",  key: "/admin/feedbacka" },
    { name: "User Management", key: "/admin/empv" },
    { name: "Feedback", key: "/admin/adminf"}
  ];

  const handleTabClick = (path) => {
    setActiveTab(path);
    navigate(path);
    setIsSidebarOpen(false); // Close sidebar on mobile
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar className="bg-white shadow-md p-0 m-0">
        <Container fluid className="flex items-center justify-between px-4 py-2">
          {/* Logo & Toggle Button */}
          <div className="flex items-center">
            <button 
              className="lg:hidden p-2 text-[#3674B5]" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <GiHamburgerMenu size={24} />
            </button>
            <FaChartLine className="text-blue-600 text-3xl" />
              <h1 className="text-2xl font-bold text-[#3674B5] ml-2">SkillScale</h1>
            
          </div>

          {/* Profile Dropdown */}
          <Nav>
            <NavDropdown title={<img src={img} alt="Profile" className="rounded-full" width="40" height="40" />} id="basic-nav-dropdown" align="end">
              <NavDropdown.Item as={Link} to="/prof">🧑‍💼Profile</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/login">⬅️Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>

      {/* Sidebar and Content Wrapper */}
      <div className="flex flex-1">
        {/* Sidebar (Responsive) */}
        <div className={`fixed lg:relative top-0 left-0 w-64 bg-[#3674B5] text-white p-4 transition-transform transform  ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:block h-full lg:h-auto z-50`}>
          <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
          <nav className="flex flex-col space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleTabClick(item.key)}
                className={`flex items-center space-x-2 p-2 w-full text-left hover:bg-[#2a5a8a] rounded-md ${
                  activeTab === item.key ? "bg-[#2a5a8a]" : ""
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 bg-gray-100"style={{ backgroundImage: `url(${aImg})` }}>
          <p className="text-4xl text-left">Welcome to the ADMIN PAGE</p>
          <Outlet />
        </div>
      </div>
       {/* Footer */}
       <div>
       <footer className="bg-gray-900 text-white mt-auto">
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
      
      {/* Company Info */}
      <div>
        <h2 className="text-lg font-bold">SkillScale</h2>
        <p className="mt-2 text-gray-400">Empowering growth through continuous performance tracking.</p>
      </div>

      {/* Contact Info */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
        <ul className="space-y-2">
          <li className="flex items-center justify-center md:justify-start">
            📧 info@skillscale.com
          </li>
          <li className="flex items-center justify-center md:justify-start">
            📞 6282645889
          </li>
          <li className="flex items-center justify-center md:justify-start">
            📍 CyberPark, Kozhikode, India
          </li>
        </ul>
      </div>

      {/* Social Links */}
      <div>
        <h3 className="text-lg font-semibold">Connect With Us</h3>
        <div className="mt-4 flex justify-center md:justify-start space-x-4">
          <a href="https://facebook.com" className="text-gray-400 hover:text-white"><FaFacebook size={20} /></a>
          <a href="https://twitter.com" className="text-gray-400 hover:text-white"><FaTwitter size={20} /></a>
          <a href="https://linkedin.com" className="text-gray-400 hover:text-white"><FaLinkedin size={20} /></a>
          <a href="mailto:info@skillscale.com" className="text-gray-400 hover:text-white"><FaEnvelope size={20} /></a>
        </div>
      </div>
    </div>

    {/* Copyright */}
    <div className="text-center text-gray-500 text-sm border-t border-gray-600 mt-2 pt-2">
      &copy; 2025 SkillScale. All Rights Reserved.
    </div>
  </footer>
  </div>
    </div>
    
    
  );
};

export default AdminDashboard;
