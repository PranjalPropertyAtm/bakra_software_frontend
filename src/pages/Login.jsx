import React, { useState } from 'react'
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";

const Login = () => {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
   const [loading, setLoading] = useState(false);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      alert("Login successful ✅");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed ❌";
      console.log(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="w-full max-w-4xl flex shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
        {/* Left Section */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white flex-col items-center justify-center p-10">
          <h2 className="text-3xl font-bold mb-4 text-center">
            BAKRA <br /> Admin Panel
          </h2>
          <p className="text-center text-blue-100 text-sm leading-relaxed">
            Manage your application efficiently with our intuitive admin panel. Monitor user activity, handle content, and configure settings all in one place.
          </p>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-8">
          <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
            Welcome Back
          </h3>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-400 text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          <form action="#" onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-500 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={18} />
                <input
                  id="username"
                  type="email"
                  placeholder="your@email.com"
                  onChange={(e)=>setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-500 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={18} />
                <input
                  id="password"
                  type="password"
                  placeholder="********"
                  onChange={(e)=>setPassword(e.target.value)}
                  required
                  // minLength={6}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2.5 rounded-lg shadow-md hover:opacity-90 transition"
            >
              <LogIn size={18} /> Sign In
            </button>
          </form>

          <div className="mt-4 text-center">
            <a
              href="#"
              className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Forgot Password?
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
