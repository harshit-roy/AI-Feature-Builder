import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { FaEnvelope, FaLock, FaArrowRight, FaSpinner } from "react-icons/fa"

export default function Login() {
  const { loginUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = "Login • AI Feature Builder"
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await loginUser(email, password)

    if (res.success) {
      navigate("/dashboard")
    } else {
      setError(res.message)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#EEF2FB] flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-80px] left-[-80px] h-[300px] w-[300px] bg-[#8A7CFF]/20 blur-3xl rounded-full" />
        <div className="absolute bottom-[-80px] right-[-80px] h-[300px] w-[300px] bg-[#F472B6]/15 blur-3xl rounded-full" />
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 rounded-[32px] overflow-hidden border border-[#E6EBF5] bg-white shadow-[0_30px_80px_rgba(31,42,68,0.08)]">

        {/* Left Panel */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-[#EEF2FF] via-white to-[#FDF4FB] border-r border-[#E6EBF5]">
          
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EEF2FF] text-[#6D5DF6] text-sm font-semibold mb-6">
              Welcome Back
            </div>

            <h1 className="text-4xl font-extrabold leading-tight text-[#1F2A44]">
              Continue building and deploying AI-powered pages
            </h1>

            <p className="mt-5 text-[#64748B] leading-8 text-lg">
              Access your dashboard, manage requests, preview generated features,
              and continue your workflow seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-10">
            <div className="rounded-2xl border border-[#E6EBF5] bg-white p-4 shadow-sm">
              <div className="text-[#1F2A44] font-bold text-lg">AI Workflow</div>
              <div className="text-[#64748B] text-sm mt-1">Prompt → Review → Deploy</div>
            </div>

            <div className="rounded-2xl border border-[#E6EBF5] bg-white p-4 shadow-sm">
              <div className="text-[#1F2A44] font-bold text-lg">Live Preview</div>
              <div className="text-[#64748B] text-sm mt-1">Inspect before publishing</div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="p-6 sm:p-8 md:p-10">
          <div className="max-w-md mx-auto w-full">

            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-[#1F2A44]">Login</h2>
              <p className="text-[#64748B] mt-2">
                Enter your credentials to access the dashboard.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
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
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-[#E6EBF5] bg-[#F9FBFF] pl-11 pr-4 py-3.5 text-[#1F2A44] placeholder:text-[#94A3B8] outline-none focus:border-[#6D5DF6] focus:ring-2 focus:ring-[#6D5DF6]/10 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[#64748B] mb-2">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-[#E6EBF5] bg-[#F9FBFF] pl-11 pr-4 py-3.5 text-[#1F2A44] placeholder:text-[#94A3B8] outline-none focus:border-[#6D5DF6] focus:ring-2 focus:ring-[#6D5DF6]/10 transition"
                  />
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-[#6D5DF6] to-[#8A7CFF] text-white font-semibold py-3.5 flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                    <FaArrowRight />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-sm text-[#64748B] text-center">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-[#6D5DF6] hover:underline font-semibold"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}