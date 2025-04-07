import React, { useState, useEffect } from "react";
import { FaUserTie } from "react-icons/fa";


const ManagerEmployeePage = () => {
  const [employees, setEmployees] = useState([]);

  // Fetch employees from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/employees"); // Replace with your backend URL
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []); // Run once when the component mounts

  return (
    <div className="bg-gradient-to-r flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">👥 Employees Under Manager</h2>
        <ul>
          {employees.length > 0 ? (
            employees.map(employee => (
              <li key={employee._id} className="flex items-center justify-between p-4 mb-4 bg-gray-100 rounded-lg shadow-md hover:bg-blue-100 transition-all">
                <div className="flex items-center space-x-3">
                  <FaUserTie className="text-blue-500 text-xl" />
                  <span className="font-semibold text-gray-800">{employee.name}</span>
                </div>
                <span className="text-gray-600 bg-blue-200 px-3 py-1 rounded-full text-sm font-medium">{employee.position}</span>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">No employees found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ManagerEmployeePage;
