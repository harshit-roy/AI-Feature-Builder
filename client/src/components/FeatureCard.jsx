import { Link } from "react-router-dom"

export default function FeatureCard({ feature, darkMode = false }) {
  const cardClass = darkMode
    ? "bg-white/10 border border-gray-800 text-white"
    : "bg-white border border-gray-200 text-black"

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "generating":
        return "bg-blue-100 text-blue-800"
      case "preview-ready":
      case "approved":
        return "bg-green-100 text-green-800"
      case "deployed":
        return "bg-purple-100 text-purple-800"
      case "rejected":
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className={`rounded-xl p-5 shadow-lg ${cardClass}`}>
      <h3 className="text-lg font-semibold mb-3">{feature.prompt}</h3>

      <div className="mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(feature.status)}`}>
          {feature.status?.toUpperCase()}
        </span>
      </div>

      {feature.status === "pending" && (
        <p className="text-sm text-yellow-300">🚧 Your request is in progress...</p>
      )}

      {feature.status === "generating" && (
        <p className="text-sm text-blue-300">⚙️ AI is generating your feature...</p>
      )}

      {(feature.status === "approved" || feature.status === "preview-ready") && (
        <p className="text-sm text-green-300">✅ Ready for admin review and deployment</p>
      )}

      {feature.status === "deployed" && feature.pageSlug && (
        <Link
          to={`/live/${feature.pageSlug}`}
          className="inline-block mt-3 text-sm text-cyan-300 hover:underline"
        >
          Open deployed page
        </Link>
      )}

      {feature.status === "rejected" && (
        <p className="text-sm text-red-300">❌ Request rejected</p>
      )}
    </div>
  )
}