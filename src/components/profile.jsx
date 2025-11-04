import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { User2, BookOpen, BarChart3, CheckSquare } from "lucide-react";
import uiContext from "../context/uiContext";
import api from "../api/axios";
import Context from "../context/context";

const StudentProfile = () => {
  const Navigate=useNavigate();
  const {department}=useContext(Context);
  const { isOpen } = useContext(uiContext);
  const { userData } = useContext(Context);
  const [studentData, setStudentData] = useState(null);
  const [semesters, setSemesters] = useState({});
  const [activeSemester, setActiveSemester] = useState(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    id:"",
    name: "",
    email: "",
    semester: "",
    departmentName: "",
    symbolno:"",
    phone:"",
    gender:"",
    role:""
  });
  const location = useLocation();
 
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      Navigate("/login");
    }
  }, [Navigate]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = location.state.id;
        const res = await api.get(`/student/${id}`);
        if (!res.data?.result) return;
        const data = res.data.result;
        setStudentData(data);

        setUpdateForm({
          id:location.state.id,
          name: data.studentResponse.name || "",
          email: data.studentResponse.email || "",
          phone: data.studentResponse.phone || "",
          role: data.studentResponse.role || "",
          gender: data.studentResponse.gender || "",
          symbolno: data.studentResponse.student.symbolno || "",
          semester: data.studentResponse.student.semester || "",
          departmentName: department.find((dept)=> dept.id==data.studentResponse.student.departmentId)?.name|| "",
        });

        const sems = {};

        data.courses[0].courses.forEach((course) => {
          const sem = course.deptCourses.semester;
          if (!sems[sem]) sems[sem] = { courses: [], results: [], attendance: [] };
          sems[sem].courses.push(course.courseTitle);
        });

        data.marksResponse.forEach((mark) => {
          const sem = mark.semester;
          if (!sems[sem]) sems[sem] = { courses: [], results: [], attendance: [] };
          sems[sem].results.push({ subject: mark.course.courseTitle, grade: mark.grade });
        });

        Object.entries(data.attendanceSummary).forEach(([subject, att]) => {
         let sem = data.marksResponse.find((m) => m.course.courseTitle === subject)?.semester ||
  data.courses[0].courses.find((c) => c.courseTitle === subject)?.deptCourses.semester ||
  1;
          if (!sems[sem]) sems[sem] = { courses: [], results: [], attendance: [] };
          sems[sem].attendance.push({
            subject,
            present: att.present || 0,
            absent: att.absent || 0,
          });
        });

        setSemesters(sems);
        setActiveSemester(Math.min(...Object.keys(sems)));
      } catch (err) {
        if(err.response.data.message=='token is not valid'|| err.response.data.message=='user is not valid'){
          Navigate('/login');
        }
        console.error(err.response?.data?.message);
      }
    };

    fetchData();
  }, []);

  if (!studentData) return <div>Loading...</div>;

  const student = studentData.studentResponse;

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/update`, updateForm);
      toast.success("Student updated successfully!");
      setStudentData({
        ...studentData,
        studentResponse: {
          ...studentData.studentResponse,
          ...updateForm,
          student: {
            ...studentData.studentResponse.student,
            semester: updateForm.semester,
            departmentId: updateForm.departmentId,
          },
        },
      });
      setIsUpdateOpen(false);
    } catch (err) {
      console.error(err.response?.data?.message);
      toast.error("Failed to update student");
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"} p-6`}>
      {/* Profile Card */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-white p-6 rounded-3xl shadow-lg mb-6">
        <div className="bg-blue-600 text-white p-4 rounded-full w-20 h-20 flex items-center justify-center flex-shrink-0">
          <User2 size={50} />
        </div>
        <div className="flex-1 space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold">{student.name}</h2>
          <p className="text-gray-600 text-sm sm:text-base">{student.email}</p>
          <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
            <span>Symbol No: {student.student.symbolno}</span>
            <span>Department ID: {student.student.departmentId}</span>
            <span>Semester: {student.student.semester}</span>
          </div>
        </div>

        {/* Update Button */}
        { userData.role!='student' && <div className="flex-shrink-0">
          <button
            onClick={() => setIsUpdateOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
          >
            Update
          </button>
        </div>
}
{console.log(student)}
{userData.id === student.id && (
  <div className="flex-shrink-0 flex gap-2">
    <button
      onClick={() => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        Navigate("/login");
      }}
      className="px-4 py-2 bg-white text-red-800 rounded-xl shadow hover:bg-red-800 hover:text-white transition"
    >
      Log Out
    </button>

    <button
      onClick={() => Navigate("/changePassword", { state: { id: userData.id } })}
      className="px-4 py-2 bg-white text-green-800 rounded-xl shadow hover:bg-green-800 hover:text-white transition"
    >
      Change Password
    </button>
  </div>
)}

      </div>
        

      {/* Update Form Modal */}
      {isUpdateOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Update Student</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={updateForm.name}
                  onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={updateForm.email}
                  onChange={(e) => setUpdateForm({ ...updateForm, email: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Phone No</label>
                <input
                  type="integer"
                  value={updateForm.phone}
                  onChange={(e) => setUpdateForm({ ...updateForm, phone: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Symbol No</label>
                <input
                  type="integer"
                  value={updateForm.symbolno}
                  onChange={(e) => setUpdateForm({ ...updateForm, symbolno:e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Semester</label>
                <input
                  type="number"
                  value={updateForm.semester}
                  onChange={(e) => setUpdateForm({ ...updateForm, semester: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Gender</label>
              <select className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-blue-200" value={updateForm.gender} onChange={(e)=>setUpdateForm(...updateForm,gender=e.target.value)}>
              <option value="">{updateForm.gender}</option>
                 <option key={1} value="male">Male</option>
                <option key={2} value="female">Female</option>
              </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Role</label>
              <select className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-blue-200" value={updateForm.role} onChange={(e)=>setUpdateForm(...updateForm,role=e.target.value)}>
              <option value="">{updateForm.role}</option>
                 <option key={1} value="deptadmin">DeptAdmin</option>
                <option key={2} value="admin">Admin</option>
                <option key={3} value="student">Student</option>
              </select>
              </div>


              <div>
          <label className="block text-gray-700 font-medium mb-2">Select Department</label>
          <select
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-blue-200"
            value={updateForm.departmentName}
            onChange={(e) => setUpdateForm({ ...updateForm, departmentName: e.target.value })}
          >
            <option value="">{updateForm.departmentName}</option>
            {department.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUpdateOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Semester Tabs and Content */}
      <div className="flex flex-wrap gap-3 mb-6">
        {Object.keys(semesters).map((sem) => (
          <button
            key={sem}
            onClick={() => setActiveSemester(parseInt(sem))}
            className={`px-4 py-2 rounded-full font-medium ${
              parseInt(sem) === activeSemester
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200"
            } transition`}
          >
            Semester {sem}
          </button>
        ))}
      </div>

      {activeSemester &&
        Object.entries(semesters)
          .filter(([sem]) => parseInt(sem) === activeSemester)
          .map(([sem, semData]) => (
            <div key={sem} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Courses */}
              <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
                <div className="flex items-center gap-2 mb-3 text-blue-600 font-semibold">
                  <BookOpen /> Courses
                </div>
                <ul className="space-y-2">
                  {semData.courses.map((course, idx) => (
                    <li key={idx} className="bg-gray-50 p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition">
                      {course}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Results */}
              <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
                <div className="flex items-center gap-2 mb-3 text-blue-600 font-semibold">
                  <BarChart3 /> Results
                </div>
                {semData.results.length > 0 ? (
                  <ul className="space-y-2">
                    {semData.results.map((res, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between p-2 bg-gray-50 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
                      >
                        <span>{res.subject}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-semibold ${
                            res.grade === "A"
                              ? "bg-green-100 text-green-700"
                              : res.grade === "B+"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {res.grade}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm">No results yet</p>
                )}
              </div>

              {/* Attendance */}
              <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
                <div className="flex items-center gap-2 mb-3 text-blue-600 font-semibold">
                  <CheckSquare /> Attendance
                </div>
                {semData.attendance.length > 0 ? (
                  <ul className="space-y-3">
                    {semData.attendance.map((att, idx) => {
                      const total = att.present + att.absent;
                      const percentage = total ? Math.round((att.present / total) * 100) : 0;
                      return (
                        <li key={idx}>
                          <div className="flex justify-between font-medium text-gray-700 mb-1">
                            <span>{att.subject}</span>
                            <span className={`font-semibold ${percentage >= 80 ? "text-green-600" : "text-red-600"}`}>
                              {percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div className={`h-2 ${percentage >= 80 ? "bg-green-500" : "bg-red-500"}`} style={{ width: `${percentage}%` }} />
                          </div>
                          <p className="text-gray-500 text-sm mt-1">
                            Present: {att.present} | Absent: {att.absent} | Total: {total}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm">No attendance data</p>
                )}
              </div>
            </div>
          ))}
    </div>
  );
};

export default StudentProfile;
