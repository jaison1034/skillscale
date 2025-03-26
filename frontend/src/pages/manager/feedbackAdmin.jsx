import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../axiosInstance";

const ManagerSelfAssessment = () => {
  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const [categoriesCount, setCategoriesCount] = useState(0);

  useEffect(() => {
    fetchCategories();
   
    fetchCategoriesCount();
  }, []);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/self-assessment/get-categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  // Fetch questions based on selected category
  const fetchQuestions = async (category) => {
    try {
      const response = await axiosInstance.get(`/self-assessment/get-questions/${category}`);
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions", error);
    }
  };

  // Add a new question under a category
  const handleAddQuestion = async () => {
    if (!question.trim() || !category.trim()) {
      toast.warn("Both question and category are required", { position: "top-right" });
      return;
    }

    try {
      await axiosInstance.post("/self-assessment/add-question", { question, category });
      setQuestion("");
      setCategory("");
      fetchCategories(); // Refresh categories
      toast.success("Question added successfully!", { position: "top-right" });
    } catch (error) {
      console.error("Error adding question", error);
      toast.error("Failed to add question", { position: "top-right" });
    }
  };

  // Delete a question
  const handleDeleteQuestion = async (id) => {
    try {
      await axiosInstance.delete(`/self-assessment/delete-question/${id}`);
      fetchQuestions(selectedCategory);
      toast.info("Question removed", { position: "top-right" });
    } catch (error) {
      console.error("Error deleting question", error);
      toast.error("Failed to delete question", { position: "top-right" });
    }
  };

 
  // Fetch the number of categories
  const fetchCategoriesCount = async () => {
    try {
      const response = await axiosInstance.get("/self-assessment/get-categories-count");
      setCategoriesCount(response.data.count);
    } catch (error) {
      console.error("Error fetching categories count", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Manager Self-Assessment</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Completed Assessments Card */}
       

        {/* Categories Count Card */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-blue-600 mb-4">📊 Total Categories</h3>
          <p className="text-3xl font-bold text-gray-800">{categoriesCount}</p>
        </div>
      </div>
      {/* Input Fields */}
      <div className="space-y-6 mb-8 bg-gray-50 p-6 rounded-lg shadow-md">
        {/* Category Input */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold mb-2">Category Name</label>
          <input
            type="text"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter category name..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        {/* Question Input */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold mb-2">Self-Assessment Question</label>
          <input
            type="text"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter a self-assessment question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        {/* Add Button */}
        <button
          onClick={handleAddQuestion}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all text-lg shadow-md w-full"
        >
          Add Question
        </button>
      </div>

      {/* Select Category */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a Category:</h3>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 transition-all"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            fetchQuestions(e.target.value);
          }}
        >
          <option value="">-- Select a Category --</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Questions List */}
      <ul className="divide-y divide-gray-300">
        {questions.length === 0 ? (
          <p className="text-center text-gray-500">No questions in this category.</p>
        ) : (
          questions.map((q) => (
            <li key={q._id} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg shadow-sm mb-2">
              <span className="text-gray-700">{q.question}</span>
              <button
                onClick={() => handleDeleteQuestion(q._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-all"
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ManagerSelfAssessment;