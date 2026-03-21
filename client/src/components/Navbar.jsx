import { useContext, useEffect, useMemo, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import api from "../api/axios"
import { Link, useLocation } from "react-router-dom"
import {
  FaBars,
  FaTimes,
  FaChevronDown,
  FaRocket
} from "react-icons/fa"

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const location = useLocation()

  const [pages, setPages] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isAdmin = user?.role === "admin"

  const fetchPages = async () => {
    if (!user) return

    try {
      const res = await api.get("/features/admin/all", {
        headers: { Authorization: `Bearer ${user.token}` }
      })

      const visiblePages = res.data.filter(
        (r) =>
          (r.status === "approved" ||
            r.status === "deployed" ||
            r.status === "preview-ready") &&
          r.pageSlug
      )

      setPages(visiblePages)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchPages()
  }, [user])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setMoreOpen(false)
  }, [location.pathname])

  const getPageLink = (page) => {
    if (page.status === "deployed") return `/live/${page.pageSlug}`
    return `/live/${page.pageSlug}`
  }

  const getPageLabel = (page) => {
    const name = page.displayName || page.prompt || "Untitled"
    return name.length > 20 ? `${name.slice(0, 20)}...` : name
  }

  const visiblePages = useMemo(() => pages.slice(0, 4), [pages])
  const overflowPages = useMemo(() => pages.slice(4), [pages])

  const navLinkClass = (path) =>
    `px-3 py-2 rounded-xl text-sm font-medium transition ${
      location.pathname === path
        ? "bg-cyan-500/20 text-cyan-300"
        : "text-slate-200 hover:text-white hover:bg-white/10"
    }`

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-slate-950/85 backdrop-blur-xl border-b border-white/10 shadow-2xl"
            : "bg-slate-950/60 backdrop-blur-md border-b border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link to="/" className="flex items-center gap-3 min-w-0 group">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <FaRocket className="text-white text-sm" />
                </div>

                <div className="min-w-0">
                  <div className="text-white font-extrabold tracking-tight text-lg leading-none group-hover:text-cyan-300 transition">
                    AI Feature Builder
                  </div>
                  <div className="text-[11px] text-slate-400 hidden sm:block">
                    Build • Review • Deploy
                  </div>
                </div>
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                Dashboard
              </Link>

              {visiblePages.map((p) => (
                <Link
                  key={p._id}
                  to={getPageLink(p)}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition"
                  title={p.displayName || p.prompt}
                >
                  {getPageLabel(p)}
                </Link>
              ))}

              {overflowPages.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setMoreOpen((prev) => !prev)}
                    className="px-3 py-2 rounded-xl text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition flex items-center gap-2"
                  >
                    More
                    <FaChevronDown
                      className={`text-xs transition-transform ${moreOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {moreOpen && (
                    <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden">
                      <div className="max-h-80 overflow-y-auto py-2">
                        {overflowPages.map((p) => (
                          <Link
                            key={p._id}
                            to={getPageLink(p)}
                            className="block px-4 py-3 text-sm text-slate-200 hover:bg-white/10 hover:text-white transition"
                            title={p.displayName || p.prompt}
                          >
                            {p.displayName || p.prompt}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isAdmin && (
                <Link to="/admin" className={navLinkClass("/admin")}>
                  Admin Panel
                </Link>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              {user?.email && (
                <div className="hidden xl:flex items-center px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                  {user.email}
                </div>
              )}

              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-rose-500/90 hover:bg-rose-500 text-white text-sm font-semibold transition shadow-lg shadow-rose-500/20"
              >
                Logout
              </button>
            </div>

            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="h-10 w-10 rounded-xl bg-white/10 border border-white/10 text-white flex items-center justify-center hover:bg-white/15 transition"
              >
                {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            menuOpen ? "max-h-[80vh]" : "max-h-0"
          }`}
        >
          <div className="mx-4 mb-4 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="p-4 space-y-2">
              <Link
                to="/"
                className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition"
              >
                Dashboard
              </Link>

              {pages.map((p) => (
                <Link
                  key={p._id}
                  to={getPageLink(p)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition"
                  title={p.displayName || p.prompt}
                >
                  {p.displayName || p.prompt}
                </Link>
              ))}

              {isAdmin && (
                <Link
                  to="/admin"
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-cyan-300 bg-cyan-500/10 border border-cyan-500/20"
                >
                  Admin Panel
                </Link>
              )}

              {user?.email && (
                <div className="px-4 py-3 rounded-xl text-sm text-slate-400 bg-white/5 border border-white/10">
                  {user.email}
                </div>
              )}

              <button
                onClick={logout}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold bg-rose-500/90 hover:bg-rose-500 text-white transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="h-16" />
    </>
  )
}