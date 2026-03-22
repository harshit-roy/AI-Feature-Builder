import { useContext, useEffect, useMemo, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import api from "../api/axios"
import { useNavigate } from "react-router-dom"
import {
  FaCheck,
  FaXmark,
  FaArrowUpRightFromSquare,
  FaSpinner,
  FaRocket,
  FaRotateLeft,
  FaFloppyDisk,
  FaUsers,
  FaClock,
  FaLayerGroup,
  FaArrowsRotate,
  FaPen,
  FaTriangleExclamation,
  FaCodeBranch,
  FaWandMagicSparkles,
  FaFilter,
  FaFileLines
} from "react-icons/fa6"

export default function AdminPanel() {
  const { user, logout, loading: authLoading } = useContext(AuthContext)
  const navigate = useNavigate()

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeUsers, setActiveUsers] = useState(0)
  const [loadingRow, setLoadingRow] = useState(null)
  const [loadingAction, setLoadingAction] = useState("")
  const [editedNames, setEditedNames] = useState({})
  const [editedPrompts, setEditedPrompts] = useState({})
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const fetchActiveUsers = async () => {
    if (!user?.token) return

    try {
      const res = await api.get("/admin/active-users", {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setActiveUsers(res.data.count)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchRequests = async () => {
    if (!user?.token) return

    setLoading(true)
    try {
      const res = await api.get("/features/admin/all", {
        headers: { Authorization: `Bearer ${user.token}` }
      })

      setRequests(res.data)

      const initialNames = {}
      const initialPrompts = {}

      res.data.forEach((item) => {
        initialNames[item._id] = item.displayName || ""
        initialPrompts[item._id] = item.prompt || ""
      })

      setEditedNames(initialNames)
      setEditedPrompts(initialPrompts)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = "Admin • AI Feature Builder"
  }, [])

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      navigate("/login")
      return
    }

    fetchRequests()
    fetchActiveUsers()

    const interval = setInterval(fetchActiveUsers, 10000)
    return () => clearInterval(interval)
  }, [user, authLoading, navigate])

  const handleAction = async (id, actionType, apiCall) => {
    if (!user?.token) return

    setLoadingRow(id)
    setLoadingAction(actionType)

    try {
      await apiCall()
      await fetchRequests()
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingRow(null)
      setLoadingAction("")
    }
  }

  const handleApprove = async (id) => {
    await handleAction(id, "approve", () =>
      api.put(
        `/features/admin/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
    )
  }

  const handleRetry = async (id) => {
    const prompt = editedPrompts[id]?.trim()

    await handleAction(id, "retry", () =>
      api.put(
        `/features/admin/retry/${id}`,
        { prompt },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
    )
  }

  const handleSavePrompt = async (id) => {
    const prompt = editedPrompts[id]?.trim()
    if (!prompt) return

    await handleAction(id, "save-prompt", () =>
      api.put(
        `/features/admin/update-prompt/${id}`,
        { prompt },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
    )
  }

  const handleReject = async (id) => {
    await handleAction(id, "reject", () =>
      api.put(
        `/features/admin/reject/${id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
    )
  }

  const handleDeploy = async (slug, id) => {
    await handleAction(id, "deploy", () =>
      api.put(
        `/features/deploy/${slug}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
    )
  }

  const handleRollback = async (slug, id) => {
    await handleAction(id, "rollback", () =>
      api.put(
        `/features/rollback/${slug}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
    )
  }

  const handleSaveDisplayName = async (id) => {
    await handleAction(id, "save-name", () =>
      api.put(
        `/features/admin/display-name/${id}`,
        { displayName: editedNames[id] || "" },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
    )
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesSearch = `${r.prompt} ${r.displayName || ""} ${r.userId?.email || ""} ${r.status} ${r.lastError || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === "all" ? true : r.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [requests, search, statusFilter])

  const stats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter((r) => r.status === "pending").length,
      generating: requests.filter((r) => r.status === "generating").length,
      failed: requests.filter((r) => r.status === "failed").length,
      deployed: requests.filter((r) => r.status === "deployed").length
    }
  }, [requests])

  const statusBadge = (status) => {
    if (status === "pending") return "bg-amber-50 text-amber-700 border border-amber-100"
    if (status === "approved" || status === "preview-ready") {
      return "bg-emerald-50 text-emerald-700 border border-emerald-100"
    }
    if (status === "deployed") return "bg-violet-50 text-violet-700 border border-violet-100"
    if (status === "generating") return "bg-sky-50 text-sky-700 border border-sky-100"
    if (status === "failed") return "bg-red-50 text-red-700 border border-red-100"
    if (status === "rejected") return "bg-rose-50 text-rose-700 border border-rose-100"
    return "bg-slate-100 text-slate-700 border border-slate-200"
  }

  const isRowLoading = (id, action) => loadingRow === id && loadingAction === action

  const renderActionButton = ({
    id,
    action,
    onClick,
    text,
    loadingText,
    icon,
    className
  }) => (
    <button
      onClick={onClick}
      disabled={loadingRow === id}
      className={className}
      type="button"
    >
      {isRowLoading(id, action) ? (
        <>
          <FaSpinner className="animate-spin" />
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {icon}
          <span>{text}</span>
        </>
      )}
    </button>
  )

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#EEF2FB] flex items-center justify-center">
        <div className="inline-flex items-center gap-3 rounded-2xl border border-[#E6EBF5] bg-white px-5 py-4 text-[#64748B] shadow-sm">
          <FaSpinner className="animate-spin text-[#6D5DF6]" />
          Loading admin panel...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#EEF2FB] text-[#1F2A44]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-16 -left-16 h-[280px] w-[280px] rounded-full bg-[#8A7CFF]/16 blur-3xl" />
        <div className="absolute top-1/3 -right-16 h-[260px] w-[260px] rounded-full bg-[#F472B6]/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[220px] w-[220px] rounded-full bg-[#6D5DF6]/10 blur-3xl" />
      </div>

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="rounded-[32px] border border-white/80 bg-white/85 p-5 shadow-[0_24px_60px_rgba(31,42,68,0.07)] backdrop-blur-sm sm:p-6 lg:p-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FF] px-4 py-2 text-sm font-semibold text-[#6D5DF6]">
                <FaWandMagicSparkles />
                Admin Control Center
              </div>

              <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Manage generation, quality, and deployment
              </h1>

              <p className="mt-3 text-sm leading-7 text-[#64748B] sm:text-base">
                This workspace is optimized for high-volume review. Update prompts, save aliases,
                regenerate failed outputs, inspect errors, preview live-ready pages, and control deployments
                without losing context or scrolling across oversized tables.
              </p>
            </div>

            <div className="w-full xl:max-w-sm">
              <div className="rounded-[28px] bg-gradient-to-br from-[#6D5DF6] to-[#8A7CFF] p-5 text-white shadow-[0_18px_40px_rgba(109,93,246,0.24)]">
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl bg-white/15 p-3">
                    <FaCodeBranch className="text-lg" />
                  </div>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                    Live Admin State
                  </span>
                </div>

                <div className="mt-5">
                  <h2 className="text-xl font-bold">Fast operational view</h2>
                  <p className="mt-2 text-sm leading-6 text-white/85">
                    Search, filter, edit, retry, deploy, and rollback — all from one responsive admin workspace.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
            <div className="rounded-2xl border border-[#E6EBF5] bg-[#F9FBFF] p-4 shadow-sm">
              <div className="text-sm text-[#64748B] mb-1 flex items-center gap-2">
                <FaUsers />
                Active Users
              </div>
              <div className="text-2xl font-bold text-[#6D5DF6]">{activeUsers}</div>
            </div>

            <div className="rounded-2xl border border-[#E6EBF5] bg-[#F9FBFF] p-4 shadow-sm">
              <div className="text-sm text-[#64748B] mb-1 flex items-center gap-2">
                <FaLayerGroup />
                Total Requests
              </div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>

            <div className="rounded-2xl border border-[#E6EBF5] bg-[#F9FBFF] p-4 shadow-sm">
              <div className="text-sm text-[#64748B] mb-1 flex items-center gap-2">
                <FaClock />
                Pending
              </div>
              <div className="text-2xl font-bold text-amber-500">{stats.pending}</div>
            </div>

            <div className="rounded-2xl border border-[#E6EBF5] bg-[#F9FBFF] p-4 shadow-sm">
              <div className="text-sm text-[#64748B] mb-1 flex items-center gap-2">
                <FaArrowsRotate />
                Generating / Failed
              </div>
              <div className="text-2xl font-bold text-red-500">
                {stats.generating + stats.failed}
              </div>
            </div>

            <div className="rounded-2xl border border-[#E6EBF5] bg-[#F9FBFF] p-4 shadow-sm col-span-2 md:col-span-1">
              <div className="text-sm text-[#64748B] mb-1 flex items-center gap-2">
                <FaRocket />
                Deployed
              </div>
              <div className="text-2xl font-bold text-violet-600">{stats.deployed}</div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[32px] border border-white/80 bg-white/90 p-5 shadow-[0_20px_50px_rgba(31,42,68,0.06)] sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6D5DF6]">
                Filters & Search
              </p>
              <h2 className="mt-2 text-2xl font-bold">Find and manage requests faster</h2>
              <p className="mt-2 text-sm leading-7 text-[#64748B]">
                Search by prompt, display name, user, status, or failure reason. Filter the list to focus on priority states.
              </p>
            </div>

            <div className="grid w-full gap-3 md:grid-cols-[1fr_220px] xl:max-w-[620px]">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search requests..."
                  className="w-full rounded-2xl border border-[#E6EBF5] bg-[#F9FBFF] px-4 py-3 text-[#1F2A44] placeholder:text-[#94A3B8] outline-none focus:border-[#6D5DF6] focus:ring-2 focus:ring-[#6D5DF6]/10"
                />
              </div>

              <div className="relative">
                <FaFilter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-[#E6EBF5] bg-[#F9FBFF] py-3 pl-11 pr-4 text-[#1F2A44] outline-none focus:border-[#6D5DF6] focus:ring-2 focus:ring-[#6D5DF6]/10"
                >
                  <option value="all">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="generating">Generating</option>
                  <option value="approved">Approved</option>
                  <option value="preview-ready">Preview Ready</option>
                  <option value="deployed">Deployed</option>
                  <option value="failed">Failed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center items-center mt-20 text-[#64748B]">
            <FaSpinner className="animate-spin mr-2" />
            Loading requests...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="mt-6 rounded-[32px] border border-[#E6EBF5] bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF2FF] text-[#6D5DF6]">
              <FaFileLines className="text-xl" />
            </div>
            <h3 className="text-xl font-bold text-[#1F2A44]">No feature requests found</h3>
            <p className="mt-2 text-[#64748B]">
              Try changing your search text or filter state.
            </p>
          </div>
        ) : (
          <section className="mt-6 grid grid-cols-1 gap-6 2xl:grid-cols-2">
            {filteredRequests.map((r) => (
              <article
                key={r._id}
                className="rounded-[30px] border border-white/80 bg-white/95 p-5 shadow-[0_18px_40px_rgba(31,42,68,0.06)] sm:p-6"
              >
                <div className="flex flex-col gap-4 border-b border-[#ECF0F7] pb-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge(
                          r.status
                        )}`}
                      >
                        {r.status}
                      </span>

                      {!!r.generationAttempts && (
                        <span className="rounded-full bg-[#F5F7FC] px-3 py-1 text-xs font-semibold text-[#64748B]">
                          Attempts: {r.generationAttempts}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-xl font-bold leading-8 break-words">
                      {r.displayName?.trim() || "Untitled Request"}
                    </h3>

                    <p className="mt-2 text-sm text-[#64748B] break-all">
                      {r.userId?.email || "N/A"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {r.pageSlug ? (
                      <a
                        href={`${window.location.origin}/preview/${r.pageSlug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-2xl border border-[#DCE4F3] bg-[#F9FBFF] px-4 py-2.5 text-sm font-semibold text-[#1F2A44] transition hover:border-[#C9D6EE] hover:bg-white"
                      >
                        Preview
                        <FaArrowUpRightFromSquare className="text-xs text-[#6D5DF6]" />
                      </a>
                    ) : null}

                    {r.status === "deployed" && r.pageSlug ? (
                      <a
                        href={`${window.location.origin}/live/${r.pageSlug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#6D5DF6] to-[#8A7CFF] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(109,93,246,0.22)] transition hover:opacity-95"
                      >
                        Open Live
                        <FaArrowUpRightFromSquare className="text-xs" />
                      </a>
                    ) : null}
                  </div>
                </div>

                <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-5">
                    <div className="rounded-[24px] border border-[#E6EBF5] bg-[#F9FBFF] p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6D5DF6]">
                            Prompt
                          </p>
                          <p className="mt-1 text-sm text-[#64748B]">
                            Edit the generation instruction used by AI.
                          </p>
                        </div>

                        <button
                          onClick={() => handleSavePrompt(r._id)}
                          disabled={loadingRow === r._id}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D9E1F0] bg-white px-3 py-2.5 text-sm font-semibold text-[#1F2A44] transition hover:bg-[#F9FBFF] disabled:opacity-60"
                          type="button"
                        >
                          {isRowLoading(r._id, "save-prompt") ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              <span>Saving</span>
                            </>
                          ) : (
                            <>
                              <FaPen />
                              <span>Save Prompt</span>
                            </>
                          )}
                        </button>
                      </div>

                      <textarea
                        value={editedPrompts[r._id] ?? ""}
                        onChange={(e) =>
                          setEditedPrompts((prev) => ({
                            ...prev,
                            [r._id]: e.target.value
                          }))
                        }
                        rows={6}
                        className="w-full resize-y rounded-2xl border border-[#E6EBF5] bg-white px-4 py-3 text-sm leading-7 text-[#1F2A44] outline-none focus:border-[#6D5DF6] focus:ring-2 focus:ring-[#6D5DF6]/10"
                      />
                    </div>

                    <div className="rounded-[24px] border border-[#E6EBF5] bg-[#F9FBFF] p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6D5DF6]">
                            Display Name
                          </p>
                          <p className="mt-1 text-sm text-[#64748B]">
                            Save a cleaner alias for admin visibility.
                          </p>
                        </div>

                        <button
                          onClick={() => handleSaveDisplayName(r._id)}
                          disabled={loadingRow === r._id}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D5DF6] px-3 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                          type="button"
                        >
                          {isRowLoading(r._id, "save-name") ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              <span>Saving</span>
                            </>
                          ) : (
                            <>
                              <FaFloppyDisk />
                              <span>Save Name</span>
                            </>
                          )}
                        </button>
                      </div>

                      <input
                        type="text"
                        value={editedNames[r._id] ?? ""}
                        onChange={(e) =>
                          setEditedNames((prev) => ({
                            ...prev,
                            [r._id]: e.target.value
                          }))
                        }
                        placeholder="Add an admin-friendly display name"
                        className="w-full rounded-2xl border border-[#E6EBF5] bg-white px-4 py-3 text-[#1F2A44] placeholder:text-[#94A3B8] outline-none focus:border-[#6D5DF6] focus:ring-2 focus:ring-[#6D5DF6]/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="rounded-[24px] border border-[#E6EBF5] bg-white p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6D5DF6]">
                        Debug & Error State
                      </p>

                      {r.lastError ? (
                        <div className="mt-3 rounded-2xl border border-red-100 bg-red-50 p-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-red-500">
                              <FaTriangleExclamation />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-red-700">
                                Last generation issue
                              </p>
                              <p className="mt-1 text-sm leading-6 text-red-700 break-words">
                                {r.lastError}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                          <p className="text-sm font-semibold text-emerald-700">
                            No recent generation error
                          </p>
                        </div>
                      )}

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-[#E6EBF5] bg-[#F9FBFF] p-4">
                          <p className="text-xs text-[#94A3B8] uppercase tracking-wide">
                            Current Status
                          </p>
                          <p className="mt-2 text-sm font-semibold capitalize text-[#1F2A44]">
                            {r.status}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-[#E6EBF5] bg-[#F9FBFF] p-4">
                          <p className="text-xs text-[#94A3B8] uppercase tracking-wide">
                            Slug
                          </p>
                          <p className="mt-2 text-sm font-semibold break-all text-[#1F2A44]">
                            {r.pageSlug || "Not assigned"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-[#E6EBF5] bg-white p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6D5DF6]">
                        Actions
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {r.status === "pending" &&
                          renderActionButton({
                            id: r._id,
                            action: "approve",
                            onClick: () => handleApprove(r._id),
                            text: "Approve",
                            loadingText: "Approving",
                            icon: <FaCheck />,
                            className:
                              "inline-flex min-w-[120px] items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
                          })}

                        {r.status === "pending" &&
                          renderActionButton({
                            id: r._id,
                            action: "reject",
                            onClick: () => handleReject(r._id),
                            text: "Reject",
                            loadingText: "Rejecting",
                            icon: <FaXmark />,
                            className:
                              "inline-flex min-w-[120px] items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
                          })}

                        {(r.status === "failed" ||
                          r.status === "approved" ||
                          r.status === "preview-ready") &&
                          renderActionButton({
                            id: r._id,
                            action: "retry",
                            onClick: () => handleRetry(r._id),
                            text: "Generate Again",
                            loadingText: "Generating",
                            icon: <FaArrowsRotate />,
                            className:
                              "inline-flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-[#1F2A44] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                          })}

                        {(r.status === "approved" || r.status === "preview-ready") &&
                          r.pageSlug &&
                          renderActionButton({
                            id: r._id,
                            action: "deploy",
                            onClick: () => handleDeploy(r.pageSlug, r._id),
                            text: "Deploy",
                            loadingText: "Deploying",
                            icon: <FaRocket />,
                            className:
                              "inline-flex min-w-[120px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6D5DF6] to-[#8A7CFF] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(109,93,246,0.18)] transition hover:opacity-95 disabled:opacity-60"
                          })}

                        {r.status === "deployed" &&
                          r.pageSlug &&
                          renderActionButton({
                            id: r._id,
                            action: "rollback",
                            onClick: () => handleRollback(r.pageSlug, r._id),
                            text: "Rollback",
                            loadingText: "Rolling back",
                            icon: <FaRotateLeft />,
                            className:
                              "inline-flex min-w-[130px] items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60"
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}