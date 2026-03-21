import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { FaBars, FaTimes } from "react-icons/fa"
import logo from "../assets/Logo.png"

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isAdmin = user?.role === "admin"

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const navLinkClass = (path) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition ${
      location.pathname === path
        ? "bg-[#6D5DF6]/10 text-[#6D5DF6]"
        : "text-[#64748B] hover:text-[#1F2A44] hover:bg-[#F3F5FB]"
    }`

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-[#E6EBF5] shadow-sm"
            : "bg-white/60 backdrop-blur-md border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-3 group min-w-0">
              <div className="h-11 w-11 rounded-2xl bg-white border border-[#E6EBF5] flex items-center justify-center shadow-sm shrink-0">
                <img
                  src={logo}
                  alt="AI Feature Builder"
                  className="h-7 w-7 object-contain"
                />
              </div>

              <div className="min-w-0">
                <div className="font-extrabold text-[#1F2A44] text-lg leading-none group-hover:text-[#6D5DF6] transition truncate">
                  AI Feature Builder
                </div>
                <div className="text-[11px] text-[#94A3B8] hidden sm:block">
                  Build • Review • Deploy
                </div>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-2">
              <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                Dashboard
              </Link>

              {isAdmin && (
                <Link to="/admin" className={navLinkClass("/admin")}>
                  Admin
                </Link>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              {user?.email && (
                <div className="px-3 py-2 rounded-xl bg-[#F5F7FB] border border-[#E6EBF5] text-xs text-[#64748B] max-w-[220px] truncate">
                  {user.email}
                </div>
              )}

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F43F5E] to-[#FB7185] text-white text-sm font-semibold shadow-sm hover:opacity-90 transition"
              >
                Logout
              </button>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden h-10 w-10 rounded-xl bg-[#F5F7FB] border border-[#E6EBF5] flex items-center justify-center"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            menuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mx-4 my-4 rounded-2xl border border-[#E6EBF5] bg-white shadow-lg p-4 space-y-2">
            <Link
              to="/dashboard"
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition ${
                location.pathname === "/dashboard"
                  ? "bg-[#EEF2FF] text-[#6D5DF6]"
                  : "text-[#1F2A44] hover:bg-[#F5F7FB]"
              }`}
            >
              Dashboard
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition ${
                  location.pathname === "/admin"
                    ? "bg-[#EEF2FF] text-[#6D5DF6]"
                    : "text-[#1F2A44] hover:bg-[#F5F7FB]"
                }`}
              >
                Admin Panel
              </Link>
            )}

            {user?.email && (
              <div className="px-4 py-3 text-sm text-[#64748B] bg-[#F5F7FB] rounded-xl break-all">
                {user.email}
              </div>
            )}

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-xl bg-[#F43F5E] text-white font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="h-16" />
    </>
  )
}