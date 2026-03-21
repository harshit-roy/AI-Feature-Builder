import { createContext, useState, useEffect } from "react"
import api from "../api/axios"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const loginUser = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password })

      const loggedInUser = {
        token: res.data.token,
        role: res.data.role,
        email: res.data.email
      }

      localStorage.setItem("user", JSON.stringify(loggedInUser))
      localStorage.setItem("token", res.data.token)
      setUser(loggedInUser)

      return { success: true }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Error"
      }
    }
  }

  const signupUser = async (email, password) => {
    try {
      const res = await api.post("/auth/signup", { email, password })

      const signedUpUser = {
        token: res.data.token,
        role: res.data.role,
        email: res.data.email
      }

      localStorage.setItem("user", JSON.stringify(signedUpUser))
      localStorage.setItem("token", res.data.token)
      setUser(signedUpUser)

      return { success: true }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Error"
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    window.location.href = "/"
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, signupUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}