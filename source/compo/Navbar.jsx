import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Menu, X, User, LogOut, Settings } from "lucide-react"
import { useState } from "react"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsMenuOpen(false)
  }

  return (
    <nav className="backdrop-blur-md bg-[#1e1e2f]/80 border-b border-[#2e2e3e] text-white z-50 fixed w-full top-0 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className="text-2xl font-extrabold text-[#7f5af0] tracking-tight">
            SkillSwap
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <NavLink to="/dashboard" label="Dashboard" />
                <NavLink to="/browse" label="Find Users" />
                <NavLink to="/swap-requests" label="Requests" />
                {user.role === "admin" && <NavLink to="/admin" label="Admin Panel" />}

                <div className="relative group">
                  <button className="flex items-center space-x-2 rounded-full px-3 py-1 hover:bg-[#2e2e4e] transition">
                    <User size={18} />
                    <span className="text-sm">{user.name}</span>
                  </button>

                  <div className="absolute right-0 mt-2 w-48 bg-[#2a2a40] rounded-xl shadow-xl z-20 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300">
                    <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#38385c]">
                      <Settings size={16} className="mr-2" />
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#38385c]"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login" label="Login" />
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-full bg-[#7f5af0] hover:bg-[#6a4de0] text-sm font-semibold transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 rounded-lg bg-[#242438] p-4 space-y-2 transition-all">
            {user ? (
              <>
                <MobileNavLink to="/dashboard" label="Dashboard" setIsMenuOpen={setIsMenuOpen} />
                <MobileNavLink to="/browse" label="Browse Users" setIsMenuOpen={setIsMenuOpen} />
                <MobileNavLink to="/swap-requests" label="Swap Requests" setIsMenuOpen={setIsMenuOpen} />
                <MobileNavLink to="/profile" label="Profile Settings" setIsMenuOpen={setIsMenuOpen} />
                {user.role === "admin" && (
                  <MobileNavLink to="/admin" label="Admin Panel" setIsMenuOpen={setIsMenuOpen} />
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 px-3 rounded-lg text-gray-300 hover:bg-[#38385c]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/login" label="Login" setIsMenuOpen={setIsMenuOpen} />
                <MobileNavLink to="/register" label="Sign Up" setIsMenuOpen={setIsMenuOpen} />
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

const NavLink = ({ to, label }) => (
  <Link
    to={to}
    className="text-sm font-medium text-gray-300 hover:text-white hover:underline transition"
  >
    {label}
  </Link>
)

const MobileNavLink = ({ to, label, setIsMenuOpen }) => (
  <Link
    to={to}
    onClick={() => setIsMenuOpen(false)}
    className="block py-2 px-3 text-gray-300 rounded-lg hover:bg-[#38385c] transition"
  >
    {label}
  </Link>
)

export default Navbar
