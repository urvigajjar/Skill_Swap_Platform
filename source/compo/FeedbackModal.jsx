"use client"

import { useState, useEffect } from "react"
import { Heart, ThumbsDown, Star, X } from "lucide-react"
import api from "../services/api"
import toast from "react-hot-toast"

const FeedbackModal = ({ swap, isOpen, onClose, onSubmit }) => {
  const [feedback, setFeedback] = useState({
    rating: 5,
    comment: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setFeedback({ rating: 5, comment: "" })
    }
  }, [isOpen, swap])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post(`/swaps/${swap._id}/feedback`, feedback)
      toast.success("Thanks for your feedback! 🎉")
      onSubmit()
      onClose()
    } catch (error) {
      console.error("Error submitting feedback:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRatingClick = (rating) => {
    setFeedback({ ...feedback, rating })
  }

  if (!isOpen || !swap) return null

  const otherUserName = swap.requester?.name || swap.target?.name || "this user"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#1e1e2f] rounded-lg p-6 w-full max-w-md mx-4 border border-gray-700 text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Leave Your Thoughts</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-300 mb-2">
            How did your skill swap go with <span className="font-medium text-purple-400">{otherUserName}</span>?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Your Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className={`p-1 transition-colors ${
                    star <= feedback.rating ? "text-yellow-400" : "text-gray-600 hover:text-yellow-300"
                  }`}
                >
                  <Star size={24} fill="currentColor" />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {feedback.rating === 1 && "Terrible 😞"}
              {feedback.rating === 2 && "Not great 🙁"}
              {feedback.rating === 3 && "Okay 👍"}
              {feedback.rating === 4 && "Good 🙂"}
              {feedback.rating === 5 && "Amazing! 🔥"}
            </p>
          </div>

         

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex-1 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex-1"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FeedbackModal
