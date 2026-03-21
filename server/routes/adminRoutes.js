const express = require("express")
const router = express.Router()
const { protect, adminOnly } = require("../middleware/authMiddleware")
const { getActiveUsers } = require("../controllers/adminController")

router.get("/active-users", protect, adminOnly, getActiveUsers)

module.exports = router