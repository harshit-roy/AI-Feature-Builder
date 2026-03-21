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
    try {
      await api.put(
        `/features/admin/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      fetchRequests()
    } catch (err) {
      console.log(err)
    }
    setLoadingRow(null)
  }

  const handleReject = async (id) => {
    setLoadingRow(id)
    try {
      await api.put(
        `/features/admin/reject/${id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      fetchRequests()
    } catch (err) {
      console.log(err)
    }
    setLoadingRow(null)
  }

  const handleDeploy = async (slug, id) => {
    setLoadingRow(id)
    try {
      await api.put(
        `/features/deploy/${slug}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      fetchRequests()
    } catch (err) {
      console.log(err)
    }
    setLoadingRow(null)
  }

  const handleRollback = async (slug, id) => {
    setLoadingRow(id)
    try {
      await api.put(
        `/features/rollback/${slug}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      fetchRequests()
    } catch (err) {
      console.log(err)
    }
    setLoadingRow(null)
  }

  const handleSaveDisplayName = async (id) => {
    setLoadingRow(id)
    try {
      await api.put(
        `/features/admin/display-name/${id}`,
        { displayName: editedNames[id] || "" },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      fetchRequests()
    } catch (err) {
      console.log(err)
    }
    setLoadingRow(null)
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
    if (status === "pending") return "bg-amber-500/15 text-amber-300 border border-amber-500/20"
    if (status === "approved" || status === "preview-ready")
      return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
    if (status === "deployed") return "bg-violet-500/15 text-violet-300 border border-violet-500/20"
    if (status === "generating") return "bg-cyan-500/15 text-cyan-300 border border-cyan-500/20"
    return "bg-rose-500/15 text-rose-300 border border-rose-500/20"
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <p className="text-cyan-300 font-semibold tracking-wide uppercase text-sm mb-2">
              Control Center
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Admin Panel
            </h1>
            <p className="text-slate-400 mt-3 max-w-2xl">
              Review requests, edit page names, manage approvals, deploy features,
              and roll back live pages from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 min-w-[150px]">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <FaUsers />
                Active Users
              </div>
              <div className="text-2xl font-bold text-cyan-300">{activeUsers}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 min-w-[150px]">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <FaLayerGroup />
                Total Requests
              </div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 min-w-[150px]">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <FaClock />
                Pending
              </div>
              <div className="text-2xl font-bold text-amber-300">{stats.pending}</div>
            </div>

            <button
              className="self-start rounded-2xl bg-rose-500 hover:bg-rose-600 px-5 py-3 font-semibold shadow-lg shadow-rose-500/20 transition"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Requests Overview</h2>
              <p className="text-slate-400 text-sm mt-1">
                Search by prompt, edited name, user email, or status.
              </p>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search requests..."
              className="w-full lg:w-80 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center mt-20 text-slate-300">
            <FaSpinner className="animate-spin mr-2" /> Loading requests...
          </div>
        ) : (
          <>
            <div className="hidden xl:block rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-slate-300 font-semibold">Prompt</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-semibold">Display Name</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-semibold">Submitted By</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-semibold">Preview</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-semibold">Live</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-semibold">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRequests.map((r) => (
                      <tr
                        key={r._id}
                        className="border-t border-white/10 hover:bg-white/[0.04] transition"
                      >
                        <td className="px-6 py-5 text-slate-200 min-w-[250px] align-top">
                          <div className="font-medium">{r.prompt}</div>
                        </td>

                        <td className="px-6 py-5 min-w-[260px] align-top">
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
                              placeholder="Short page name"
                              className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
                            />
                            <button
                              onClick={() => handleSaveDisplayName(r._id)}
                              disabled={loadingRow === r._id}
                              className="rounded-xl bg-cyan-600 hover:bg-cyan-700 px-3 py-2 text-white transition disabled:opacity-50"
                            >
                              {loadingRow === r._id ? <FaSpinner className="animate-spin" /> : <FaSave />}
                            </button>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-slate-300 align-top">
                          {r.userId?.email || "N/A"}
                        </td>

                        <td className="px-6 py-5 align-top">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${statusBadge(r.status)}`}>
                            {r.status.toUpperCase()}
                          </span>
                        </td>

                        <td className="px-6 py-5 align-top">
                          {r.pageSlug ? (
                            <a
                              href={`${window.location.origin}/preview/${r.pageSlug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
                            >
                              Preview <FaExternalLinkAlt className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-500">N/A</span>
                          )}
                        </td>

                        <td className="px-6 py-5 align-top">
                          {r.status === "deployed" && r.pageSlug ? (
                            <a
                              href={`${window.location.origin}/live/${r.pageSlug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300"
                            >
                              Open Live <FaExternalLinkAlt className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-500">Not live</span>
                          )}
                        </td>

                        <td className="px-6 py-5 align-top">
                          <div className="flex flex-wrap gap-2">
                            {r.status === "pending" && (
                              <>
                                <button
                                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50 transition"
                                  disabled={loadingRow === r._id}
                                  onClick={() => handleApprove(r._id)}
                                >
                                  {loadingRow === r._id ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                                  Approve
                                </button>

                                <button
                                  className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50 transition"
                                  disabled={loadingRow === r._id}
                                  onClick={() => handleReject(r._id)}
                                >
                                  {loadingRow === r._id ? <FaSpinner className="animate-spin" /> : <FaTimes />}
                                  Reject
                                </button>
                              </>
                            )}

                            {(r.status === "approved" || r.status === "preview-ready") && r.pageSlug && (
                              <button
                                className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50 transition"
                                disabled={loadingRow === r._id}
                                onClick={() => handleDeploy(r.pageSlug, r._id)}
                              >
                                {loadingRow === r._id ? <FaSpinner className="animate-spin" /> : <FaRocket />}
                                Deploy
                              </button>
                            )}

                            {r.status === "deployed" && r.pageSlug && (
                              <button
                                className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50 transition"
                                disabled={loadingRow === r._id}
                                onClick={() => handleRollback(r.pageSlug, r._id)}
                              >
                                {loadingRow === r._id ? <FaSpinner className="animate-spin" /> : <FaUndo />}
                                Rollback
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredRequests.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center py-12 text-slate-400">
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
                  className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-xl"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                        Prompt
                      </p>
                      <h3 className="text-white font-semibold leading-7">
                        {r.prompt}
                      </h3>
                    </div>

                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${statusBadge(r.status)}`}>
                      {r.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
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
                        placeholder="Short page name"
                        className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
                      />
                      <button
                        onClick={() => handleSaveDisplayName(r._id)}
                        disabled={loadingRow === r._id}
                        className="rounded-xl bg-cyan-600 hover:bg-cyan-700 px-3 py-2 text-white transition disabled:opacity-50"
                      >
                        {loadingRow === r._id ? <FaSpinner className="animate-spin" /> : <FaSave />}
                      </button>
                    </div>
                  </div>

                  <div className="mb-4 text-sm text-slate-300">
                    <span className="text-slate-500">Submitted By:</span>{" "}
                    {r.userId?.email || "N/A"}
                  </div>

                  <div className="flex flex-wrap gap-3 mb-4">
                    {r.pageSlug && (
                      <a
                        href={`${window.location.origin}/preview/${r.pageSlug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
                      >
                        Preview <FaExternalLinkAlt className="w-3 h-3" />
                      </a>
                    )}

                    {r.status === "deployed" && r.pageSlug && (
                      <a
                        href={`${window.location.origin}/live/${r.pageSlug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300"
                      >
                        Open Live <FaExternalLinkAlt className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {r.status === "pending" && (
                      <>
                        <button
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50 transition"
                          disabled={loadingRow === r._id}
                          onClick={() => handleApprove(r._id)}
                        >
                          {loadingRow === r._id ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                          Approve
                        </button>

                        <button
                          className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50 transition"
                          disabled={loadingRow === r._id}
                          onClick={() => handleReject(r._id)}
                        >
                          {loadingRow === r._id ? <FaSpinner className="animate-spin" /> : <FaTimes />}
                          Reject
                        </button>
                      </>
                    )}

                    {(r.status === "approved" || r.status === "preview-ready") && r.pageSlug && (
                      <button
                        className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50 transition"
                        disabled={loadingRow === r._id}
                        onClick={() => handleDeploy(r.pageSlug, r._id)}
                      >
                        {loadingRow === r._id ? <FaSpinner className="animate-spin" /> : <FaRocket />}
                        Deploy
                      </button>
                    )}

                    {r.status === "deployed" && r.pageSlug && (
                      <button
                        className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50 transition"
                        disabled={loadingRow === r._id}
                        onClick={() => handleRollback(r.pageSlug, r._id)}
                      >
                        {loadingRow === r._id ? <FaSpinner className="animate-spin" /> : <FaUndo />}
                        Rollback
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {filteredRequests.length === 0 && (
                <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center text-slate-400">
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