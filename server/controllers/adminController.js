exports.getActiveUsers = async (req, res) => {
  try {
    res.json({ count: 1 })
  } catch (err) {
    console.error("Active users error:", err)
    res.status(500).json({ message: "Server error" })
  }
}