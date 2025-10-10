import React, { useContext, useEffect, useState } from "react";
import api from "../api/axios"; // your axios instance
import Context from "../context/context";
import { Building2 } from "lucide-react"; // icon for department
import uiContext from "../context/uiContext";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const { department } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const {isOpen}=useContext(uiContext);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        setDepartments(department);
      } catch (err) {
        setError("Failed to load departments.");
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  if (loading) {
    return <p className="text-center py-6 text-gray-500">Loading departments...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-6">{error}</p>;
  }

  return (
    <div
    className={`min-h-screen bg-gray-50 transition-all duration-300 ${
      isOpen ? "ml-64" : "ml-20"
    } p-6`}
  >
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        📚 Departments
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {departments.map((dept, i) => (
          <div
            key={dept.id}
            className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-2xl p-4 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                {dept.name}
              </h3>
              {dept.description && (
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {dept.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Departments;
