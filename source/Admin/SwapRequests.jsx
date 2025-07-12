"use client"

import { useState, useEffect } from "react"
import api from "../services/api"
import { CheckCircle, XCircle, Star, Trash, MessageCircle, TimerReset } from "lucide-react"
import toast from "react-hot-toast"
import FeedbackModal from "../components/FeedbackModal"
import { formatDistanceToNow } from "date-fns"

const SwapRequests = () => {
  const [requests, setRequests] = useState({ sent: [], received: [] })
  const [activeTab, setActiveTab] = useState("received")
  const [loading, setLoading] = useState(true)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [selectedSwap, setSelectedSwap] = useState(null)

  useEffect(() => {
    fetchSwapRequests()
  }, [])

  const fetchSwapRequests = async () => {
    try {
      const response = await api.get("/swaps/my-requests")
      setRequests(response.data)
    } catch (error) {
      console.error("Error fetching swap requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRequest = async (requestId, action) => {
    try {
      await api.put(`/swaps/${requestId}/${action}`)
      toast.success(`Request ${action}ed successfully!`)
      fetchSwapRequests()
    } catch (error) {
      console.error(`Error ${action}ing request:`, error)
    }
  }

  const deleteRequest = async (requestId) => {
    try {
      await api.delete(`/swaps/${requestId}`)
      toast.success("Request deleted successfully!")
      fetchSwapRequests()
    } catch (error) {
      console.error("Error deleting request:", error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-900 text-yellow-300"
      case "accepted":
        return "bg-green-900 text-green-300"
      case "rejected":
        return "bg-red-900 text-red-300"
      case "completed":
        return "bg-blue-900 text-blue-300"
      case "cancelled":
        return "bg-gray-800 text-gray-300"
      default:
        return "bg-gray-900 text-gray-300"
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-white">Loading swap requests...</div>
  }

  const currentRequests = requests[activeTab]

  return (
    <div className="max-w-6xl mx-auto text-white">
      <h1 className="text-3xl font-bold text-white mb-8">Swap Requests</h1>

      {/* Tabs */}
      <div className="flex space-x-2 mb-8 border-b border-gray-700">
        <button
          onClick={() => setActiveTab("received")}
          className={`px-5 py-3 -mb-px border-b-2 text-lg font-medium transition-colors duration-200 ${
            activeTab === "received"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-gray-400 hover:border-gray-600 hover:text-white"
          }`}
        >
          Received ({requests.received.length})
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`px-5 py-3 -mb-px border-b-2 text-lg font-medium transition-colors duration-200 ${
            activeTab === "sent"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-gray-400 hover:border-gray-600 hover:text-white"
          }`}
        >
          Sent ({requests.sent.length})
        </button>
      </div>

      {/* Requests List */}
      <div className="space-y-6">
        {currentRequests.length === 0 ? (
          <div className="card text-center py-16 flex flex-col items-center justify-center bg-[#2a2a40] border border-gray-700">
            <MessageCircle size={48} className="text-gray-500 mb-4" />
            <p className="text-xl text-gray-300 font-semibold mb-2">No {activeTab} requests found.</p>
            <p className="text-gray-400">
              {activeTab === "received"
                ? "You haven't received any swap requests yet. Share your profile to get started!"
                : "You haven't sent any swap requests yet. Browse users to find someone to swap with!"}
            </p>
          </div>
        ) : (
          currentRequests.map((request) => (
            <div
              key={request._id}
              className="card p-6 border border-gray-700 bg-[#1e1e2f] hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-purple-400 font-bold text-xl">
                        {activeTab === "received"
                          ? request.requester.name.charAt(0).toUpperCase()
                          : request.target.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">
                        {activeTab === "received"
                          ? `Swap Request from ${request.requester.name}`
                          : `Request to ${request.target.name}`}
                      </h3>
                      <p className="text-sm text-gray-400 flex items-center">
                        <TimerReset size={14} className="mr-1" />
                        {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  {request.message && (
                    <p className="text-gray-300 bg-gray-900 p-3 rounded-md border border-gray-700 mb-3 text-sm italic">
                      "{request.message}"
                    </p>
                  )}

                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(request.status)}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                    {request.scheduledDate && (
                      <span className="text-sm text-gray-400">
                        Scheduled: {new Date(request.scheduledDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {request.status === "completed" && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      {request.feedback?.rating ? (
                        <div className="bg-green-950 border border-green-700 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <CheckCircle size={20} className="text-green-400 mr-2" />
                            <p className="text-green-300 font-medium">Feedback Submitted</p>
                          </div>
                          <div className="flex items-center mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={18}
                                className={`${
                                  star <= request.feedback.rating ? "text-yellow-400 fill-current" : "text-gray-700"
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-base font-semibold text-white">
                              {request.feedback.rating}/5
                            </span>
                          </div>
                          {request.feedback.comment && (
                            <p className="text-sm text-gray-400 italic mt-2">"{request.feedback.comment}"</p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Reviewed {formatDistanceToNow(new Date(request.feedback.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedSwap(request)
                            setShowFeedbackModal(true)
                          }}
                          className="inline-flex items-center px-4 py-2 bg-purple-900 text-purple-300 rounded-lg hover:bg-purple-800 transition-colors text-sm font-medium"
                        >
                          <Star size={16} className="mr-2" />
                          Leave Feedback
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 md:ml-4 flex-shrink-0">
                  {activeTab === "received" && request.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleRequest(request._id, "accept")}
                        className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center justify-center"
                        title="Accept Request"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleRequest(request._id, "reject")}
                        className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center justify-center"
                        title="Reject Request"
                      >
                        <XCircle size={16} className="mr-2" />
                        Reject
                      </button>
                    </>
                  )}

                  {activeTab === "sent" && request.status === "pending" && (
                    <button
                      onClick={() => deleteRequest(request._id)}
                      className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center justify-center"
                      title="Cancel Request"
                    >
                      <Trash size={16} className="mr-2" />
                      Cancel Request
                    </button>
                  )}

                  {request.status === "accepted" && (
                    <button
                      onClick={() => handleRequest(request._id, "complete")}
                      className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <FeedbackModal
        swap={selectedSwap}
        isOpen={showFeedbackModal}
        onClose={() => {
          setShowFeedbackModal(false)
          setSelectedSwap(null)
        }}
        onSubmit={fetchSwapRequests}
      />
    </div>
  )
}

export default SwapRequests