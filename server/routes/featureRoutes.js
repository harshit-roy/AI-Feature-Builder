const express = require("express")
const router = express.Router()

const { protect, adminOnly } = require("../middleware/authMiddleware")

const {
  createRequest,
  getMyRequests,
  getAllRequests,
  approveRequest,
  rejectRequest,
  previewFeature,
  getAllFeaturesForAdmin,
  getPreviewBySlug,
  getPublicPageBySlug,
  updateFeatureCode,
  deployFeature,
  rollbackFeature,
  updateDisplayName
} = require("../controllers/featureController")

router.post("/request", protect, createRequest)
router.get("/my", protect, getMyRequests)

router.get("/admin/all", protect, adminOnly, getAllRequests)
router.put("/admin/approve/:id", protect, adminOnly, approveRequest)
router.put("/admin/reject/:id", protect, adminOnly, rejectRequest)
router.put("/update-code/:slug", protect, adminOnly, updateFeatureCode)
router.put("/deploy/:slug", protect, adminOnly, deployFeature)
router.put("/rollback/:slug", protect, adminOnly, rollbackFeature)
router.put("/admin/display-name/:id", protect, adminOnly, updateDisplayName)

router.get("/preview/:slug", getPreviewBySlug)
router.get("/page/:slug", getPublicPageBySlug)

module.exports = router