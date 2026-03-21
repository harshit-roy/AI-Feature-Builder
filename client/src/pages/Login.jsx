import { useState, useContext } from "react"
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
    <div className="min-h-screen bg-[#07111f] text-white relative overflow-hidden flex items-center justify-center px-4 py-10">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 h-[380px] w-[380px] bg-sky-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 h-[380px] w-[380px] bg-violet-500/10 blur-3xl rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_35%)]" />
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 rounded-[32px] overflow-hidden border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-2xl">
        {/* Left panel */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-sky-500/10 via-transparent to-violet-500/10 border-r border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sky-400/20 bg-sky-400/10 text-sky-300 text-sm font-medium mb-6">
              Welcome Back
            </div>

            <h1 className="text-4xl font-extrabold leading-tight">
              Sign in to continue building and deploying AI-powered pages
            </h1>

            <p className="mt-5 text-slate-300 leading-8 text-lg">
              Access your dashboard, manage requests, preview generated features,
              and continue your workflow from one place.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-10">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-white font-bold text-lg">AI Workflow</div>
              <div className="text-slate-400 text-sm mt-1">Prompt → Review → Deploy</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-white font-bold text-lg">Live Preview</div>
              <div className="text-slate-400 text-sm mt-1">Inspect before publishing</div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="p-6 sm:p-8 md:p-10">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold">Login</h2>
              <p className="text-slate-400 mt-2">
                Enter your credentials to access the dashboard.
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
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 pl-11 pr-4 py-3.5 text-white placeholder:text-slate-500 outline-none focus:border-sky-500 transition"
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 pl-11 pr-4 py-3.5 text-white placeholder:text-slate-500 outline-none focus:border-sky-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-300 hover:to-cyan-300 text-slate-950 font-bold py-3.5 flex items-center justify-center gap-2 transition disabled:opacity-60"
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

            <p className="mt-6 text-sm text-slate-400 text-center">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-sky-300 hover:text-sky-200 font-semibold transition"
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