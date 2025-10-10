import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const toggleShow = (field) => {
    setShow({ ...show, [field]: !show[field] });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }
    try{
    const response=await api.post('/update/password',{oldPassword,newPassword});
    if(response) toast.success("Password changed successfully!");
    else toast.error("Failed to change the password");
  }catch(err){
    toast.error(err.response.data.message);
  }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Old Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Old Password
            </label>
            <div className="relative">
              <input
                type={show.old ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter old password"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                onClick={() => toggleShow("old")}
                className="absolute right-3 top-2.5 text-sm text-gray-500 cursor-pointer"
              >
                {show.old ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              New Password
            </label>
            <div className="relative">
              <input
                type={show.new ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                onClick={() => toggleShow("new")}
                className="absolute right-3 top-2.5 text-sm text-gray-500 cursor-pointer"
              >
                {show.new ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={show.confirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                onClick={() => toggleShow("confirm")}
                className="absolute right-3 top-2.5 text-sm text-gray-500 cursor-pointer"
              >
                {show.confirm ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-2 mt-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
