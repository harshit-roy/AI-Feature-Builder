import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import api from "../api/axios"
import { useNavigate } from "react-router-dom"
import { FaSpinner, FaPlus } from "react-icons/fa"
import FeatureCard from "../components/FeatureCard"

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const [prompt, setPrompt] = useState("")
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [submitMessage, setSubmitMessage] = useState("")

  const fetchRequests = async () => {
    try {
      const res = await api.get("/features/my", {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setRequests(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (!user) navigate("/login")
    else fetchRequests()
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    setError("")
    setSubmitMessage("")

    try {
      const res = await api.post(
        "/features/request",
        { prompt },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )

      setRequests([res.data.feature, ...requests])
      setPrompt("")
      setSubmitMessage("Your request is in progress. Admin review will happen next.")
    } catch (err) {
      setError(err.response?.data?.message || "Error")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black via-gray-900 to-blue-900 opacity-80 animate-gradient-x"></div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg text-white">
            Dashboard
          </h1>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow-lg flex items-center gap-2 transition"
            onClick={logout}
          >
            Logout
          </button>
        </div>

        <p className="text-gray-400 mb-4">
          Type a prompt to generate a <span className="text-blue-400 font-semibold">feature page</span>.
          The final deployment call will happen from the admin panel.
        </p>

        <form
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 shadow-lg border border-gray-800"
          onSubmit={handleSubmit}
        >
          <label className="block font-semibold mb-2 text-blue-400">
            Describe the feature you want to generate
          </label>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="E.g., A login page with animated background..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 p-4 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition placeholder:text-gray-400 bg-black/20 text-white truncate"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 justify-center transition shadow-lg disabled:opacity-50"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
              {loading ? "Requesting..." : "Request Deploy"}
            </button>
          </div>

          {error && <p className="text-red-500 mt-3">{error}</p>}
          {submitMessage && <p className="text-green-400 mt-3">{submitMessage}</p>}

          {loading && (
            <div className="mt-4 flex items-center gap-3 text-blue-300">
              <FaSpinner className="animate-spin" />
              <span>Your request is in progress...</span>
            </div>
          )}
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <FeatureCard key={req._id} feature={req} darkMode />
          ))}

          {requests.length === 0 && (
            <div className="text-gray-400 text-center col-span-full py-20 text-lg opacity-80">
              No feature requests yet. Submit one above.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}