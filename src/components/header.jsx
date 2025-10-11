import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  User2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import uiContext from "../context/uiContext";
import Context from "../context/context";

const Sidebar = () => {
  const { userData } = useContext(Context);
  const navigate = useNavigate();
  const { isOpen, setIsOpen } = useContext(uiContext);
  const [openProfile,setOpenProfile]=useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const menus = {
    add: [
      { label: "Attendance", path: "/addAttendance" },
      { label: "Department", path: "/addDepartment" },
      { label: "Course", path: "/addCourse" },
      { label: "Result", path: "/addResult" },
      { label: "Teacher", path: "/addTeacher" },
    ],
    update: [
      { label: "Result", path: "/updateResult" },
    ],
  };

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
   <div className={`bg-blue-600 text-white fixed top-0 left-0 transition-all duration-300 shadow-lg 
        ${isOpen ? "w-64" : "w-20"} flex-col justify-between`}>

      {/* Sidebar Top (Header + Menus) */}
      <div>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4">
          {isOpen && <h1 className="text-xl font-bold">Dashboard</h1>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-full hover:bg-blue-500"
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Sidebar Menu */}
        <ul className="space-y-2 mt-6">
          {/* Students */}
          <li
            className="flex items-center gap-3 px-4 py-2 hover:bg-blue-500 rounded-lg cursor-pointer"
            onClick={() => navigate("/getstudentbydepartment")}
          >
            <Users size={20} />
            {isOpen && <span>Students</span>}
          </li>

          {/* Courses */}
          <li className="flex items-center gap-3 px-4 py-2 hover:bg-blue-500 rounded-lg cursor-pointer" onClick={()=>{
            navigate('/course')
          }}>
            <BookOpen size={20} />
            {isOpen && <span>Courses</span>}
          </li>

          {/* Departments */}
          <li
            className="flex items-center gap-3 px-4 py-2 hover:bg-blue-500 rounded-lg cursor-pointer"
            onClick={() => navigate("/department")}
          >
            <GraduationCap size={20} />
            {isOpen && <span>Departments</span>}
          </li>

         
          {userData.role!=='student'&& userData.role!=='admin'&&<li
            className="flex items-center gap-3 px-4 py-2 hover:bg-blue-500 rounded-lg cursor-pointer"
            onClick={() => navigate("/register")}
          >
            <Users size={20} />
            {isOpen && <span>Register</span>}
          </li>}

          {/* Add dropdown */}
          {userData?.role !== "student" && (
            <li>
              <div
                className="flex items-center gap-3 px-4 py-2 hover:bg-blue-500 rounded-lg cursor-pointer justify-between"
                onClick={() => toggleMenu("add")}
              >
                <span className="flex items-center gap-3">
                  <ChevronDown size={20} />
                  {isOpen && <span>Add</span>}
                </span>
              </div>
              {openMenu === "add" && isOpen && (
                <ul className="ml-10 mt-1 space-y-1">
                  {menus.add.map((item) => (
                   (userData.role=='admin' && item.label=='Department') || (userData.role=='admin' && item.label=='Course') || (userData.role=='admin' && item.label=='Teacher') || (userData.role=='deptadmin' && item.label=='Department') ? 
                  null
                  :(<li
                      key={item.label}
                      className="px-3 py-1 text-sm rounded-lg hover:bg-blue-500 cursor-pointer"
                      onClick={() => navigate(item.path)}
                    >
                      {item.label}
                    </li>)
                  ))}
                </ul>
              )}
            </li>
          )}

          {/* Update dropdown */}
          {userData?.role !== "student" && (
            <li>
              <div
                className="flex items-center gap-3 px-4 py-2 hover:bg-blue-500 rounded-lg cursor-pointer justify-between"
                onClick={() => toggleMenu("update")}
              >
                <span className="flex items-center gap-3">
                  <ChevronDown size={20} />
                  {isOpen && <span>Update</span>}
                </span>
              </div>
              {openMenu === "update" && isOpen && (
                <ul className="ml-10 mt-1 space-y-1">
                  {menus.update.map((item) => (
                    <li
                      key={item.label}
                      className="px-3 py-1 text-sm rounded-lg hover:bg-blue-500 cursor-pointer"
                      onClick={() => navigate(item.path)}
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )}

          {/* Dashboard moved to bottom */}
          <li
            className="flex items-center gap-3 px-4 py-2 hover:bg-blue-500 rounded-lg cursor-pointer"
            onClick={() => navigate("/")}
          >
            <LayoutDashboard size={20} />
            {isOpen && <span>Dashboard</span>}
          </li>
        </ul>
      </div>

      {/* Profile Section at Bottom */}
      <div className="relative">
  {/* Profile Section (always visible) */}
  <div
    className="p-4 border-t border-blue-500 flex items-center gap-3 hover:bg-blue-500 cursor-pointer"
    onClick={() => {
      if (userData.role === "student") {
        navigate("/profile",{state:{id:userData.id}});
        console.log(userData.id)
      } else {
        setOpenProfile(!openProfile);
      }
    }}
  >
    <User2 size={28} className="text-white" />

    {isOpen && (
      <div>
        <p className="font-medium">{userData.name}</p>
        <p className="text-sm text-gray-200">{userData.email}</p>
      </div>
    )}
  </div>

  {/* Dropdown (only for non-student roles) */}
  {isOpen && openProfile && userData.role!== "student" && (
  <div className="left-0 top-full mt-2 shadow-lg rounded-lg overflow-hidden z-50 text-center">
    <button
      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
      onClick={() => navigate("/changePassword")}
    >
      Change Password
    </button>
    <button
      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
      onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged out successfully");
        navigate("/login");
      }}
    >
      Logout
    </button>
  </div>
)}

</div>

    </div>
  );
};

export default Sidebar;
