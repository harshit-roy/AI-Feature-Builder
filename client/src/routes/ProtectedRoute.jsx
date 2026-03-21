import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useContext(AuthContext)

  // Show loading state while user data is being fetched
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-white text-xl">
        Loading...
      </div>
    )

  // Redirect to login if user is not logged in
  if (!user) return <Navigate to="/login" />

  return children
}