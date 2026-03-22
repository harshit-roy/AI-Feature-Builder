import { Link } from "react-router-dom"
import {
  FaArrowRight,
  FaClock,
  FaGear,
  FaCircleCheck,
  FaRocket,
  FaCircleXmark,
  FaDownload
} from "react-icons/fa6"

export default function FeatureCard({ feature, darkMode = false }) {
  const cardClass = darkMode
    ? "bg-white/10 border border-white/10 text-white"
    : "bg-white border border-[#E6EBF5] text-[#1F2A44]"

  const mutedTextClass = darkMode ? "text-slate-300" : "text-[#64748B]"
  const subtleBgClass = darkMode ? "bg-white/10" : "bg-[#F8FAFF]"

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return darkMode
          ? "bg-yellow-400/15 text-yellow-200 border border-yellow-400/20"
          : "bg-amber-50 text-amber-700 border border-amber-100"
      case "generating":
        return darkMode
          ? "bg-blue-400/15 text-blue-200 border border-blue-400/20"
          : "bg-blue-50 text-blue-700 border border-blue-100"
      case "preview-ready":
      case "approved":
        return darkMode
          ? "bg-emerald-400/15 text-emerald-200 border border-emerald-400/20"
          : "bg-emerald-50 text-emerald-700 border border-emerald-100"
      case "deployed":
        return darkMode
          ? "bg-violet-400/15 text-violet-200 border border-violet-400/20"
          : "bg-violet-50 text-violet-700 border border-violet-100"
      case "rejected":
      case "failed":
        return darkMode
          ? "bg-red-400/15 text-red-200 border border-red-400/20"
          : "bg-red-50 text-red-700 border border-red-100"
      default:
        return darkMode
          ? "bg-white/10 text-slate-200 border border-white/10"
          : "bg-slate-100 text-slate-700 border border-slate-200"
    }
  }

  const getStatusMeta = (status) => {
    switch (status) {
      case "pending":
        return {
          icon: <FaClock />,
          text: "Your request is in progress...",
          textClass: darkMode ? "text-yellow-200" : "text-amber-700"
        }
      case "generating":
        return {
          icon: <FaGear className="animate-spin" />,
          text: "AI is generating your feature...",
          textClass: darkMode ? "text-blue-200" : "text-blue-700"
        }
      case "approved":
      case "preview-ready":
        return {
          icon: <FaCircleCheck />,
          text: "Ready for admin review and deployment",
          textClass: darkMode ? "text-emerald-200" : "text-emerald-700"
        }
      case "deployed":
        return {
          icon: <FaRocket />,
          text: "This page is deployed and available live",
          textClass: darkMode ? "text-violet-200" : "text-violet-700"
        }
      case "rejected":
      case "failed":
        return {
          icon: <FaCircleXmark />,
          text: "Request rejected",
          textClass: darkMode ? "text-red-200" : "text-red-700"
        }
      default:
        return {
          icon: <FaClock />,
          text: "Status unavailable",
          textClass: mutedTextClass
        }
    }
  }

  const handleDownloadCode = () => {
    if (!feature?.generatedCode?.trim()) return

    const safeName =
      (feature.displayName || feature.pageSlug || "generated-page")
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "generated-page"

    const blob = new Blob([feature.generatedCode], {
      type: "text/javascript;charset=utf-8"
    })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `${safeName}.jsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  const statusMeta = getStatusMeta(feature.status)
  const title = feature.displayName || feature.prompt || "Untitled feature"
  const previewText =
    title.length > 110 ? `${title.slice(0, 110)}...` : title

  const canDownloadCode = !!feature?.generatedCode?.trim()

  return (
    <div
      className={`group rounded-[24px] p-5 shadow-[0_16px_35px_rgba(31,42,68,0.08)] transition hover:-translate-y-1 ${cardClass}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${mutedTextClass}`}>
            Feature Request
          </p>
          <h3 className="mt-2 text-lg font-bold leading-7 break-words">
            {previewText}
          </h3>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${getStatusClass(
            feature.status
          )}`}
        >
          {feature.status?.replace("-", " ")}
        </span>
      </div>

      <div className={`mt-4 rounded-2xl p-4 ${subtleBgClass}`}>
        <div className={`flex items-start gap-3 text-sm font-medium ${statusMeta.textClass}`}>
          <span className="mt-0.5 shrink-0 text-sm">{statusMeta.icon}</span>
          <span className="leading-6">{statusMeta.text}</span>
        </div>
      </div>

      {(feature.pageSlug && feature.status === "deployed") || canDownloadCode ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {feature.pageSlug && feature.status === "deployed" && (
            <Link
              to={`/live/${feature.pageSlug}`}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
                darkMode
                  ? "bg-white/10 text-white hover:bg-white/15"
                  : "bg-gradient-to-r from-[#6D5DF6] to-[#8A7CFF] text-white shadow-[0_12px_24px_rgba(109,93,246,0.22)] hover:opacity-95"
              }`}
            >
              Open deployed page
              <FaArrowRight className="text-xs" />
            </Link>
          )}

          {canDownloadCode && (
            <button
              type="button"
              onClick={handleDownloadCode}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
                darkMode
                  ? "bg-white/10 text-white hover:bg-white/15"
                  : "border border-[#DCE4F3] bg-[#F9FBFF] text-[#1F2A44] hover:border-[#C9D6EE] hover:bg-white"
              }`}
            >
              <FaDownload className="text-sm" />
              Download code
            </button>
          )}
        </div>
      ) : null}
    </div>
  )
}