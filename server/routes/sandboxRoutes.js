const express = require("express")
const router = express.Router()

const { createSandbox } = require("../controllers/sandboxController")

router.post("/", createSandbox)

module.exports = router
