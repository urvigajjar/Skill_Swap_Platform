"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import toast from "react-hot-toast"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(formData.email, formData.password)
      toast.success("Login successful!")
      navigate("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Invalid credentials or server error.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1e1e2f] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#2a2a40] rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Log In</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-[#1e1e2f] border border-gray-600 text-white focus:outline-none focus:border-[#7f5af0]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-[#1e1e2f] border border-gray-600 text-white focus:outline-none focus:border-[#7f5af0]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-[#7f5af0] hover:bg-[#6e4de0] text-white font-semibold rounded-md transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#7f5af0] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
