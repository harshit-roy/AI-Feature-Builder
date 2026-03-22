const User = require("../models/User")
const bcrypt = require("bcryptjs")
const generateToken = require("../utils/generateToken")

// 🔥 SIMPLE VALIDATORS
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

exports.signup = async (req, res) => {
  try {
    let { email, password } = req.body

    // ✅ BASIC VALIDATION
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      })
    }

    email = email.trim().toLowerCase()
    password = password.trim()

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format"
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      })
    }

    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      email,
      password: hashedPassword
    })

    const token = generateToken(user._id, user.role)

    return res.status(201).json({
      token,
      role: user.role,
      email: user.email
    })
  } catch (err) {
    console.error("Signup error:", err)
    return res.status(500).json({
      message: "Server error during signup"
    })
  }
}

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body

    // ✅ BASIC VALIDATION
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      })
    }

    email = email.trim().toLowerCase()
    password = password.trim()

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format"
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      })
    }

    // ✅ SAFE PASSWORD CHECK
    if (!user.password) {
      return res.status(400).json({
        message: "Invalid credentials"
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      })
    }

    const token = generateToken(user._id, user.role)

    return res.json({
      token,
      role: user.role,
      email: user.email
    })
  } catch (err) {
    console.error("Login error:", err)
    return res.status(500).json({
      message: "Server error during login"
    })
  }
}