import React, { useState, useEffect, useContext } from "react";
import api from "../api/axios.js";
import uiContext from "../context/uiContext.js";
import { useNavigate } from "react-router-dom";

const StudentsByDepartment = () => {
  const navigate=useNavigate();
  const { isOpen } = useContext(uiContext);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const limit = 1;
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(""); // frontend search

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      Navigate("/login");
    }
  }, [Navigate]);

  const fetchData = async (currentPage = 1) => {
    setLoading(true);
    try {
      const res = await api.get(
        `/getStudentByDepartment?page=${currentPage}&limit=${limit}`
      );
      if (res.data.success) {
        setData(res.data.result);
        setPagination(res.data.pagination);
        setFilteredData(res.data.result); // initialize filtered data
      }
    } catch (err) {
      console.error(err);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  // Filter data whenever search changes
  useEffect(() => {
    if (!search) {
      setFilteredData(data);
      console.log(data);
    } else {
      const filtered = data.map((group) => {
        const filteredStudents = group.students.filter((student) =>
          student.user.name.toLowerCase().includes(search.toLowerCase()) ||
          student.user.email.toLowerCase().includes(search.toLowerCase())
        );
        return { ...group, students: filteredStudents };
      });
      setFilteredData(filtered);
    }
  }, [search, data]);

  const handlePrev = () => {
    if (pagination.hasPrev) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (pagination.hasNext) setPage((p) => p + 1);
  };


  return (
    <div
      className={`min-h-screen bg-gray-100 transition-all duration-300 ${
        isOpen ? "ml-64" : "ml-20"
      } p-8`}
    >
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Students by Department
        </h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
          </div>
        )}

        {!loading && filteredData.length === 0 && (
          <p className="text-gray-600 text-lg text-center py-12">
            No departments found.
          </p>
        )}

        {!loading &&
          filteredData.map((group) => (
            <div
              key={group.department.id}
              className="mb-8 bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >{console.log(group)}
              <h2 className="text-2xl font-bold text-indigo-700 mb-5 tracking-wide">
                {group.department.name}
              </h2>

              {group.students.length === 0 ? (
                <p className="text-gray-600 text-center py-4">
                  No students in this department.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-left min-w-[600px]">
                    <thead>
                      <tr className="bg-indigo-600 text-white">
                        <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">
                          Gender
                        </th>
                        <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">
                          Symbol No
                        </th>
                        <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">
                          Semester
                        </th>
                        <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.students.map((student) => (
                        <tr
                          key={student.id}
                          className="border-b border-gray-200 hover:bg-indigo-50 transition-colors duration-200"
                        >
                          {console.log(student)}
                          <td className="px-6 py-4 text-gray-800">
                            {student.user.name}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {student.user.email}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {student.user.gender}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {student.symbolno}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {student.semester}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>{
                                {console.log(student.id)}
                                navigate('/profile',{state:{id:student.user.id}})
                              }}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold hover:bg-indigo-700 transition-colors duration-200"
                            >
                              View Profile
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-8">
          <button
            className={`px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md`}
            onClick={handlePrev}
            disabled={!pagination.hasPrev}
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium text-lg">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            className={`px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md`}
            onClick={handleNext}
            disabled={!pagination.hasNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentsByDepartment;
