import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { FaEnvelope, FaLock, FaUserPlus, FaSpinner } from "react-icons/fa"

export default function Signup() {
  const { user, loading: authLoading, signupUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = "Signup • AI Feature Builder"
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (user) navigate("/dashboard")
  }, [user, authLoading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading) return

    const trimmedEmail = email.trim()

    if (!trimmedEmail || !password.trim()) {
      setError("Please enter email and password.")
      return
    }

    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setError("Please enter a valid email address.")
      return
    }

    if (password.trim().length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setError("")
    setLoading(true)

    try {
      const res = await signupUser(trimmedEmail, password)

      if (res.success) {
        navigate("/dashboard")
      } else {
        setError(res.message || "Signup failed. Please try again.")
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#EEF2FB] flex items-center justify-center px-4">
        <div className="inline-flex items-center gap-3 rounded-2xl border border-[#E6EBF5] bg-white px-5 py-4 text-[#64748B] shadow-sm">
          <FaSpinner className="animate-spin text-[#6D5DF6]" />
          Checking session...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#EEF2FB] flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-80px] right-[-80px] h-[300px] w-[300px] bg-[#8A7CFF]/20 blur-3xl rounded-full" />
        <div className="absolute bottom-[-80px] left-[-80px] h-[300px] w-[300px] bg-[#F472B6]/15 blur-3xl rounded-full" />
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 rounded-[32px] overflow-hidden border border-[#E6EBF5] bg-white shadow-[0_30px_80px_rgba(31,42,68,0.08)]">
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-[#EEF2FF] via-white to-[#FDF4FB] border-r border-[#E6EBF5]">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EEF2FF] text-[#6D5DF6] text-sm font-semibold mb-6">
              Create Account
            </div>

            <h1 className="text-4xl font-extrabold leading-tight text-[#1F2A44]">
              Start building AI-powered feature pages today
            </h1>

            <p className="mt-5 text-[#64748B] leading-8 text-lg">
              Create an account to submit feature requests, track progress, and explore live deployed pages built using AI.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-10">
            <div className="rounded-2xl border border-[#E6EBF5] bg-white p-4 shadow-sm">
              <div className="text-[#1F2A44] font-bold text-lg">Fast Onboarding</div>
              <div className="text-[#64748B] text-sm mt-1">Start in seconds</div>
            </div>

            <div className="rounded-2xl border border-[#E6EBF5] bg-white p-4 shadow-sm">
              <div className="text-[#1F2A44] font-bold text-lg">Track Requests</div>
              <div className="text-[#64748B] text-sm mt-1">Monitor every status</div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 md:p-10">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-[#1F2A44]">Signup</h2>
              <p className="text-[#64748B] mt-2">
                Create your account to enter the platform.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#64748B] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError("")
                    }}
                    className="w-full rounded-2xl border border-[#E6EBF5] bg-[#F9FBFF] pl-11 pr-4 py-3.5 text-[#1F2A44] placeholder:text-[#94A3B8] outline-none focus:border-[#6D5DF6] focus:ring-2 focus:ring-[#6D5DF6]/10 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#64748B] mb-2">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (error) setError("")
                    }}
                    className="w-full rounded-2xl border border-[#E6EBF5] bg-[#F9FBFF] pl-11 pr-4 py-3.5 text-[#1F2A44] placeholder:text-[#94A3B8] outline-none focus:border-[#6D5DF6] focus:ring-2 focus:ring-[#6D5DF6]/10 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-[#6D5DF6] to-[#8A7CFF] text-white font-semibold py-3.5 flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Signup
                    <FaUserPlus />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-sm text-[#64748B] text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#6D5DF6] hover:underline font-semibold"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}