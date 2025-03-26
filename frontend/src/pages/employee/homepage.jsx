import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import img from '../../assets/images.png';
import bimg from '../../assets/homeb.jpg';
import simg from '../../assets/home.jpg';
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaPhone, FaChartLine} from "react-icons/fa";
import { LuLogOut } from "react-icons/lu"; 
function HomePage() {
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
            <Nav.Link href="/goal" className="text-gray-700 hover:text-blue-500 px-3">GOAL</Nav.Link>
            <Nav.Link href="/feedback" className="text-gray-700 hover:text-blue-500 px-3">FEEDBACK</Nav.Link>
            <Nav.Link href="/Appraisal" className="text-gray-700 hover:text-blue-500 px-3">APPRAISAL DASHBOARD</Nav.Link>
            
            <Nav.Link href="/review" className="text-gray-700 hover:text-blue-500 px-3">REVIEW</Nav.Link>

            {/* Profile Dropdown */}
            <NavDropdown
              title={
                <img
                  src={img} // Replace with actual image URL
                  alt="Profile"
                  className="rounded-full"
                  width="40"
                  height="40"
                />
              }
              id="basic-nav-dropdown"
              align="end"
            >
              <NavDropdown.Item href="/prof" className="text-gray-700 hover:bg-gray-100">🧑‍💼Profile</NavDropdown.Item>
              <NavDropdown.Item href="/login" className="text-gray-700 hover:bg-gray-100" >⬅️Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>

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

