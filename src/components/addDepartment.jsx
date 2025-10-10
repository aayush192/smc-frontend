import React, { useContext, useState,useEffect} from "react";
import {toast } from "react-toastify";
import {useNavigate} from 'react-router-dom'
import api from "../api/axios.js";
import Context from "../context/context.js";

const AddDepartment = () => {
  const Navigate=useNavigate();
  const [name, setName] = useState("");
  const {department, setDepartment} = useContext(Context);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      Navigate("/login");
    }
  }, [Navigate]);

  const handleAdd = async() => {
    if (name.trim() === "") return;
    try{
    const response=await api.post('/add/department',{name});
    if(response){
      toast.success("department added successfully")
    console.log(response);
    setName("");
    }
  }catch(err) {
    toast.error(err.response.data.message);
    if(err.response.data.message=='token is not valid') navigate('/login');
  };

}
  return (
    <div className="max-w-md mx-auto p-6 bg-gray-50 rounded-lg shadow  mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Add Department</h2>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Department Name"
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddDepartment;
