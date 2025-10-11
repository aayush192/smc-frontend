import React, { useState, useEffect, useContext } from "react";
import Context from "../context/context";
import uiContext from "../context/uiContext";
import { useNavigate } from "react-router-dom";

const CoursesPage = () => {
  const Navigate=useNavigate();
  const {course} = useContext(Context);
  const {isOpen}=useContext(uiContext);

  useEffect(() => {
      if (!localStorage.getItem("token")) {
        Navigate("/login");
      }
    }, [Navigate]);
  return (
    <div className={`min-h-screen bg-gray-50 transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"} p-6`}>
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Available Courses</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {course.map((crs) => (
          <div 
            key={crs.id} 
            className="bg-white rounded-xl shadow-md p-4 text-center font-medium hover:shadow-lg transition"
           onClick={()=>{
            Navigate('/teacher',{state:{id:crs.id}})
           }}>
            {crs.courseTitle}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default CoursesPage;
