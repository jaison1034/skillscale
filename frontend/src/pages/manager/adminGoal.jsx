import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axiosInstance from "../../axiosInstance";

const AdminGoalManagement = () => {
  const [goals, setGoals] = useState([]);
  const [employees, setEmployees] = useState([]); // Store employees
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '', dueDate: null, managerAssignedValue: null });

  useEffect(() => {
    fetchEmployees();
  }, []);
  
  useEffect(() => {
    if (employees.length > 0) {
      fetchGoals();
    }
  }, [employees]);

  const fetchGoals = async () => {
    try {
      if (employees.length === 0) {
        console.warn("No employees found. Skipping goal fetch.");
        return;
      }
  
      const employeeId = employees[0]?._id; // Ensure employeeId exists
      if (!employeeId) {
        console.error("Employee ID is missing");
        return;
      }
  
      const response = await axiosInstance.get(`/goals/all`);
      console.log("Fetched Goals:", response.data); // Debugging: Check fetched goals
      setGoals(response.data);
    } catch (error) {
      console.error("Error fetching goals:", error.response?.data || error.message);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get('/employees'); // Adjust API route if needed
      console.log("Fetched Employees:", response.data); // Debugging: Check fetched employees
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.assignedTo) {
      alert("Please select an employee.");
      return;
    }
    await axiosInstance.post('/goals', { ...form, completed: false });
    fetchGoals();
    setForm({ title: '', description: '', assignedTo: '', dueDate: null, managerAssignedValue: 0 }); // Reset form
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8 flex flex-col items-center">
      
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* 🎯 Set New Goal Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-300">
          <h2 className="text-2xl font-bold mb-4 text-blue-600 text-center">➕ Set New Goal</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5 flex flex-col">
          <div className="space-y-3">
            <input 
              type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Title" required 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>
            <div className="space-y-3">
            <input 
              type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Description" required 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>

            {/* Dropdown to select an employee */}
            <div className="space-y-3">
            <select 
              value={form.assignedTo} 
              onChange={e => setForm({ ...form, assignedTo: e.target.value })}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Employee</option>
              {employees.map(employee => (
                <option key={employee._id} value={employee._id}>
                  {employee.name} 
                </option>
              ))}
            </select>
            </div>
            <div className="space-y-3">
            <input 
              type="number" 
              value={form.managerAssignedValue ?? ""} 
              onChange={e => setForm({ ...form, managerAssignedValue: e.target.value })}
              placeholder="Assign Value" 
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
            <div className="space-y-3">
            <DatePicker 
              selected={form.dueDate} 
              onChange={(date) => setForm({ ...form, dueDate: date })} 
              placeholderText="📅 Select Due Date"
              dateFormat="yyyy-MM-dd"
              required 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>
            <div className="space-y-3">
            <button 
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition font-semibold">
              🎯 Set Goal
            </button>
            </div>
          </form>
        </div>

        {/* 📋 Goal Progress Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-green-300">
  <h2 className="text-2xl font-bold mb-4 text-green-600 text-center">📋 Goal Progress</h2>

  <div className="space-y-4">
    {goals.length > 0 ? goals.map(goal => {
      const assignedEmployee = employees.find(emp => emp._id === goal.assignedTo._id);

      return (
        <div key={goal._id} className={`p-5 rounded-lg shadow-sm border ${
          goal.completed ? "border-green-400 bg-green-50" : "border-yellow-400 bg-yellow-50"
        }`}>
          <h3 className="text-lg font-semibold">{goal.title}</h3>
          <p className="text-gray-600">{goal.description}</p>
          <p className="text-gray-700">
            👤 Assigned to: {assignedEmployee ? assignedEmployee.name : 'No employee assigned'}
          </p>
          <p className="font-semibold">{goal.managerAssignedValue ? `Assigned Value: ${goal.managerAssignedValue}` : "No value assigned"}</p>
          <p className="text-gray-500">📅 Due Date: {goal.dueDate ? new Date(goal.dueDate).toLocaleDateString() : 'No Due Date'}</p>
          <p className={`font-semibold ${goal.completed ? "text-green-600" : "text-yellow-600"}`}>
            {goal.completed ? "✅ Completed" : "⚠️ Pending"}
          </p>
          <p className="text-gray-700">
            📊 Goals Assigned: {assignedEmployee ? assignedEmployee.goalsAssigned : 'N/A'}
          </p>
          <p className="text-gray-700">
            ✅ Goals Completed: {assignedEmployee ? assignedEmployee.goalsCompleted : 'N/A'}
          </p>
        </div>
      );
    }) : (
      <p className="text-gray-500 text-center">No goals set yet.</p>
    )}
  </div>
</div>

      </div>
    </div>
  );
};

export default AdminGoalManagement;
