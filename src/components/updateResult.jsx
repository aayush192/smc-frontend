import React, { useState ,useContext,useEffect} from "react";
import Context from "../context/context";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const UpdateResult = () => {
    const Navigate=useNavigate();
    const {course}=useContext(Context);
  const [formData, setFormData] = useState({
    semester: "",
    symbolno: "",
    course: "",
    grade: "",
  });

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      Navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
   try {
    const response=await api.post('/update/result',formData);
    if(response){
        toast.success('result updated successfully');
    }
   } catch (err) {
    toast.error(err.response.data.message);
    if(err.response.data.message=='token is not valid'|| err.response.data.message=='user is not valid'){
        Navigate('/login');
      }
   }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Enter Course Grade</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Symbol No
            </label>
            <input
              type="text"
              name="symbolno"
              value={formData.symbolno}
              onChange={handleChange}
              placeholder="e.g. 123456"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
          <label className="block text-gray-700 font-medium mb-2">Select Course</label>
          <select
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-blue-200"
            name="course"
            value={formData.course}
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
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateResult;
