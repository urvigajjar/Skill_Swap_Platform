"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"
import toast from "react-hot-toast"
import {
  UserCircle,
  Mail,
  MapPin,
  AlignLeft,
  Clock,
  Eye,
  EyeOff,
  PlusCircle,
  Trash2,
  Save
} from "lucide-react"

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    bio: "",
    availability: "",
    isPublic: true,
  })
  const [skillsOffered, setSkillsOffered] = useState([])
  const [skillsWanted, setSkillsWanted] = useState([])
  const [newSkillOffered, setNewSkillOffered] = useState("")
  const [newSkillWanted, setNewSkillWanted] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        location: user.location || "",
        bio: user.bio || "",
        availability: user.availability || "",
        isPublic: user.isPublic !== false,
      })
      setSkillsOffered(user.skillsOffered || [])
      setSkillsWanted(user.skillsWanted || [])
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const addSkill = (type) => {
    const newSkill = type === "offered" ? newSkillOffered.trim() : newSkillWanted.trim()
    const skills = type === "offered" ? skillsOffered : skillsWanted
    if (newSkill && !skills.includes(newSkill)) {
      type === "offered"
        ? setSkillsOffered([...skills, newSkill])
        : setSkillsWanted([...skills, newSkill])
    }
    type === "offered" ? setNewSkillOffered("") : setNewSkillWanted("")
  }

  const removeSkill = (type, skill) => {
    type === "offered"
      ? setSkillsOffered(skillsOffered.filter((s) => s !== skill))
      : setSkillsWanted(skillsWanted.filter((s) => s !== skill))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updateData = { ...formData, skillsOffered, skillsWanted }
      const response = await api.put("/users/profile", updateData)
      updateUser(response.data.user)
      toast.success("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-100 bg-gray-900 min-h-screen">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-8">Update Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 mb-1 text-sm">
                <UserCircle size={18} /> Username
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded-md p-2 text-white focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 mb-1 text-sm">
                <Mail size={18} /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded-md p-2 text-white focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-1 text-sm">
              <MapPin size={18} /> City
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-gray-700 rounded-md p-2 text-white"
              placeholder="City, State"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 mb-1 text-sm">
              <AlignLeft size={18} /> Introduction
            </label>
            <textarea
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              className="w-full bg-gray-700 rounded-md p-2 text-white"
              placeholder="Tell others about yourself..."
            />
          </div>

          <div>
            <label className="flex items-center gap-2 mb-1 text-sm">
              <Clock size={18} /> Availability
            </label>
            <input
              type="text"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full bg-gray-700 rounded-md p-2 text-white"
              placeholder="e.g., Weekends, Evenings"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm flex items-center gap-1">
              {formData.isPublic ? <Eye size={16} /> : <EyeOff size={16} />} Public Profile
            </label>
          </div>

          {/* Skills Offered */}
          <div>
            <label className="block mb-2 text-sm font-medium">Skills I Can Offer</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {skillsOffered.map((skill, i) => (
                <span key={i} className="bg-green-600 px-3 py-1 rounded-full text-sm flex items-center">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill("offered", skill)}
                    className="ml-2 text-white hover:text-gray-300"
                  >
                    <Trash2 size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillOffered}
                onChange={(e) => setNewSkillOffered(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill("offered"))}
                className="bg-gray-700 flex-1 p-2 rounded-md text-white"
                placeholder="Add a skill to offer"
              />
              <button type="button" onClick={() => addSkill("offered")} className="bg-green-700 p-2 rounded-md">
                <PlusCircle size={16} className="text-white" />
              </button>
            </div>
          </div>

          {/* Skills Wanted */}
          <div>
            <label className="block mb-2 text-sm font-medium">Skills I Want to Learn</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {skillsWanted.map((skill, i) => (
                <span key={i} className="bg-blue-600 px-3 py-1 rounded-full text-sm flex items-center">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill("wanted", skill)}
                    className="ml-2 text-white hover:text-gray-300"
                  >
                    <Trash2 size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillWanted}
                onChange={(e) => setNewSkillWanted(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill("wanted"))}
                className="bg-gray-700 flex-1 p-2 rounded-md text-white"
                placeholder="Add a skill to learn"
              />
              <button type="button" onClick={() => addSkill("wanted")} className="bg-blue-700 p-2 rounded-md">
                <PlusCircle size={16} className="text-white" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 transition-colors p-3 rounded-md flex items-center gap-2"
          >
            <Save size={18} /> {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile
