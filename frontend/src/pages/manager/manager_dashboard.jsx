import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

const EmployeePerformanceDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [employeeGoals, setEmployeeGoals] = useState({});
  const [employeeReviews, setEmployeeReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
    useEffect(() => {
      const fetchEmployees = async () => {
        try {
          const response = await axiosInstance.get('/dashboard/dashboard');
          setEmployees(response.data);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch employees');
          setLoading(false);
        }
      };
  
      fetchEmployees();
    }, []);
  
    const fetchEmployeeDetails = async (employeeId) => {
      try {
        const response = await axiosInstance.get(`/dashboard/employee/${employeeId}`);
        setEmployeeGoals(prev => ({
          ...prev,
          [employeeId]: response.data.goals
        }));
        setEmployeeReviews(prev => ({
          ...prev,
          [employeeId]: response.data.reviews
        }));
      } catch (err) {
        console.error('Error fetching employee details:', err);
      }
    };
  
    const toggleEmployeeDetails = async (employeeId) => {
      if (expandedEmployee === employeeId) {
        setExpandedEmployee(null);
      } else {
        setExpandedEmployee(employeeId);
        if (!employeeGoals[employeeId]) {
          await fetchEmployeeDetails(employeeId);
        }
      }
    };

    if (loading) return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading employee data...</p>
        </div>
      </div>
    );
    
    if (error) return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mt-3 text-lg font-medium text-gray-900">Error loading data</h3>
          <div className="mt-2 text-sm text-gray-500">
            <p>{error}</p>
          </div>
          <div className="mt-4">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header with Search and Filter */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Team Performance</h1>
                <p className="mt-2 text-gray-600">Track and analyze employee achievements</p>
              </div>
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
    
            {/* Performance Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Employees</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">{employees.length}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>
    
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Goals Completed</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">
                      {employees.reduce((sum, emp) => sum + emp.goalsCompleted, 0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {employees.length > 0 
                        ? Math.round(employees.reduce((sum, emp) => sum + (emp.goalsCompleted / emp.goalsAssigned || 0), 0) / employees.length * 100) + '% avg completion'
                        : '0% avg completion'}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-100 text-green-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
    
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Avg. Rating</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">
                      {employees.length > 0 && employeeReviews[employees[0]._id]?.length > 0
                        ? (employees.reduce((sum, emp) => {
                            const reviews = employeeReviews[emp._id] || [];
                            return sum + (reviews.reduce((s, r) => s + r.score, 0)) / (reviews.length || 1);
                          }, 0) / employees.length).toFixed(1)
                        : 'N/A'}
                    </p>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(
                              employees.length > 0 && employeeReviews[employees[0]._id]?.length > 0
                                ? employees.reduce((sum, emp) => {
                                    const reviews = employeeReviews[emp._id] || [];
                                    return sum + (reviews.reduce((s, r) => s + r.score, 0) / (reviews.length || 1));
                                  }, 0) / employees.length
                                : 0
                            )
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                </div>
              </div>
    
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">
                      {employees.reduce((sum, emp) => {
                        const reviews = employeeReviews[emp._id] || [];
                        return sum + reviews.filter(r => r.status === 'pending').length;
                      }, 0)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
    
            {/* Employee List with Interactive Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employees.map(employee => (
                <div 
                  key={employee._id}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md border ${
                    expandedEmployee === employee._id 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                          {employee.name.charAt(0).toUpperCase()}
                        </div>
                        {employee.status === 'active' && (
                          <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">{employee.name}</h3>
                        <p className="text-sm text-blue-600">{employee.position}</p>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{employee.department}</p>
                        
                        {/* Progress with animated chart */}
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-600">Goals</span>
                            <span className="text-sm font-semibold">
                              {employee.goalsAssigned > 0 
                                ? `${Math.round((employee.goalsCompleted / employee.goalsAssigned) * 100)}%` 
                                : '0%'}
                            </span>
                          </div>
                          <div className="relative pt-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                  {employee.goalsCompleted} of {employee.goalsAssigned} goals
                                </div>
                              </div>
                            </div>
                            <div className="overflow-hidden h-2 mt-2 rounded-full bg-gray-200">
                              <div 
                                className={`h-full rounded-full ${
                                  employee.goalsCompleted / employee.goalsAssigned >= 0.75 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                                  employee.goalsCompleted / employee.goalsAssigned >= 0.5 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                                  employee.goalsCompleted / employee.goalsAssigned >= 0.25 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                                  'bg-gradient-to-r from-red-400 to-red-600'
                                }`}
                                style={{ 
                                  width: `${employee.goalsAssigned > 0 ? (employee.goalsCompleted / employee.goalsAssigned) * 100 : 0}%`,
                                  transition: 'width 0.8s ease-in-out'
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
    
                    {/* Action buttons */}
                    <div className="mt-6 flex space-x-3">
                      <button 
                        onClick={() => toggleEmployeeDetails(employee._id)}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          expandedEmployee === employee._id 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {expandedEmployee === employee._id ? 'Hide Details' : 'View Details'}
                      </button>
                      
                    </div>
                  </div>
    
                  {/* Expanded Details */}
                  {expandedEmployee === employee._id && (
                    <div className="border-t border-gray-200 px-6 py-5 space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs font-semibold text-gray-500 uppercase">Email</p>
                          <p className="text-sm font-medium text-gray-900 truncate">{employee.email}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
                          <p className={`text-sm font-medium ${
                            employee.status === 'active' ? 'text-green-600' : 'text-amber-600'
                          }`}>
                            {employee.status}
                          </p>
                        </div>
                      </div>
    
                      {/* Mini charts for quick metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <p className="text-xs font-semibold text-gray-500 mb-2">Goal Completion</p>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full" 
                              style={{ width: `${employee.goalsAssigned > 0 ? (employee.goalsCompleted / employee.goalsAssigned) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <p className="text-xs font-semibold text-gray-500 mb-2">Avg. Rating</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(
                                    employeeReviews[employee._id]?.length > 0
                                      ? employeeReviews[employee._id].reduce((sum, review) => sum + review.score, 0) / 
                                        employeeReviews[employee._id].length
                                      : 0
                                  )
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-1 text-xs font-medium text-gray-700">
                              {employeeReviews[employee._id]?.length > 0
                                ? (employeeReviews[employee._id].reduce((sum, review) => sum + review.score, 0) / 
                                  employeeReviews[employee._id].length).toFixed(1)
                                : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">Peer Reviews</h3>
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          {employeeReviews[employee._id]?.length || 0} total
                        </span>
                      </div>
                      {employeeReviews[employee._id]?.length > 0 ? (
                        <div className="space-y-3">
                          {employeeReviews[employee._id].map(review => (
                            <div 
                              key={review._id} 
                              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <svg
                                        key={i}
                                        className={`w-5 h-5 ${
                                          i < Math.floor(review.score)
                                            ? 'text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                    <span className="ml-1 text-sm font-semibold text-gray-700">
                                      {review.score.toFixed(1)}
                                    </span>
                                  </div>
                                </div>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                  review.status === 'pending' 
                                    ? 'bg-amber-100 text-amber-800' 
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {review.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 italic">"{review.feedback}"</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-300 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          <h4 className="mt-2 text-sm font-medium text-gray-700">No reviews yet</h4>
                          <p className="mt-1 text-xs text-gray-500">Peer reviews will appear here</p>
                        </div>
                      )}
                    </div>
                      <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-900 mb-5">Performance Metrics</h3>
                      <div className="space-y-5">
                        {/* Goals Completion */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-all duration-200">
                          <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600 mr-4">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-500">Goals Completion</h4>
                              <div className="flex items-center justify-between mt-1">
                                <div className="text-2xl font-bold text-gray-900">
                                  {employee.goalsAssigned > 0 
                                    ? `${Math.round((employee.goalsCompleted / employee.goalsAssigned) * 100)}%`
                                    : 'N/A'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {employee.goalsCompleted} of {employee.goalsAssigned} goals
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                                <div 
                                  className={`h-2.5 rounded-full ${
                                    employee.goalsCompleted / employee.goalsAssigned >= 0.75 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                                    employee.goalsCompleted / employee.goalsAssigned >= 0.5 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                                    employee.goalsCompleted / employee.goalsAssigned >= 0.25 ? 'bg-gradient-to-r from-amber-400 to-amber-600' : 
                                    'bg-gradient-to-r from-red-400 to-red-600'
                                  }`} 
                                  style={{ 
                                    width: `${employee.goalsAssigned > 0 ? (employee.goalsCompleted / employee.goalsAssigned) * 100 : 0}%`,
                                    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Average Review Score */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-all duration-200">
                          <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-blue-100 text-blue-600 mr-4">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-500">Average Review Score</h4>
                              <div className="flex items-center justify-between mt-1">
                                <div className="text-2xl font-bold text-gray-900">
                                  {employeeReviews[employee._id]?.length > 0
                                    ? (employeeReviews[employee._id].reduce((sum, review) => sum + review.score, 0) / 
                                      employeeReviews[employee._id].length).toFixed(1)
                                    : 'N/A'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Based on {employeeReviews[employee._id]?.length || 0} reviews
                                </div>
                              </div>
                              <div className="flex mt-3 space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-6 h-6 ${
                                      i < Math.floor(
                                        employeeReviews[employee._id]?.length > 0
                                          ? employeeReviews[employee._id].reduce((sum, review) => sum + review.score, 0) / 
                                            employeeReviews[employee._id].length
                                          : 0
                                      )
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors w-full">
  <div className="flex items-center">
    <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-medium text-gray-500">Sentiment Score</h4>
      <div className="flex items-center justify-between mt-1">
        <div className="text-xl font-bold text-gray-900">
          {employee.sentimentScore || 'N/A'}
        </div>
        <div className="text-xs text-gray-500">
          From feedback analysis
        </div>
      </div>
      
      {employee.sentimentScore && (
        <div className="relative w-full mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                employee.sentimentScore >= 0.75 ? 'bg-green-500' :
                employee.sentimentScore >= 0.5 ? 'bg-blue-500' :
                employee.sentimentScore >= 0.25 ? 'bg-yellow-500' : 'bg-red-500'
              }`} 
              style={{ width: `${employee.sentimentScore * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  </div>
</div>

                      </div>
                    </div>
                  

                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };
    
    export default EmployeePerformanceDashboard;