const express = require("express")
const router = express.Router()

const {
  createRequest,
  getMyRequests,
  getAllRequests,
  approveRequest,
  retryGenerateRequest,
  updatePrompt,
  rejectRequest,
  getPreviewBySlug,
  getPublicPageBySlug,
  updateFeatureCode,
  deployFeature,
  rollbackFeature,
  updateDisplayName
} = require("../controllers/featureController")

const { protect, adminOnly } = require("../middleware/authMiddleware")

// user
router.post("/request", protect, createRequest)
router.get("/my", protect, getMyRequests)

// admin
router.get("/admin/all", protect, adminOnly, getAllRequests)
router.put("/admin/approve/:id", protect, adminOnly, approveRequest)
router.put("/admin/retry/:id", protect, adminOnly, retryGenerateRequest)
router.put("/admin/update-prompt/:id", protect, adminOnly, updatePrompt)
router.put("/admin/reject/:id", protect, adminOnly, rejectRequest)
router.put("/admin/display-name/:id", protect, adminOnly, updateDisplayName)

// preview / live
router.get("/preview/:slug", getPreviewBySlug)
router.get("/page/:slug", getPublicPageBySlug)

// code / deploy
router.put("/update-code/:slug", protect, adminOnly, updateFeatureCode)
router.put("/deploy/:slug", protect, adminOnly, deployFeature)
router.put("/rollback/:slug", protect, adminOnly, rollbackFeature)

module.exports = router