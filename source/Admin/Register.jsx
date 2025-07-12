import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import toast from "react-hot-toast"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const { confirmPassword, ...registerData } = formData
      await register(registerData)
      toast.success("Registration successful!")
      navigate("/dashboard")
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1e1e2f] flex items-center justify-center px-4">
      <div className="bg-[#2a2a40] p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { id: "name", label: "UserName", type: "text", required: true },
            { id: "email", label: "Email", type: "email", required: true },
            { id: "location", label: "City", type: "text", required: true },
            { id: "password", label: "Password", type: "password", required: true },
            { id: "confirmPassword", label: "Confirm Password", type: "password", required: true },
          ].map(({ id, label, type, required }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
                {label}
              </label>
              <input
                type={type}
                id={id}
                name={id}
                value={formData[id]}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#373752] border border-[#4b4b7e] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f5af0]"
                required={required}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7f5af0] hover:bg-[#6a4de0] transition-colors text-white font-semibold py-2 rounded-md disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-[#7f5af0] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
