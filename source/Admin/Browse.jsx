"use client"

import { useState, useEffect } from "react"
import api from "../services/api"
import { 
  Filter, 
  Star, 
  Clock, 
  Send, 
  Award, 
  Target, 
  Globe,
  Sparkles,
  Calendar,
  ArrowRight,
  Heart,
  Zap
} from "lucide-react"
import toast from "react-hot-toast"
import UserRating from "../components/UserRating"
import { Link } from "react-router-dom"

const Browse = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [searchTerm, users])

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users/browse")
      setUsers(response.data)
      setFilteredUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users)
      return
    }

    const searchLower = searchTerm.toLowerCase()
    const filtered = users.filter((user) => {
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.location?.toLowerCase().includes(searchLower) ||
        user.skillsOffered?.some((skill) => skill.toLowerCase().includes(searchLower)) ||
        user.skillsWanted?.some((skill) => skill.toLowerCase().includes(searchLower))
      )
    })
    setFilteredUsers(filtered)
  }

  const sendSwapRequest = async (targetUserId) => {
    try {
      await api.post("/swaps/request", { targetUserId })
      toast.success("Swap request sent!")
    } catch (error) {
      console.error("Error sending swap request:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-300 border-t-purple-600 mb-4"></div>
            <p className="text-lg font-medium text-purple-300">Discovering amazing people...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-4">
            Discover Your Next
            <br />
            <span className="text-3xl md:text-4xl">Skill Exchange Partner</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Connect with talented individuals ready to share knowledge and learn together
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search skills, locations, or names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-700 bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Results Section */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-slate-800 to-gray-800 rounded-full mb-6">
              <Heart className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No matches found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Try adjusting your search or explore different skill categories to find your perfect learning partner
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="group relative bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-700/50 hover:scale-105 hover:border-purple-500/50"
              >
                {/* Profile Header */}
                <div className="flex items-start mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-2xl">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <Link
                      to={`/user/${user._id}`}
                      className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors"
                    >
                      {user.name}
                    </Link>
                    {user.location && (
                      <div className="flex items-center text-gray-400 text-sm">
                        <Globe className="w-4 h-4 mr-1" />
                        {user.location}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {user.bio && (
                  <p className="text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {user.bio}
                  </p>
                )}

                {/* Skills Offered */}
                {user.skillsOffered && user.skillsOffered.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <Award className="w-4 h-4 text-green-400 mr-2" />
                      <h4 className="font-semibold text-sm text-green-400">Expertise</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {user.skillsOffered.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 text-green-300 px-3 py-1.5 rounded-full text-xs font-medium border border-green-700/50"
                        >
                          {skill}
                        </span>
                      ))}
                      {user.skillsOffered.length > 3 && (
                        <span className="text-gray-400 text-xs px-3 py-1.5 bg-slate-700/50 rounded-full">
                          +{user.skillsOffered.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Skills Wanted */}
                {user.skillsWanted && user.skillsWanted.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <Target className="w-4 h-4 text-amber-400 mr-2" />
                      <h4 className="font-semibold text-sm text-amber-400">Learning Goals</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {user.skillsWanted.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-amber-900/50 to-yellow-900/50 text-amber-300 px-3 py-1.5 rounded-full text-xs font-medium border border-amber-700/50"
                        >
                          {skill}
                        </span>
                      ))}
                      {user.skillsWanted.length > 3 && (
                        <span className="text-gray-400 text-xs px-3 py-1.5 bg-slate-700/50 rounded-full">
                          +{user.skillsWanted.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Availability */}
                {user.availability && (
                  <div className="flex items-center text-gray-400 text-sm mb-6">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{user.availability}</span>
                  </div>
                )}

                {/* Rating & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div className="flex items-center">
                    <UserRating rating={user.averageRating} totalRatings={user.totalRatings} size="sm" />
                  </div>
                  
                  <button
                    onClick={() => sendSwapRequest(user._id)}
                    className="group/btn bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center shadow-lg hover:shadow-xl"
                  >
                    <Send className="w-4 h-4 mr-2 group-hover/btn:translate-x-0.5 transition-transform" />
                    Connect
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Browse