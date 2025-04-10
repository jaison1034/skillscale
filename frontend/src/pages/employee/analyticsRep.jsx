import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useUser } from "../../context/UserContext";
import axiosInstance from "../../axiosInstance";
import { motion } from "framer-motion";
import { FaChartLine, FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import img from '../../assets/images.png';
import logo from "../../assets/logo.webp";

const Analytics = () => {
  const [topPerformers, setTopPerformers] = useState([]);
  const [employeePerformance, setEmployeePerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await axiosInstance.get("/employee-performance/performance");
        const employees = response.data;
        
        // Get top 3 performers
        const topThree = employees.slice(0, 3).map(emp => ({
          name: emp.name,
          rating: emp.performanceScore,
          position: emp.position
        }));
        
        // Format for chart
        const chartData = employees.map(emp => ({
          name: emp.name,
          performance: emp.performanceScore
        }));

        setTopPerformers(topThree);
        setEmployeePerformance(chartData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching performance data:", error);
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FB5607]"></div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-white mb-12 text-center"
        >
          <span class=" text-4xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
  Performance Analytics
</span>
        </motion.h1>

        {/* Top Performers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl  font-bold mb-6 text-white text-center">
            Top 3 Performers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topPerformers.map((employee, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="bg-[#0F0F0F] p-6 rounded-xl border border-[#1F1F1F] hover:border-[#FB5607]/50 transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-[#FB5607]/10 p-3 rounded-full">
                    <span className="text-2xl font-bold text-[#FB5607]">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{employee.name}</h3>
                    <p className="text-gray-400">{employee.position}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Performance Score:</span>
                  <span className="text-xl font-bold text-[#FB5607]">{employee.rating}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-white text-center">
            
            Employee Performance Overview
          </h2>
          <div className="bg-[#0F0F0F] p-6 rounded-xl border border-[#1F1F1F]">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={employeePerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#F7F7F7' }} 
                    axisLine={{ stroke: '#1F1F1F' }}
                  />
                  <YAxis 
                    tick={{ fill: '#F7F7F7' }} 
                    axisLine={{ stroke: '#1F1F1F' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0F0F0F', 
                      borderColor: '#1F1F1F',
                      color: '#F7F7F7'
                    }}
                  />
                  <Bar 
                    dataKey="performance" 
                    fill="#FB5607" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Analytics;