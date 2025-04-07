import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaChartLine, FaBars, FaTimes, FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';
import img from '../../assets/images.png';

const AppraisalPage = () => {
  const { user } = useUser();
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/employees/${user.id}`);
        setEmployeeData(response.data);
      } catch (err) {
        setEmployeeData({
          name: user?.name || 'Employee',
          department: user?.department || 'Department',
          position: user?.position || 'Position',
          goalsAssigned: 0,
          goalsCompleted: 0,
          performanceScore: 0,
          attendance: { present: 0, total: 0 }
        });
        setError('Using fallback data - ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [user, navigate]);

  const getImprovementSuggestion = (score) => {
    if (score >= 90) return "🌟 Exceptional! Ready for leadership roles.";
    if (score >= 75) return "💪 Strong performance! Keep challenging yourself.";
    if (score >= 60) return "👍 Good! Focus on specific areas to improve.";
    if (score >= 40) return "📈 Needs improvement. Create a development plan.";
    return "⚠️ Needs immediate improvement plan.";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const attendance = employeeData.attendance || { present: 0, total: 0 };
  const attendancePercentage = attendance.total > 0 
    ? Math.round((attendance.present / attendance.total) * 100)
    : 0;

  const goalsAssigned = employeeData.goalsAssigned || 0;
  const goalsCompleted = employeeData.goalsCompleted || 0;
  const completionRate = goalsAssigned > 0 
    ? Math.round((goalsCompleted / goalsAssigned) * 100)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Modern Navbar */}
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

      {/* Main Content */}
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Performance Appraisal
            </h1>
            <p className="mt-3 text-xl text-gray-500">
              {new Date().getFullYear()} Annual Review
            </p>
          </div>

          {/* Employee Card */}
          <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-2xl font-bold">{employeeData.name}</h2>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div>
                      <span className="text-blue-100">Position:</span>
                      <span className="ml-2 font-medium">{employeeData.position}</span>
                    </div>
                    <div>
                      <span className="text-blue-100">Department:</span>
                      <span className="ml-2 font-medium">{employeeData.department}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <span className="text-sm">Appraisal Period:</span>
                  <span className="ml-2 font-medium">Jan 2024 - Dec 2024</span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="p-6 space-y-8">
              {/* Performance Score */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-900">Overall Performance Score</h3>
                  <span className="text-xl font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {employeeData.performanceScore || 0}/100
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${
                        (employeeData.performanceScore || 0) >= 80 ? 'bg-green-200 text-green-800' :
                        (employeeData.performanceScore || 0) >= 60 ? 'bg-blue-200 text-blue-800' :
                        (employeeData.performanceScore || 0) >= 40 ? 'bg-yellow-200 text-yellow-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {employeeData.performanceScore >= 80 ? 'Excellent' : 
                         employeeData.performanceScore >= 60 ? 'Good' : 
                         employeeData.performanceScore >= 40 ? 'Average' : 'Needs Improvement'}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-gray-200 mt-2">
                    <div
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                        (employeeData.performanceScore || 0) >= 80 ? 'bg-green-500' :
                        (employeeData.performanceScore || 0) >= 60 ? 'bg-blue-500' :
                        (employeeData.performanceScore || 0) >= 40 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${employeeData.performanceScore || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Goals Completion Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-blue-800">Goals Completion</h4>
                    <span className="bg-blue-200 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {completionRate}%
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-blue-600">Assigned:</span>
                      <span className="ml-2 font-medium">{goalsAssigned}</span>
                    </div>
                    <div>
                      <span className="text-sm text-blue-600">Completed:</span>
                      <span className="ml-2 font-medium">{goalsCompleted}</span>
                    </div>
                    <div className="pt-2">
                      <div className="w-full bg-blue-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attendance Card */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-green-800">Attendance</h4>
                    <span className="bg-green-200 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {attendancePercentage}%
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-green-600">Present:</span>
                      <span className="ml-2 font-medium">{attendance.present} days</span>
                    </div>
                    <div>
                      <span className="text-sm text-green-600">Total:</span>
                      <span className="ml-2 font-medium">{attendance.total} days</span>
                    </div>
                    <div className="pt-2">
                      <div className="w-full bg-green-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: `${attendancePercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Improvement Suggestions */}
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200">
                <h3 className="text-lg font-semibold text-indigo-800 mb-3">Improvement Suggestions</h3>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-indigo-900">
                      {getImprovementSuggestion(employeeData.performanceScore || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Appraisal generated on {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">SkillScale</h2>
            <p className="text-gray-400">Empowering growth through continuous performance tracking.</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaEnvelope className="mr-2 text-gray-400" />
                <span className="text-gray-400 hover:text-white transition">info@skillscale.com</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2 text-gray-400" />
                <span className="text-gray-400">6282645889</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-gray-400">📍</span>
                <span className="text-gray-400">CyberPark, Kozhikode, India</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaEnvelope size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} SkillScale. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default AppraisalPage;