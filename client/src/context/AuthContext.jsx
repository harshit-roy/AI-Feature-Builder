import { createContext, useState, useEffect } from "react"
import api from "../api/axios"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user")

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      }
    } catch (err) {
      console.error("Failed to restore user from localStorage:", err)
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    } finally {
      setLoading(false)
    }
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
        message: err.response?.data?.message || "Something went wrong. Please try again."
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
        message: err.response?.data?.message || "Something went wrong. Please try again."
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("afb_page_")) {
        localStorage.removeItem(key)
      }
    })

    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, signupUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}