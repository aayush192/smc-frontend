import React, { useContext, useState ,useEffect, use} from "react";
import api from "../api/axios.js";
import {toast } from "react-toastify";
import Context from "../context/context.js";
import { useNavigate } from "react-router-dom";
const RegisterForm = () => {
  const Navigate=useNavigate();
  const {department}=useContext(Context);
  const [errorMsg,setErrorMsg]=useState();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    departmentName: "",
    email: "",
    role: "",
    password: "",
    symbolno: "",
    semester: ""
  });

 useEffect(() => {
     if (!localStorage.getItem("token")) {
       Navigate("/login");
     }
   }, [Navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm=()=>{
    setFormData({
      name: "",
      phone: "",
      gender: "",
      departmentName: "",
      email: "",
      role: "",
      password: "",
      symbolno: "",
      semester: ""
    });
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
    if(formData.role=='student'){
    const response=await api.post('/register',formData);
      console.log(response);
      if(response){
        toast.success(response.data.message);
        resetForm();
      }
    }
    else if(formData.role=='admin'){
      const response=await api.post('/register/admin',formData);
      console.log(response);
      if(response){
        toast.success(response.data.message);
        resetForm();
      }
    }
    else if(formData.role=='deptadmin'){
      const response=await api.post('/register/deptadmin',formData);
      console.log(response);
      if(response){
        toast.success(response.data.message);
        resetForm();
      }
    }
  }catch(err){
    if(err.response.data.message=='token is not valid'|| err.response.data.message=='user is not valid'){
      Navigate('/login');
    }
     toast.error(err.response.data.message); // Show backend message
    console.log(err.response);
    return(
      <>
      <h1>Server error `${err.response.data.message}`</h1>
      </>
    )
  }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Register User</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
         <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 md:col-span-2"
        >
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
          <option value="deptadmin">Dept Admin</option>
        </select>
        {/* Personal Info */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          className="p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        

          <select
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-blue-200"
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


        {/* Academic Info (only for students) */}
        {formData.role === "student" && (
          <>
            <input
              type="text"
              name="symbolno"
              placeholder="Symbol Number"
              value={formData.symbolno}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="semester"
              placeholder="Semester"
              value={formData.semester}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
            />
          </>
        )}

        {/* Login Info */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className="p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
        />

       

        <button
          type="submit"
          className="md:col-span-2 bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
