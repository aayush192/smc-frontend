import React, { useContext, useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';
import {toast } from "react-toastify";
import { Search, Users, BookOpen, GraduationCap, User2 } from "lucide-react";
import Context from "../context/context";
import uiContext from "../context/uiContext";
import api from "../api/axios";


const Dashboard = () => {

    const [searchTerm, setSearchTerm] = useState("");
    const [teachers,setTeachers]=useState([]);
    const [student,setStudent]=useState([]);
    const [count,setCount]=useState({});
    const { isOpen } = useContext(uiContext);
   const {course,department}=useContext(Context);
 const Navigate=useNavigate();
 useEffect(() => {
  if (!localStorage.getItem("token")) {
    Navigate("/login");
  }
}, [Navigate]);

    useEffect(()=>{
       const getTeacher=async()=>{
            try{
           const response=await api.get('/teacher?limit=10');
           if(response){
           setTeachers(response.data.result);
           }
            }catch(err){
              toast.error(err.response.data.message);  
              if(err.response.data.message=='token is not valid'|| err.response.data.message=='user is not valid'){
                Navigate('/login');
              }
            }
        }
        getTeacher();
     },[setTeachers]);

    useEffect(()=>{
       const getStudent=async()=>{
            try{
           const response=await api.get('/student?limit=10');
           if(response){
           setStudent(response.data.result);
           }
            }catch(err){
              toast.error(err.response.data.message);  
            }
        }
        getStudent();
     },[]);

    useEffect(()=>{
       const getCount=async()=>{
            try{
           const response=await api.get('/count');
           if(response){
           setCount(response.data.result);
           }
            }catch(err){
              toast.error(err.response.data.message);  
            }
        }
        getCount();
     },[]);

  const filteredStudent = student.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen bg-gray-50 transition-all duration-300 ${
        isOpen ? "ml-64" : "ml-20"
      } p-6`}
    >
      {/* Top Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Dashboard</h1>

        {/* Search Bar */}
        <div className="relative w-80">
          <input
            type="text"
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-2xl p-6 flex items-center space-x-4">
          <Users className="text-blue-500" size={28} />
          <div>
            <p className="text-gray-500">Students</p>
            <h2 className="text-xl font-bold">{count.countStudent}</h2>
          </div>
        </div>
        <div className="bg-white shadow rounded-2xl p-6 flex items-center space-x-4">
          <BookOpen className="text-green-500" size={28} />
          <div>
            <p className="text-gray-500">Courses</p>
            <h2 className="text-xl font-bold">{count.countCourse}</h2>
          </div>
        </div>
        <div className="bg-white shadow rounded-2xl p-6 flex items-center space-x-4">
          <GraduationCap className="text-purple-500" size={28} />
          <div>
            <p className="text-gray-500">Departments</p>
            <h2 className="text-xl font-bold">{count.countDepartment}</h2>
          </div>
        </div>
        <div className="bg-white shadow rounded-2xl p-6 flex items-center space-x-4">
          <User2 className="text-red-500" size={28} />
          <div>
            <p className="text-gray-500">Teachers</p>
            <h2 className="text-xl font-bold">{count.countTeacher}</h2>
          </div>
        </div>
      </div>

      {/* Courses & Departments Boxes (clean design) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Courses Box */}
        <div className="bg-white shadow rounded-2xl p-4">
          <div className="flex items-center mb-2">
            <BookOpen className="text-green-500 mr-2" size={18} />
            <h3 className="text-gray-600 font-medium text-sm">Courses</h3>
          </div>
          <ul className="text-gray-700 ml-6 list-disc">
            {console.log(course)}
            {course.slice(0, 5).map((crs) => (
              <li key={crs.id}>{crs.courseTitle}</li>
            ))}
          </ul>
        </div>

        {/* Departments Box */}
        <div className="bg-white shadow rounded-2xl p-4">
          <div className="flex items-center mb-2">
            <GraduationCap className="text-purple-500 mr-2" size={18} />
            <h3 className="text-gray-600 font-medium text-sm">Departments</h3>
          </div>
          <ul className="text-gray-700 ml-6 list-disc">
            {console.log(department)}
          {department.slice(0, 5).map((dept) => (
      <li key={dept.id}>{dept.name}</li>
    ))}
          </ul>
        </div>
      </div>

      {/* Students and Teachers side by side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Students box */}
        <div className="bg-white shadow rounded-2xl p-4 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Students</h2>
          <ul className="divide-y divide-gray-100 max-h-64 overflow-y-auto text-sm">
            {filteredStudent.length > 0 ? (
              filteredStudent.map((std) => (
                <li
                  key={std.id}
                  className="py-2 flex items-center justify-between"
                >
                  <span className="text-gray-700">{std.name}</span>
                  <button className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200" onClick={()=>{
                    Navigate('/profile',{state:{id:std.id}});
                  }}>
                    View
                  </button>
                </li>
              ))
            ) : (
              <li className="py-2 text-gray-400 text-center">No students found</li>
            )}
          </ul>
        </div>

        {/* Teachers box */}
        <div className="bg-white shadow rounded-2xl p-4">
  <h2 className="text-lg font-semibold mb-4 text-center">Teachers</h2>
  <ul className="divide-y divide-gray-100 max-h-64 overflow-y-auto text-sm">
    {teachers.map((teacher, idx) => (
      <li
        key={idx}
        className="py-3 flex justify-center text-center"
      >
        <div>
          <span className="text-gray-700 font-medium block">{teacher.name}</span>
          <span className="text-gray-500 text-xs block">{teacher.email}</span>
        </div>
      </li>
    ))}
  </ul>
</div>

      </div>
    </div>
  );
};

export default Dashboard;
