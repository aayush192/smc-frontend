import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import uiContext from "../context/uiContext";

const TeachersPage = () => {
  const Navigate=useNavigate();
  const location = useLocation();
  const id = location.state.id;
const {isOpen}=useContext(uiContext);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      Navigate("/login");
    }
  }, [Navigate]);

  useEffect(() => {
    const getTeachers = async () => {
      try {
        const response = await api.get(`/teacher/${id}`);
        if (response.data.success) {
          setTeachers(response.data.result[0].teachers);
        }
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
        if(err.response.data.message=='token is not valid'|| err.response.data.message=='user is not valid'){
          Navigate('/login');
        }
      }
    };

    getTeachers();
  }, [id]);

  return (
    <div
    className={`min-h-screen bg-gray-50 transition-all duration-300 ${
      isOpen ? "ml-64" : "ml-20"
    } p-6`}
  >
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Teachers List
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xl font-semibold mb-4">
                {teacher.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {teacher.name}
              </h2>
              <p className="text-gray-500">{teacher.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default TeachersPage;
