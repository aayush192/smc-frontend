import { useState } from "react";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); // State for error message
  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // Clear previous error

    try {
      console.log({ email, password });
      const response = await api.post("/auth", { email, password });
      console.log(response); // Successful login
      // You can store token: localStorage.setItem("token", response.data.result.token)
      localStorage.setItem("token", response.data.result.token);
      localStorage.setItem("user", JSON.stringify(response.data.result));
      if(response){
       navigate('/');
      }
  
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMsg(err.response.data.message); // Show backend message
      } else {
        setErrorMsg("Can't login. Please try again."); // Fallback message
      }
      console.log(err.response);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-bold text-gray-800 text-center mb-6">
          Login
        </h1>

        {errorMsg && (
          <p className="text-center text-red-500 mb-4">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
