import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import Context from "../context/context.js";
import {toast } from "react-toastify";
import api from "../api/axios.js";

const ResultForm = () => {
  const Navigate=useNavigate();
  const [formData, setFormData] = useState({
    symbolno: "",
    departmentName:"",
    courseName: "",
    semester: "",
    grade: "",
  });
 const {department ,course}=useContext(Context);

  // Handle form input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/add/Result", formData);
      if(res){
      setFormData({ departmentName:"",symbolno: "", courseName: "", semester: "", grade: "" });
      toast.success(res.data.message)
      } // reset
    } catch (err) {
     toast.error(err.response.data.message)
     if(err.response.data.message=='token is not valid'|| err.response.data.message=='user is not valid'){
      Navigate('/login');
    }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 mt-10">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Add Student Result
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
      <div>
          <label className="block text-gray-700 font-medium mb-2">Select Course</label>
          <select
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-blue-200"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
          >
             <option value="">-- Select Course --</option>
            {course.map((crs) => (
              <option key={crs.id} value={crs.courseTitle}>
                {crs.courseTitle}
              </option>
            ))}
          </select>
        </div>
      <div>
          <label className="block text-gray-700 font-medium mb-2">Select Department</label>
          <select
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-blue-200"
            name="departmentName"
            value={formData.departmentName}
            onChange={handleChange}
          >
             <option value="">-- Select Department --</option>
            {department.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Symbol No</label>
          <input
            type="text"
            name="symbolno"
            value={formData.symbolno}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Select Semester</label>
          <select
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-blue-200"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
          >
            <option value="">-- Select Semester --</option>
            <option value="1">1st Semester</option>
            <option value="2">2nd Semester</option>
            <option value="3">3rd Semester</option>
            <option value="4">4th Semester</option>
            <option value="5">5th Semester</option>
            <option value="6">6th Semester</option>
            <option value="7">7th Semester</option>
            <option value="8">8th Semester</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700">Grade</label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
            required
          >
            <option value="">Select Grade</option>
            <option value="A">A</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B">B</option>
            <option value="C+">C+</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="F">F</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Add Result
        </button>
      </form>
    </div>
  );
};

export default ResultForm;
