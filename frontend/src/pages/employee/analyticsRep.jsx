import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import img from '../../assets/images.png';
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaPhone, FaChartLine } from "react-icons/fa";
import rImg from '../../assets/analyticsrep.jpg';

const topPerformers = [
  { name: "Adwaith", rating: 95, position: "Software Engineer" },
  { name: "Pranav", rating: 92, position: "Project Manager" },
  { name: "Mrudul", rating: 90, position: "UX Designer" },
];

const employeePerformance = [
  { name: "Adwaith", performance: 95 },
  { name: "Pranav", performance: 92 },
  { name: "Mrudul", performance: 90 },
  { name: "Sonnet", performance: 85 },
  { name: "Abel", performance: 82 },
  { name: "Aben", performance: 78 },
  { name: "Aslam", performance: 75 },
];

const Analytics = () => {
  return (
    <div className="min-h-screen flex flex-col">
     <div
           className="bg-cover bg-center min-h-screen relative"
           style={{ backgroundImage: `url(${rImg})` }}
         >
      <main className="flex-grow p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Top 3 Performers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-white">
          {topPerformers.map((employee, index) => (
            <div key={index} className="p-4 shadow-lg border border-gray-200 rounded-lg text-white">
              <h3 className="text-xl font-semibold">{employee.name}</h3>
              <p className="text-white-1200 ">{employee.position}</p>
              <p className="text-lg font-bold text-blue-600">Rating: {employee.rating}%</p>
            </div>
          ))}
        </div>

        {/* Performance Chart */}
        <h2 className="text-3xl font-bold mb-4 text-white ">Overall Employee Performance</h2>
        <div className="w-full h-96 bg-white shadow-md p-4 rounded-lg">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={employeePerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="performance" fill="#3182CE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
      </div>

      {/* Footer */}
      
      
    </div>
  );
};

export default Analytics;
