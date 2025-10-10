import React, { useContext, useState } from "react";
import Context from "../context/context";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { toast } from "react-toastify";

const AddCourse = () => {
  const Navigate=useNavigate();
  const { department } = useContext(Context); // Assuming department is an array of objects
  const [departmentName, setDepartmentName] = useState("");
  const [semester, setSemester] = useState("");
  const [courseName, setCourseName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!departmentName || !semester || !courseName) {
      toast.error("Please fill all fields");
    }

    try {
      const response = await api.post("/add/course", {
        departmentName,
        semester,
        courseName,
      });

      if (response.data.success) {
        setMessage("Course added successfully!");
        setDepartmentName("");
        setSemester("");
        setCourseName("");
      } else {
        setMessage("Failed to add course");
      }
    } catch (err) {
      console.error("Error adding course:", err);
      if(err.response.data.message=='token is not valid'|| err.response.data.message=='user is not valid'){
        Navigate('/login');
      }
      setMessage("Something went wrong. Check console.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-50 rounded-xl shadow-md mt-10">
  
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
        Add Course
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Department Selection */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Department</label>
          <select
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-200"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
          >
            <option value="">-- Select Department --</option>
            {department.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Selection */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Semester</label>
          <select
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-200"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
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

        {/* Course Name Input */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Course Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-200"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Enter course name"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200"
        >
          Add Course
        </button>

        {message && <p className="mt-2 text-center text-gray-700">{message}</p>}
      </form>
    </div>
  );
};

export default AddCourse;
