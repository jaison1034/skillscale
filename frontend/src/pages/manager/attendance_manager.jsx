import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../axiosInstance";

export default function AttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  // Fetch employees from MongoDB
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axiosInstance.get("/employees");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  // Fetch stored attendance records on page load
  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        const response = await axiosInstance.get("/attendance");
        setAttendanceRecords(response.data);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
      }
    };

    fetchAttendanceRecords();
  }, []);

  const handleAttendanceChange = (id) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const submitAttendance = async () => {
    const date = new Date().toLocaleDateString();
    const day = new Date().toLocaleDateString(undefined, { weekday: "long" });
    const records = employees.map((emp) => ({
      id: emp._id,
      name: emp.name,
      present: attendance[emp._id] || false,
      date,
      day,
    }));
  
    try {
      await axiosInstance.post("/attendance", { date, day, records });
      toast.success("Attendance submitted successfully!", { position: "top-right" });
  
      // Update records after submission
      setAttendanceRecords((prevRecords) => [...prevRecords, { date, day, records }]);
  
      // Reset attendance state to uncheck checkboxes
      setAttendance({});
    } catch (error) {
      console.error("Error submitting attendance:", error);
      alert("Failed to submit attendance.");
    }
  };
  

  return (
    <div className="p-6 max-w-3xl mx-auto border rounded-lg shadow-lg bg-white">
      <h2 className="text-3xl font-bold mb-4 text-center">📅 Employee Attendance</h2>

      <div className="mb-4 p-6 border rounded-lg bg-gray-100">
        <h3 className="text-xl font-semibold mb-2">✅ Mark Attendance for Today</h3>
        {employees.map((employee) => (
          <div key={employee._id} className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id={`emp-${employee._id}`}
              checked={attendance[employee._id] || false}
              onChange={() => handleAttendanceChange(employee._id)}
              className="w-4 h-4 cursor-pointer"
            />
            <label htmlFor={`emp-${employee._id}`} className="text-lg cursor-pointer">
              {employee.name}
            </label>
          </div>
        ))}
        <button 
          onClick={submitAttendance} 
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Submit Attendance
        </button>
      </div>

      <h2 className="text-2xl font-bold mt-6 text-center">📜 Attendance Records</h2>
      <div className="p-6 border rounded-lg bg-gray-50">
        {attendanceRecords.length === 0 ? (
          <p className="text-center text-gray-500">No attendance records available.</p>
        ) : (
          attendanceRecords.map((recordSet, index) => (
            <div key={index} className="mb-4 p-4 border-b">
              <h3 className="text-lg font-semibold">{recordSet.day}, {recordSet.date}</h3>
              <ul className="mt-2">
                {recordSet.records.map((record) => (
                  <li key={record.id} className="mb-1">
                    {record.name}: <span className={record.present ? "text-green-600" : "text-red-600"}>
                      {record.present ? "Present" : "Absent"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
