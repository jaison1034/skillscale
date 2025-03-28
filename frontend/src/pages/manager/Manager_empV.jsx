import React, { useState, useEffect } from "react";
import { FaUserTie } from "react-icons/fa";
import axiosInstance from "../../axiosInstance"; 

const ManagerEmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use your Axios instance instead of fetch
        const response = await axiosInstance.get("/api/employees");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError(error.response?.data?.message || "Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="bg-gradient-to-r flex items-center justify-center p-6 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">👥 Employees Under Manager</h2>
        
        {loading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading employees...</p>
          </div>
        ) : error ? (
          <div className="text-center p-4 bg-red-100 rounded-lg">
            <p className="text-red-600 font-medium">Error: {error}</p>
            <p className="text-gray-600 mt-2">Please try again later or contact support.</p>
          </div>
        ) : employees.length > 0 ? (
          <ul>
            {employees.map(employee => (
              <li key={employee._id} className="flex items-center justify-between p-4 mb-4 bg-gray-100 rounded-lg shadow-md hover:bg-blue-100 transition-all">
                <div className="flex items-center space-x-3">
                  <FaUserTie className="text-blue-500 text-xl" />
                  <span className="font-semibold text-gray-800">{employee.name}</span>
                </div>
                <span className="text-gray-600 bg-blue-200 px-3 py-1 rounded-full text-sm font-medium">{employee.position}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No employees found.</p>
        )}
      </div>
    </div>
  );
};

export default ManagerEmployeePage;