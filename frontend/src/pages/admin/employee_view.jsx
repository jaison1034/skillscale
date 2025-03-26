import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserTie, FaCrown, FaTrash } from 'react-icons/fa';
import axiosInstance from  '../../axiosInstance';

const AdminPage = () => {
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/admin/users'); // Full URL
      console.log("API Response:", response.data); // Debugging: Log the response
      setEmployees(response.data.employees || []);
      setManagers(response.data.managers || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setEmployees([]);
      setManagers([]);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await axiosInstance.delete(`/employees/${id}`); // Full URL
      fetchUsers(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleDeleteManager = async (id) => {
    try {
      await axiosInstance.delete(`/admin/managers/${id}`); // Full URL
      fetchUsers(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting manager:', error);
    }
  };

  const departmentColors = {
    IT: 'bg-blue-100 text-blue-800',
    HR: 'bg-green-100 text-green-800',
    Finance: 'bg-yellow-100 text-yellow-800',
    Sales: 'bg-red-100 text-red-800',
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-semibold text-center mb-6 text-blue-600">Admin Dashboard</h1>

      <h2 className="text-2xl font-semibold mb-4 text-blue-600">Employees</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {employees.length > 0 ? (
          employees.map((employee) => (
            <div
              key={employee._id}
              className={`user-card p-6 rounded-lg shadow-lg w-64 text-center ${
                departmentColors[employee.department] || 'bg-gray-100 text-gray-800'
              }`}
            >
              <FaUserTie className="text-4xl mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-4">{employee.name}</h3>
              <p>Role: {employee.role}</p>
              <p>Department: {employee.department}</p>
              <p>Position: {employee.position}</p>
              <button
                onClick={() => handleDeleteEmployee(employee._id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaTrash /> Remove Employee
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No employees found.</p>
        )}
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-blue-600">Managers</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {managers.length > 0 ? (
          managers.map((manager) => (
            <div
              key={manager._id}
              className={`user-card p-6 rounded-lg shadow-lg w-64 text-center ${
                departmentColors[manager.department] || 'bg-gray-100 text-gray-800'
              }`}
            >
              <FaCrown className="text-4xl mx-auto mb-3 text-yellow-500" />
              <h3 className="text-xl font-bold mb-4">{manager.name}</h3>
              <p>Role: {manager.role}</p>
              <p>Department: {manager.department}</p>
              <p>Position: {manager.position}</p>
              <button
                onClick={() => handleDeleteManager(manager._id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaTrash /> Remove Manager
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No managers found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;