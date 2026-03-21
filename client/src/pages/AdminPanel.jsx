import { useContext, useEffect, useMemo, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import api from "../api/axios"
import {
  FaCheck,
  FaTimes,
  FaExternalLinkAlt,
  FaSpinner,
  FaRocket,
  FaUndo,
  FaSave,
  FaUsers,
  FaClock,
  FaLayerGroup
} from "react-icons/fa"

export default function AdminPanel() {
  const { user, logout } = useContext(AuthContext)

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeUsers, setActiveUsers] = useState(0)
  const [loadingRow, setLoadingRow] = useState(null)
  const [loadingAction, setLoadingAction] = useState("")
  const [editedNames, setEditedNames] = useState({})
  const [search, setSearch] = useState("")

  const fetchActiveUsers = async () => {
    if (!user) return
    try {
      const res = await api.get("/admin/active-users", {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setActiveUsers(res.data.count)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    document.title = "Admin • AI Feature Builder"
  }, [])

  useEffect(() => {
    fetchActiveUsers()
    const interval = setInterval(fetchActiveUsers, 10000)
    return () => clearInterval(interval)
  }, [user])

  const fetchRequests = async () => {
    if (!user) return

    setLoading(true)
    try {
      const res = await api.get("/features/admin/all", {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setRequests(res.data)

      const initialNames = {}
      res.data.forEach((item) => {
        initialNames[item._id] = item.displayName || ""
      })
      setEditedNames(initialNames)
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRequests()
  }, [user])

  const handleApprove = async (id) => {
    setLoadingRow(id)
    setLoadingAction("approve")
    try {
      await api.put(
        `/features/admin/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      await fetchRequests()
    } catch (err) {
      console.log(err)
    }
    setLoadingRow(null)
    setLoadingAction("")
  }

  const handleReject = async (id) => {
    setLoadingRow(id)
    setLoadingAction("reject")
    try {
      await api.put(
        `/features/admin/reject/${id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      await fetchRequests()
    } catch (err) {
      console.log(err)
    }
    setLoadingRow(null)
    setLoadingAction("")
  }

  const handleDeploy = async (slug, id) => {
    setLoadingRow(id)
    setLoadingAction("deploy")
    try {
      await api.put(
        `/features/deploy/${slug}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      await fetchRequests()
    } catch (err) {
      console.log(err)
    }
    setLoadingRow(null)
    setLoadingAction("")
  }

  const handleRollback = async (slug, id) => {
    setLoadingRow(id)
    setLoadingAction("rollback")
    try {
      await api.put(
        `/features/rollback/${slug}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      await fetchRequests()
    } catch (err) {
      console.log(err)
    }
    setLoadingRow(null)
    setLoadingAction("")
  }

  const handleSaveDisplayName = async (id) => {
    setLoadingRow(id)
    setLoadingAction("save")
    try {
      await api.put(
        `/features/admin/display-name/${id}`,
        { displayName: editedNames[id] || "" },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      await fetchRequests()
    } catch (err) {
      console.log(err)
    }
    setLoadingRow(null)
    setLoadingAction("")
  }

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const text = `${r.prompt} ${r.displayName || ""} ${r.userId?.email || ""} ${r.status}`.toLowerCase()
      return text.includes(search.toLowerCase())
    })
  }, [requests, search])

  const stats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter((r) => r.status === "pending").length,
      deployed: requests.filter((r) => r.status === "deployed").length
    }
  }, [requests])

  const statusBadge = (status) => {
    if (status === "pending") return "bg-amber-50 text-amber-700 border border-amber-100"
    if (status === "approved" || status === "preview-ready")
      return "bg-emerald-50 text-emerald-700 border border-emerald-100"
    if (status === "deployed") return "bg-violet-50 text-violet-700 border border-violet-100"
    if (status === "generating") return "bg-sky-50 text-sky-700 border border-sky-100"
    return "bg-red-50 text-red-700 border border-red-100"
  }

  const isRowLoading = (id, action) => loadingRow === id && loadingAction === action

  return (
    <div className="min-h-screen bg-[#EEF2FB] text-[#1F2A44]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-16 -left-16 h-[280px] w-[280px] rounded-full bg-[#8A7CFF]/16 blur-3xl" />
        <div className="absolute top-1/3 -right-16 h-[260px] w-[260px] rounded-full bg-[#F472B6]/10 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <p className="text-[#6D5DF6] font-semibold uppercase text-sm mb-2 tracking-wide">
              Control Center
            </p>

            <h1 className="text-3xl sm:text-4xl font-extrabold">
              Admin Panel
            </h1>

            <p className="text-[#64748B] mt-3 max-w-2xl">
              Review requests, manage approvals, edit display names, and control deployments.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl border border-[#E6EBF5] bg-white px-4 py-3 min-w-[150px] shadow-sm">
              <div className="text-sm text-[#64748B] mb-1 flex items-center gap-2">
                <FaUsers />
                Active Users
              </div>
              <div className="text-2xl font-bold text-[#6D5DF6]">{activeUsers}</div>
            </div>

            <div className="rounded-2xl border border-[#E6EBF5] bg-white px-4 py-3 min-w-[150px] shadow-sm">
              <div className="text-sm text-[#64748B] mb-1 flex items-center gap-2">
                <FaLayerGroup />
                Total Requests
              </div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>

            <div className="rounded-2xl border border-[#E6EBF5] bg-white px-4 py-3 min-w-[150px] shadow-sm">
              <div className="text-sm text-[#64748B] mb-1 flex items-center gap-2">
                <FaClock />
                Pending
              </div>
              <div className="text-2xl font-bold text-amber-500">{stats.pending}</div>
            </div>

            <div className="rounded-2xl border border-[#E6EBF5] bg-white px-4 py-3 min-w-[150px] shadow-sm">
              <div className="text-sm text-[#64748B] mb-1 flex items-center gap-2">
                <FaRocket />
                Deployed
              </div>
              <div className="text-2xl font-bold text-violet-600">{stats.deployed}</div>
            </div>

            <button
              className="rounded-2xl bg-[#1F2A44] px-5 py-3 text-white font-semibold hover:opacity-90 transition"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-6 rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Requests Overview</h2>
              <p className="text-[#64748B] text-sm mt-1">
                Search by prompt, display name, user, or status.
              </p>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search requests..."
              className="w-full lg:w-80 rounded-2xl border border-[#E6EBF5] bg-[#F9FBFF] px-4 py-3 text-[#1F2A44] placeholder:text-[#94A3B8] outline-none focus:border-[#6D5DF6] focus:ring-2 focus:ring-[#6D5DF6]/10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center mt-20 text-[#64748B]">
            <FaSpinner className="animate-spin mr-2" /> Loading requests...
          </div>
        ) : (
          <>
            <div className="hidden xl:block rounded-[32px] border border-white/80 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#F8FAFF] border-b border-[#E6EBF5]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Prompt</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Display Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">User</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Preview</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Live</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRequests.map((r) => (
                      <tr
                        key={r._id}
                        className="border-t border-[#E6EBF5] hover:bg-[#F9FBFF] transition"
                      >
                        <td className="px-6 py-5 text-sm align-top min-w-[260px]">
                          <div className="font-medium text-[#1F2A44] leading-7">
                            {r.prompt}
                          </div>
                        </td>

                        <td className="px-6 py-5 align-top min-w-[280px]">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editedNames[r._id] ?? ""}
                              onChange={(e) =>
                                setEditedNames((prev) => ({
                                  ...prev,
                                  [r._id]: e.target.value
                                }))
                              }
                              placeholder="Alias"
                              className="w-full rounded-xl border border-[#E6EBF5] bg-[#F9FBFF] px-3 py-2.5 text-[#1F2A44] placeholder:text-[#94A3B8] outline-none focus:border-[#6D5DF6] focus:ring-2 focus:ring-[#6D5DF6]/10"
                            />
                            <button
                              onClick={() => handleSaveDisplayName(r._id)}
                              disabled={loadingRow === r._id}
                              className="inline-flex min-w-[88px] items-center justify-center gap-2 rounded-xl bg-[#6D5DF6] px-3 py-2.5 text-white transition hover:opacity-90 disabled:opacity-60"
                            >
                              {isRowLoading(r._id, "save") ? (
                                <>
                                  <FaSpinner className="animate-spin" />
                                  <span className="text-xs font-semibold">Saving</span>
                                </>
                              ) : (
                                <FaSave />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm text-[#64748B] align-top">
                          {r.userId?.email || "N/A"}
                        </td>

                        <td className="px-6 py-5 align-top">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge(r.status)}`}>
                            {r.status}
                          </span>
                        </td>

                        <td className="px-6 py-5 align-top">
                          {r.pageSlug ? (
                            <a
                              href={`${window.location.origin}/preview/${r.pageSlug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-[#6D5DF6] hover:underline font-medium"
                            >
                              Preview <FaExternalLinkAlt className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-[#94A3B8]">N/A</span>
                          )}
                        </td>

                        <td className="px-6 py-5 align-top">
                          {r.status === "deployed" && r.pageSlug ? (
                            <a
                              href={`${window.location.origin}/live/${r.pageSlug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-emerald-600 hover:underline font-medium"
                            >
                              Open Live <FaExternalLinkAlt className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-[#94A3B8]">Not live</span>
                          )}
                        </td>

                        <td className="px-6 py-5 align-top">
                          <div className="flex flex-wrap gap-2">
                            {r.status === "pending" && (
                              <>
                                <button
                                  className="inline-flex min-w-[110px] items-center justify-center gap-2 rounded-xl bg-emerald-500 px-3 py-2.5 text-white transition hover:bg-emerald-600 disabled:opacity-60"
                                  disabled={loadingRow === r._id}
                                  onClick={() => handleApprove(r._id)}
                                >
                                  {isRowLoading(r._id, "approve") ? (
                                    <>
                                      <FaSpinner className="animate-spin" />
                                      <span className="text-sm font-medium">Approving</span>
                                    </>
                                  ) : (
                                    <>
                                      <FaCheck />
                                      <span className="text-sm font-medium">Approve</span>
                                    </>
                                  )}
                                </button>

                                <button
                                  className="inline-flex min-w-[100px] items-center justify-center gap-2 rounded-xl bg-red-500 px-3 py-2.5 text-white transition hover:bg-red-600 disabled:opacity-60"
                                  disabled={loadingRow === r._id}
                                  onClick={() => handleReject(r._id)}
                                >
                                  {isRowLoading(r._id, "reject") ? (
                                    <>
                                      <FaSpinner className="animate-spin" />
                                      <span className="text-sm font-medium">Rejecting</span>
                                    </>
                                  ) : (
                                    <>
                                      <FaTimes />
                                      <span className="text-sm font-medium">Reject</span>
                                    </>
                                  )}
                                </button>
                              </>
                            )}

                            {(r.status === "approved" || r.status === "preview-ready") && r.pageSlug && (
                              <button
                                className="inline-flex min-w-[100px] items-center justify-center gap-2 rounded-xl bg-[#6D5DF6] px-3 py-2.5 text-white transition hover:opacity-90 disabled:opacity-60"
                                disabled={loadingRow === r._id}
                                onClick={() => handleDeploy(r.pageSlug, r._id)}
                              >
                                {isRowLoading(r._id, "deploy") ? (
                                  <>
                                    <FaSpinner className="animate-spin" />
                                    <span className="text-sm font-medium">Deploying</span>
                                  </>
                                ) : (
                                  <>
                                    <FaRocket />
                                    <span className="text-sm font-medium">Deploy</span>
                                  </>
                                )}
                              </button>
                            )}

                            {r.status === "deployed" && r.pageSlug && (
                              <button
                                className="inline-flex min-w-[110px] items-center justify-center gap-2 rounded-xl bg-amber-500 px-3 py-2.5 text-white transition hover:bg-amber-600 disabled:opacity-60"
                                disabled={loadingRow === r._id}
                                onClick={() => handleRollback(r.pageSlug, r._id)}
                              >
                                {isRowLoading(r._id, "rollback") ? (
                                  <>
                                    <FaSpinner className="animate-spin" />
                                    <span className="text-sm font-medium">Rolling back</span>
                                  </>
                                ) : (
                                  <>
                                    <FaUndo />
                                    <span className="text-sm font-medium">Rollback</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredRequests.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center py-12 text-[#64748B]">
                          No feature requests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="xl:hidden grid grid-cols-1 gap-4">
              {filteredRequests.map((r) => (
                <div
                  key={r._id}
                  className="rounded-[28px] border border-[#E6EBF5] bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#94A3B8] mb-2">
                        Prompt
                      </p>
                      <h3 className="text-[#1F2A44] font-semibold leading-7 break-words">
                        {r.prompt}
                      </h3>
                    </div>

                    <span className={`shrink-0 inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge(r.status)}`}>
                      {r.status}
                    </span>
                  </div>

                  <div className="mt-4 rounded-2xl bg-[#F9FBFF] p-4 border border-[#EEF2F8]">
                    <p className="text-xs uppercase tracking-wide text-[#94A3B8] mb-2">
                      Submitted By
                    </p>
                    <p className="text-sm text-[#64748B] break-all">
                      {r.userId?.email || "N/A"}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-wide text-[#94A3B8] mb-2">
                      Display Name
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editedNames[r._id] ?? ""}
                        onChange={(e) =>
                          setEditedNames((prev) => ({
                            ...prev,
                            [r._id]: e.target.value
                          }))
                        }
                        placeholder="Alias"
                        className="w-full rounded-xl border border-[#E6EBF5] bg-[#F9FBFF] px-3 py-2.5 text-[#1F2A44] placeholder:text-[#94A3B8] outline-none focus:border-[#6D5DF6] focus:ring-2 focus:ring-[#6D5DF6]/10"
                      />
                      <button
                        onClick={() => handleSaveDisplayName(r._id)}
                        disabled={loadingRow === r._id}
                        className="inline-flex min-w-[88px] items-center justify-center gap-2 rounded-xl bg-[#6D5DF6] px-3 py-2.5 text-white transition hover:opacity-90 disabled:opacity-60"
                      >
                        {isRowLoading(r._id, "save") ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            <span className="text-xs font-semibold">Saving</span>
                          </>
                        ) : (
                          <FaSave />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-[#E6EBF5] bg-[#F9FBFF] p-4">
                      <p className="text-xs uppercase tracking-wide text-[#94A3B8] mb-2">
                        Preview
                      </p>
                      {r.pageSlug ? (
                        <a
                          href={`${window.location.origin}/preview/${r.pageSlug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-[#6D5DF6] hover:underline font-medium"
                        >
                          Open Preview <FaExternalLinkAlt className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-sm text-[#94A3B8]">N/A</span>
                      )}
                    </div>

                    <div className="rounded-2xl border border-[#E6EBF5] bg-[#F9FBFF] p-4">
                      <p className="text-xs uppercase tracking-wide text-[#94A3B8] mb-2">
                        Live
                      </p>
                      {r.status === "deployed" && r.pageSlug ? (
                        <a
                          href={`${window.location.origin}/live/${r.pageSlug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-emerald-600 hover:underline font-medium"
                        >
                          Open Live <FaExternalLinkAlt className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-sm text-[#94A3B8]">Not live</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-wide text-[#94A3B8] mb-2">
                      Actions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {r.status === "pending" && (
                        <>
                          <button
                            className="inline-flex min-w-[110px] items-center justify-center gap-2 rounded-xl bg-emerald-500 px-3 py-2.5 text-white transition hover:bg-emerald-600 disabled:opacity-60"
                            disabled={loadingRow === r._id}
                            onClick={() => handleApprove(r._id)}
                          >
                            {isRowLoading(r._id, "approve") ? (
                              <>
                                <FaSpinner className="animate-spin" />
                                <span className="text-sm font-medium">Approving</span>
                              </>
                            ) : (
                              <>
                                <FaCheck />
                                <span className="text-sm font-medium">Approve</span>
                              </>
                            )}
                          </button>

                          <button
                            className="inline-flex min-w-[100px] items-center justify-center gap-2 rounded-xl bg-red-500 px-3 py-2.5 text-white transition hover:bg-red-600 disabled:opacity-60"
                            disabled={loadingRow === r._id}
                            onClick={() => handleReject(r._id)}
                          >
                            {isRowLoading(r._id, "reject") ? (
                              <>
                                <FaSpinner className="animate-spin" />
                                <span className="text-sm font-medium">Rejecting</span>
                              </>
                            ) : (
                              <>
                                <FaTimes />
                                <span className="text-sm font-medium">Reject</span>
                              </>
                            )}
                          </button>
                        </>
                      )}

                      {(r.status === "approved" || r.status === "preview-ready") && r.pageSlug && (
                        <button
                          className="inline-flex min-w-[100px] items-center justify-center gap-2 rounded-xl bg-[#6D5DF6] px-3 py-2.5 text-white transition hover:opacity-90 disabled:opacity-60"
                          disabled={loadingRow === r._id}
                          onClick={() => handleDeploy(r.pageSlug, r._id)}
                        >
                          {isRowLoading(r._id, "deploy") ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              <span className="text-sm font-medium">Deploying</span>
                            </>
                          ) : (
                            <>
                              <FaRocket />
                              <span className="text-sm font-medium">Deploy</span>
                            </>
                          )}
                        </button>
                      )}

                      {r.status === "deployed" && r.pageSlug && (
                        <button
                          className="inline-flex min-w-[110px] items-center justify-center gap-2 rounded-xl bg-amber-500 px-3 py-2.5 text-white transition hover:bg-amber-600 disabled:opacity-60"
                          disabled={loadingRow === r._id}
                          onClick={() => handleRollback(r.pageSlug, r._id)}
                        >
                          {isRowLoading(r._id, "rollback") ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              <span className="text-sm font-medium">Rolling back</span>
                            </>
                          ) : (
                            <>
                              <FaUndo />
                              <span className="text-sm font-medium">Rollback</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredRequests.length === 0 && (
                <div className="rounded-[28px] border border-[#E6EBF5] bg-white p-8 text-center text-[#64748B] shadow-sm">
                  No feature requests found.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}