import { useContext, useEffect, useMemo, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import api from "../api/axios"
import { useNavigate } from "react-router-dom"
import {
  FaSpinner,
  FaPlus,
  FaArrowRight,
  FaRegClock,
  FaRegCircleCheck,
  FaRocket,
  FaCircleExclamation,
  FaWandMagicSparkles,
  FaChartLine
} from "react-icons/fa6"
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
    document.title = "Dashboard • AI Feature Builder"
  }, [])

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

  const readyRequests = useMemo(
    () =>
      requests.filter((req) =>
        ["preview-ready", "approved", "deployed"].includes(req.status)
      ),
    [requests]
  )

  const inProgressRequests = useMemo(
    () =>
      requests.filter((req) =>
        ["pending", "generating"].includes(req.status)
      ),
    [requests]
  )

  const rejectedRequests = useMemo(
    () => requests.filter((req) => req.status === "rejected"),
    [requests]
  )

  const stats = useMemo(() => {
    const total = requests.length
    const ready = readyRequests.length
    const progress = inProgressRequests.length
    const rejected = rejectedRequests.length

    return { total, ready, progress, rejected }
  }, [requests, readyRequests, inProgressRequests, rejectedRequests])

  const firstName =
    user?.email?.split("@")[0]?.replace(/[._-]/g, " ")?.replace(/\b\w/g, (c) => c.toUpperCase()) ||
    "User"

  return (
    <div className="min-h-screen bg-[#EEF2FB] text-[#1F2A44]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-16 -left-16 h-[280px] w-[280px] rounded-full bg-[#8A7CFF]/18 blur-3xl" />
        <div className="absolute top-1/3 -right-16 h-[260px] w-[260px] rounded-full bg-[#F472B6]/12 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[220px] w-[220px] rounded-full bg-[#6D5DF6]/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Hero */}
        <section className="rounded-[32px] border border-white/80 bg-white/80 p-5 shadow-[0_24px_60px_rgba(31,42,68,0.07)] backdrop-blur-sm sm:p-6 lg:p-8">
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FF] px-4 py-2 text-sm font-semibold text-[#6D5DF6]">
                <FaWandMagicSparkles />
                User Workspace
              </div>

              <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Hello {firstName}!
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#64748B] sm:text-base">
                Submit prompts, track request progress, and monitor which pages are ready
                for preview or already deployed. The final deployment workflow still stays
                under admin control.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-[#E7ECF7] bg-[#F9FBFF] p-4 shadow-sm">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="mt-1 text-sm text-[#64748B]">Total Requests</div>
                </div>

                <div className="rounded-2xl border border-[#E7ECF7] bg-[#F9FBFF] p-4 shadow-sm">
                  <div className="text-2xl font-bold text-[#6D5DF6]">{stats.ready}</div>
                  <div className="mt-1 text-sm text-[#64748B]">Ready / Live</div>
                </div>

                <div className="rounded-2xl border border-[#E7ECF7] bg-[#F9FBFF] p-4 shadow-sm">
                  <div className="text-2xl font-bold text-[#F59E0B]">{stats.progress}</div>
                  <div className="mt-1 text-sm text-[#64748B]">In Progress</div>
                </div>

                <div className="rounded-2xl border border-[#E7ECF7] bg-[#F9FBFF] p-4 shadow-sm">
                  <div className="text-2xl font-bold text-[#EF4444]">{stats.rejected}</div>
                  <div className="mt-1 text-sm text-[#64748B]">Rejected</div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[28px] bg-gradient-to-br from-[#6D5DF6] to-[#8A7CFF] p-5 text-white shadow-[0_18px_40px_rgba(109,93,246,0.24)]">
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl bg-white/15 p-3">
                    <FaChartLine className="text-lg" />
                  </div>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                    Overview
                  </span>
                </div>

                <div className="mt-5">
                  <h2 className="text-xl font-bold">Request Activity</h2>
                  <p className="mt-2 text-sm leading-6 text-white/85">
                    Use the prompt box below to request a new feature page. Pages that
                    reach preview-ready or deployed status will appear in the featured section.
                  </p>
                </div>
              </div>

              <div className="rounded-[28px] border border-[#E7ECF7] bg-[#F9FBFF] p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[#EEF2FF] p-3 text-[#6D5DF6]">
                    <FaRocket />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1F2A44]">Admin Deployment Flow</p>
                    <p className="text-sm text-[#64748B]">
                      Submit → Review → Generate → Preview → Deploy
                    </p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="mt-5 w-full rounded-2xl bg-[#1F2A44] px-4 py-3 font-semibold text-white transition hover:opacity-90"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Request form */}
        <section className="mt-6 rounded-[32px] border border-white/80 bg-white/85 p-5 shadow-[0_20px_50px_rgba(31,42,68,0.06)] sm:p-6 lg:p-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6D5DF6]">
                New Request
              </p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Describe the feature you want to generate
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#64748B] sm:text-base">
                Keep the prompt clear and specific. The admin team will review it before
                the final deployment flow continues.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="flex flex-col gap-4 xl:flex-row">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="E.g., A login page with animated background, premium cards, and call-to-action section..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full rounded-[24px] border border-[#E6EBF5] bg-[#F9FBFF] px-5 py-4 text-[#1F2A44] outline-none transition placeholder:text-[#94A3B8] focus:border-[#6D5DF6] focus:ring-2 focus:ring-[#6D5DF6]/10"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-[24px] bg-gradient-to-r from-[#6D5DF6] to-[#8A7CFF] px-6 py-4 font-semibold text-white shadow-[0_14px_28px_rgba(109,93,246,0.24)] transition hover:opacity-95 disabled:opacity-60"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                {loading ? "Requesting..." : "Request Deploy"}
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {submitMessage && (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {submitMessage}
              </div>
            )}

            {loading && (
              <div className="mt-4 inline-flex items-center gap-3 rounded-2xl bg-[#EEF2FF] px-4 py-3 text-sm font-medium text-[#6D5DF6]">
                <FaSpinner className="animate-spin" />
                Your request is in progress...
              </div>
            )}
          </form>
        </section>

        {/* Ready section */}
        <section className="mt-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6D5DF6]">
                Featured Requests
              </p>
              <h2 className="mt-1 text-2xl font-bold">
                Ready to preview, approved, or already live
              </h2>
            </div>
            <div className="text-sm text-[#64748B]">
              Highlighted section for requests closest to completion
            </div>
          </div>

          {readyRequests.length > 0 ? (
            <div className="flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory">
              {readyRequests.map((req) => (
                <div
                  key={req._id}
                  className="min-w-[300px] max-w-[360px] flex-1 snap-start rounded-[28px] border border-white/80 bg-white/85 p-3 shadow-[0_18px_40px_rgba(31,42,68,0.06)]"
                >
                  <FeatureCard feature={req} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-[#E7ECF7] bg-white/85 px-6 py-12 text-center text-[#64748B] shadow-sm">
              No preview-ready, approved, or deployed requests yet.
            </div>
          )}
        </section>

        {/* Progress + rejected */}
        <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-white/80 bg-white/85 p-5 shadow-[0_20px_50px_rgba(31,42,68,0.06)] sm:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#FFF7ED] p-3 text-[#F59E0B]">
                <FaRegClock />
              </div>
              <div>
                <h3 className="text-xl font-bold">Pending & Generating</h3>
                <p className="text-sm text-[#64748B]">
                  Requests currently in progress
                </p>
              </div>
            </div>

            {inProgressRequests.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                {inProgressRequests.map((req) => (
                  <div
                    key={req._id}
                    className="rounded-[26px] border border-[#E7ECF7] bg-[#F9FBFF] p-3 shadow-sm"
                  >
                    <FeatureCard feature={req} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-[24px] border border-dashed border-[#D7DEEE] bg-[#F9FBFF] px-5 py-10 text-center text-[#64748B]">
                No pending or generating requests right now.
              </div>
            )}
          </div>

          <div className="rounded-[32px] border border-white/80 bg-white/85 p-5 shadow-[0_20px_50px_rgba(31,42,68,0.06)] sm:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-red-50 p-3 text-red-500">
                <FaCircleExclamation />
              </div>
              <div>
                <h3 className="text-xl font-bold">Rejected Requests</h3>
                <p className="text-sm text-[#64748B]">
                  Requests that did not move forward
                </p>
              </div>
            </div>

            {rejectedRequests.length > 0 ? (
              <div className="mt-5 space-y-4">
                {rejectedRequests.map((req) => (
                  <div
                    key={req._id}
                    className="rounded-[24px] border border-red-100 bg-red-50/60 p-3"
                  >
                    <FeatureCard feature={req} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-[24px] border border-dashed border-[#D7DEEE] bg-[#F9FBFF] px-5 py-10 text-center text-[#64748B]">
                No rejected requests.
              </div>
            )}
          </div>
        </section>

        {/* All requests */}
        <section className="mt-6 rounded-[32px] border border-white/80 bg-white/85 p-5 shadow-[0_20px_50px_rgba(31,42,68,0.06)] sm:p-6 lg:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#EEF2FF] p-3 text-[#6D5DF6]">
              <FaRegCircleCheck />
            </div>
            <div>
              <h3 className="text-xl font-bold">All Requests</h3>
              <p className="text-sm text-[#64748B]">
                Complete history of your submitted feature requests
              </p>
            </div>
          </div>

          {requests.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {requests.map((req) => (
                <div
                  key={req._id}
                  className="rounded-[26px] border border-[#E7ECF7] bg-[#F9FBFF] p-3 shadow-sm"
                >
                  <FeatureCard feature={req} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[24px] border border-dashed border-[#D7DEEE] bg-[#F9FBFF] px-6 py-16 text-center">
              <p className="text-lg font-semibold text-[#1F2A44]">
                No feature requests yet
              </p>
              <p className="mt-2 text-[#64748B]">
                Submit your first request using the form above.
              </p>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="pt-6 pb-2">
          <div className="rounded-[28px] border border-white/80 bg-white/80 px-6 py-6 shadow-[0_20px_50px_rgba(31,42,68,0.06)] backdrop-blur-sm sm:px-8 sm:py-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#1F2A44]">
                  AI Feature Builder
                </h3>
                <p className="mt-1 text-sm text-[#64748B]">
                  Submit, review, preview, and deploy AI-generated feature pages.
                </p>
              </div>

              <div className="text-sm font-medium text-[#1F2A44]">
                Made with ❤️ by{" "}
                <span className="bg-gradient-to-r from-[#6D5DF6] to-[#8A7CFF] bg-clip-text text-transparent font-semibold">
                  Harshit Roy
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}