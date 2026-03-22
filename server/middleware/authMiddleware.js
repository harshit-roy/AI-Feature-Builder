const jwt = require("jsonwebtoken")
const User = require("../models/User")

const protect = async (req, res, next) => {
  try {
    let token = null

    const authHeader = req.headers.authorization

    // ✅ Check header exists and is properly formatted
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" })
    }

    let decoded

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" })
      }
      return res.status(401).json({ message: "Invalid token" })
    }

    // ✅ Fetch user safely
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    req.user = user
    next()

  } catch (error) {
    console.error("Auth middleware error:", error)
    return res.status(401).json({ message: "Authentication failed" })
  }
}

const adminOnly = (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      return next()
    }

    return res.status(403).json({ message: "Admin access only" })
  } catch (error) {
    console.error("Admin middleware error:", error)
    return res.status(403).json({ message: "Access denied" })
  }
}

module.exports = { protect, adminOnly }