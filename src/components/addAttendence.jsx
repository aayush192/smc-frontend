import React, { useContext, useState ,useEffect} from "react";
import Context from "../context/context.js";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';
import api from "../api/axios.js";

const Attendance = () => {
  const Navigate=useNavigate();
  const { department ,course} = useContext(Context);
  const [departmentName, setDepartmentName] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [semester, setSemester] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      Navigate("/login");
    }
  }, [Navigate]);
  // Fetch students with try/catch
  const handleFetchStudents = async () => {

    if (!departmentName || !semester || !courseTitle) return toast.error("Select department and semester");

    try {
      const response = await api.post("/studentAttendence", { departmentName,courseTitle, semester });
      if(response){
        toast.success(response.data.message);
      }
      const result = response.data.result;
      setStudents(
        result.map((student) => ({
          id: student.user.id,
          name: student.user.name,
          symbolno: student.symbolno,
          email: student.user.email,
        }))
      );

      setAttendance([]); // Reset attendance when fetching new students
    } catch (err) {
      console.error("Error fetching students:", err.response.data.message);
      if(err.response.data.message=='token is not valid'|| err.response.data.message=='user is not valid'){
        Navigate('/login');
      }
      toast.error( err.response.data.message);
      
    }
  };

  // Mark attendance in array
  const markAttendance = (studentid, studentName, status) => {
    setAttendance((prev) => {
      const existing = prev.find((a) => a.id === studentid);
      if (existing) {
        return prev.map((a) => (a.id === studentid ? { ...a, status } : a));
        console.log(studentName)
      } else {
        return [...prev, { id: studentid, studentName, status }];
      }
    });
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-gray-50 min-h-screen">
    
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Attendance Management
      </h1>

      {/* Selection Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 shadow rounded-xl mb-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Select Department</label>
          <select
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-blue-200"
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
        {/*course*/ }
        <div>
          <label className="block text-gray-700 font-medium mb-2">Select Course</label>
          <select
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-blue-200"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
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
          <label className="block text-gray-700 font-medium mb-2">Select Semester</label>
          <select
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-blue-200"
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
      </div>

      <div className="text-center">
        <button
          onClick={handleFetchStudents}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow"
        >
          Fetch Students
        </button>
      </div>

      {/* Students List */}
      {students.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Mark Attendance</h2>
          <div className="space-y-4">
            {students.map((student) => {
              const studentAttendance = attendance.find((a) => a.id === student.id) || null;       
              return (
                <div
                  key={student.id}
                  className="flex items-center justify-between bg-white shadow-md rounded-xl p-4"
                >
                  <span className="text-lg font-medium text-gray-800">{student.name}</span>
                  <div className="space-x-3">
                    <button
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        studentAttendance?(studentAttendance.status == "present"
                          ? "bg-green-600 text-white shadow"
                          : "bg-green-100 text-green-700 hover:bg-green-200"): "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                      onClick={() => markAttendance(student.id, student.name, "present")}
                    >
                      Present
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        studentAttendance?(studentAttendance.status === "absent"
                          ? "bg-red-600 text-white shadow"
                          : "bg-red-100 text-red-700 hover:bg-red-200"): "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                      onClick={() => markAttendance(student.id, student.name, "absent")}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Attendance Summary */}
      {attendance.length > 0 && (
        <div className="mt-10 bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-bold mb-3 text-gray-700">Attendance Summary</h2>
          <ul className="divide-y divide-gray-200">
            {console.log(attendance)}
            {console.log(students)}
            {attendance.map((a) => (
              <li
                key={a.id}
                className="flex justify-between py-2 text-lg font-medium"
              >
                <span>{a.studentName}</span>
                <span
                  className={`${a.status === "present" ? "text-green-600" : "text-red-600"}`}
                >
                  {a.status}
                </span>
              </li>
            ))}
          </ul>
        
      <button
  className="
    bg-blue-600 
    hover:bg-blue-700 
    text-white 
    font-semibold 
    px-6 
    py-3 
    rounded-lg 
    shadow-md 
    transition 
    duration-200 
    ease-in-out
    focus:outline-none 
    focus:ring-2 
    focus:ring-blue-400 
    focus:ring-opacity-50
    mt-6
  "
  onClick={async()=>{
    try{
 if(students.length==attendance.length ){
 const response=await api.post('/add/attendence',{semester,departmentName,courseTitle,attendance})
 if(response) {
  toast.success(response.data.message);
  setDepartmentName("");
  setCourseTitle("");
  setStudents([]);
  setSemester("");
  setAttendance([]);
 }
 }
 else{
  toast.error('attendence is not completed')
 }
}catch(err){
  toast.error(err.response.data.message);
}
  }}
>
  Submit
</button>
</div>
      )}
    </div>
  );
};

export default Attendance;
