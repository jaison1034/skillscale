import React, { useState } from "react";

const AdminReviewPage = () => {
  const [employees, setEmployees] = useState([
    { name: "Adwaith", reviewed: false, feedback: "" },
    { name: "Pranav", reviewed: false, feedback: "" },
    { name: "Mrudul", reviewed: false, feedback: "" }
  ]);

  const [newReview, setNewReview] = useState({ employee: "", feedback: "" });

  const handleReviewSubmit = () => {
    if (newReview.employee && newReview.feedback) {
      setEmployees(employees.map(emp =>
        emp.name === newReview.employee ? { ...emp, reviewed: true, feedback: newReview.feedback } : emp
      ));
      setNewReview({ employee: "", feedback: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-[#3674B5] mb-6">
        Admin - Employee Reviews
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Assign Reviews */}
        <div className="p-4 md:p-6 bg-white shadow-lg rounded-lg">
          <h3 className="text-lg md:text-xl font-semibold text-[#3674B5] mb-4">Assign a Review</h3>
          <select
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={newReview.employee}
            onChange={(e) => setNewReview({ ...newReview, employee: e.target.value })}
          >
            <option value="">Select Employee</option>
            {employees.filter(emp => !emp.reviewed).map((emp, index) => (
              <option key={index} value={emp.name}>{emp.name}</option>
            ))}
          </select>
          <textarea
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Write review feedback..."
            value={newReview.feedback}
            onChange={(e) => setNewReview({ ...newReview, feedback: e.target.value })}
          ></textarea>
          <button 
            className="w-full bg-[#3674B5] text-white py-2 rounded-lg hover:bg-[#285a8d] transition"
            onClick={handleReviewSubmit}
          >
            Assign Review
          </button>
        </div>

        {/* Completed Reviews */}
        <div className="p-4 md:p-6 bg-white shadow-lg rounded-lg">
          <h3 className="text-lg md:text-xl font-semibold text-[#3674B5] mb-4">✅ Completed Reviews</h3>
          {employees.filter(emp => emp.reviewed).length > 0 ? (
            <ul>
              {employees.filter(emp => emp.reviewed).map((review, index) => (
                <li key={index} className="border-b py-2 text-sm md:text-base">{review.name}: {review.feedback}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-sm md:text-base">No reviews completed yet.</p>
          )}
        </div>

        {/* Pending Reviews */}
        <div className="p-4 md:p-6 bg-white shadow-lg rounded-lg">
          <h3 className="text-lg md:text-xl font-semibold text-[#3674B5] mb-4">📅 Pending Reviews</h3>
          {employees.filter(emp => !emp.reviewed).length > 0 ? (
            <ul>
              {employees.filter(emp => !emp.reviewed).map((emp, index) => (
                <li key={index} className="border-b py-2 text-sm md:text-base">{emp.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-sm md:text-base">All reviews completed!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviewPage;
