import React, { useState, useEffect,useContext } from "react";
import Context from "../context/context.js";
import {toast } from "react-toastify";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";
const AddTeacher = () => {
  const Navigate=useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    courses: [],
  });

const {course}=useContext(Context);
  const [message, setMessage] = useState(null);


  // Handle input change
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
  
    if (name === "courses") {
      // Handle multi-select checkboxes
      setFormData((prev) => ({
        ...prev,
        courses: checked
          ? [...prev.courses, value] // add to array if checked
          : prev.courses.filter((c) => c !== value), // remove if unchecked
      }));
    } else {
      // Handle normal inputs
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(
        "/add/teacher",
        formData
      );
      setFormData({ name: "", email: "", courses: [] }); // reset

      if(res.data.success){
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.response.data.message);
      if(err.response.data.message=='token is not valid'|| err.response.data.message=='user is not valid'){
        Navigate('/login');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 mt-10">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Register Teacher
      </h2>
      {console.log(course)}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
            required
          />
        </div>

        {/* Courses */}
        <div className="space-y-4 mt-4 bg-white p-6 rounded-lg shadow-sm">
          <h2>Select Courses </h2>
  {course.map((crs) => (
    <label
      key={crs.id}
      className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-all duration-200 ease-in-out"
    >
      <input
        type="checkbox"
        name="courses"
        value={crs.courseTitle}
        checked={formData.courses.find((a) => a === crs.courseTitle)}
        onChange={handleChange}
        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
      />
      <span className="ml-4 text-gray-800 font-medium text-base">
        {crs.courseTitle}
      </span>
    </label>
  ))}
</div>


        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Register Teacher
        </button>
      </form>
    </div>
  );
};

export default AddTeacher;
