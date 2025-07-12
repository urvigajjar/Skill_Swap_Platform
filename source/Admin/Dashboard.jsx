"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"
import { Edit, Star, Clock, Users, MessageSquare } from "lucide-react"

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalSwaps: 0,
    pendingRequests: 0,
    completedSwaps: 0,
    averageRating: 0,
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [platformMessages, setPlatformMessages] = useState([])

  useEffect(() => {
    fetchDashboardData()
    
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        api.get("/users/stats"),
        api.get("/swaps/recent"),
      ])
      setStats(statsRes.data)
      setRecentActivity(activityRes.data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }



  if (loading) {
    return <div className="text-center text-white py-10">Loading dashboard...</div>
  }

  return (
    <div className="min-h-screen bg-[#1e1e2f] text-white py-10 px-4 md:px-8">
      {/* Welcome */}
      <div className="bg-[#2a2a40] p-6 rounded-2xl shadow-lg mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name} 👋</h1>
        <p className="text-gray-400">Here's a quick overview of your activity</p>
      </div>

  


      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Users size={24} className="text-[#7f5af0]" />}
          value={stats.totalSwaps}
          label="Total Swaps"
        />
        <StatCard
          icon={<Clock size={24} className="text-yellow-400" />}
          value={stats.pendingRequests}
          label="Pending Requests"
        />
        <StatCard
          icon={<Users size={24} className="text-green-400" />}
          value={stats.completedSwaps}
          label="Completed Swaps"
        />
        <StatCard
          icon={<Star size={24} className="text-purple-400" />}
          value={stats.averageRating ? stats.averageRating.toFixed(1) : "N/A"}
          label="Average Rating"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-[#2a2a40] p-6 rounded-2xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickAction
            icon={<Edit size={22} className="text-[#7f5af0]" />}
            title="Update Profile"
            desc="Add skills or update availability"
            href="/profile"
          />
          <QuickAction
            icon={<Users size={22} className="text-[#7f5af0]" />}
            title="Browse Users"
            desc="Find people to swap skills with"
            href="/browse"
          />
          <QuickAction
            icon={<Clock size={22} className="text-[#7f5af0]" />}
            title="View Requests"
            desc="Manage your swap requests"
            href="/swap-requests"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#2a2a40] p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="bg-[#373752] p-3 rounded-md flex justify-between items-start">
                <div>
                  <p className="font-medium text-white">{activity.title}</p>
                  <p className="text-sm text-gray-400">{activity.description}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.date}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4">
            No recent activity. Start by browsing users or updating your profile!
          </p>
        )}
      </div>
    </div>
  )
}

const StatCard = ({ icon, value, label }) => (
  <div className="bg-[#2a2a40] p-5 rounded-xl text-center shadow hover:bg-[#353556] transition-colors">
    <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-[#373752] rounded-full">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-white">{value}</h3>
    <p className="text-gray-400">{label}</p>
  </div>
)

const QuickAction = ({ icon, title, desc, href }) => (
  <button
    onClick={() => (window.location.href = href)}
    className="p-4 bg-[#373752] hover:bg-[#4a4a70] rounded-lg text-left transition-colors"
  >
    {icon}
    <h3 className="mt-2 text-white font-medium">{title}</h3>
    <p className="text-sm text-gray-400">{desc}</p>
  </button>
)

export default Dashboard
