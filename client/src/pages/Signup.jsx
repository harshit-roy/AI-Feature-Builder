import { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { FaEnvelope, FaLock, FaUserPlus, FaSpinner } from "react-icons/fa"

export default function Signup() {
  const { signupUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await signupUser(email, password)

    if (res.success) {
      navigate("/dashboard")
    } else {
      setError(res.message)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#07111f] text-white relative overflow-hidden flex items-center justify-center px-4 py-10">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[380px] w-[380px] bg-emerald-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 h-[380px] w-[380px] bg-cyan-500/10 blur-3xl rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.10),transparent_35%)]" />
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 rounded-[32px] overflow-hidden border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-2xl">
        {/* Left panel */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10 border-r border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 text-sm font-medium mb-6">
              Create Account
            </div>

            <h1 className="text-4xl font-extrabold leading-tight">
              Join the platform and start requesting AI-generated feature pages
            </h1>

            <p className="mt-5 text-slate-300 leading-8 text-lg">
              Create an account to submit feature requests, track their status,
              and explore deployed experiences built through the AI workflow.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-10">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-white font-bold text-lg">Fast Onboarding</div>
              <div className="text-slate-400 text-sm mt-1">Start in seconds</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-white font-bold text-lg">Request Tracking</div>
              <div className="text-slate-400 text-sm mt-1">See every status update</div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="p-6 sm:p-8 md:p-10">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold">Signup</h2>
              <p className="text-slate-400 mt-2">
                Create your account to enter the platform.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-rose-300 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 pl-11 pr-4 py-3.5 text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 pl-11 pr-4 py-3.5 text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-bold py-3.5 flex items-center justify-center gap-2 transition disabled:opacity-60"
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

            <p className="mt-6 text-sm text-slate-400 text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-300 hover:text-emerald-200 font-semibold transition"
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