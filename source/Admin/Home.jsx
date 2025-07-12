
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { ArrowRight, Users, Star, MessageCircle } from "lucide-react"

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="bg-[#1e1e2f] min-h-screen text-white py-16 px-4">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
       Grow Your Skills. Help Others Grow Theirs.
        </h1>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
         Join a community of learners and mentors helping each other grow. Share what you know, and discover new skills — all for free.
        </p>

        {!user ? (
          <div className="space-x-4">
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 text-lg rounded-md bg-[#7f5af0] hover:bg-[#6e4de0] transition"
            >
              Get Started <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 text-lg rounded-md border border-gray-500 hover:bg-gray-800 transition"
            >
              Log In
            </Link>
          </div>
        ) : (
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 text-lg rounded-md bg-[#7f5af0] hover:bg-[#6e4de0] transition"
          >
            Go to Dashboard <ArrowRight className="ml-2" size={20} />
          </Link>
        )}
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 py-24 px-2">
        <FeatureCard
          icon={<Users size={32} className="text-[#7f5af0]" />}
          title="Find Skill Partners"
          description="Browse profiles and find people with skills you want to learn."
        />
        <FeatureCard
          icon={<MessageCircle size={32} className="text-[#7f5af0]" />}
          title="Request Swaps"
          description="Send swap requests and collaborate to learn and teach."
        />
        <FeatureCard
          icon={<Star size={32} className="text-[#7f5af0]" />}
          title="Rate & Review"
          description="Build trust and transparency through reviews and feedback."
        />
      </div>

      {/* How it Works Section */}
      <div className="bg-[#2a2a40] rounded-2xl shadow-lg p-10 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: 1, title: "Create Profile", desc: "List your skills and learning interests" },
            { step: 2, title: "Find & Connect", desc: "Explore and message potential swap partners" },
            { step: 3, title: "Exchange Skills", desc: "Meet online or offline to teach & learn" },
            { step: 4, title: "Rate Experience", desc: "Share your feedback to grow the community" },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="bg-[#7f5af0] w-12 h-12 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                {item.step}
              </div>
              <h4 className="font-semibold mb-2">{item.title}</h4>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const FeatureCard = ({ icon, title, description }) => (
  <div className="text-center bg-[#2a2a40] p-6 rounded-xl shadow hover:bg-[#373759] transition">
    <div className="w-16 h-16 rounded-full bg-[#3a3a56] flex items-center justify-center mx-auto mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
)

export default Home
