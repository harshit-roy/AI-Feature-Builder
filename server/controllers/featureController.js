const FeatureRequest = require("../models/FeatureRequest")
const generateReactPage = require("../services/aiService")
const slugify = require("slugify")

const isValidGeneratedCode = (code) => {
  if (!code || typeof code !== "string") return false
  if (!code.includes("const GeneratedPage")) return false
  return true
}

const createUniqueSlug = async (prompt) => {
  const baseSlug = slugify(prompt, { lower: true, strict: true }) || "feature"
  let slug = `${baseSlug}-${Date.now()}`

  let exists = await FeatureRequest.findOne({ pageSlug: slug })

  while (exists) {
    slug = `${baseSlug}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    exists = await FeatureRequest.findOne({ pageSlug: slug })
  }

  return slug
}

const runGenerationForRequest = async (request) => {
  request.status = "generating"
  request.lastError = ""
  request.generationAttempts = (request.generationAttempts || 0) + 1
  request.lastGeneratedAt = new Date()
  await request.save()

  try {
    const code = await generateReactPage(request.prompt)

    if (!isValidGeneratedCode(code)) {
      request.status = "failed"
      request.lastError = "Invalid AI output: GeneratedPage component missing"
      await request.save()

      return {
        success: false,
        statusCode: 500,
        message: "Invalid AI output",
        request
      }
    }

    const slug = request.pageSlug || (await createUniqueSlug(request.prompt))

    request.generatedCode = code
    request.pageSlug = slug
    request.previewUrl = `/preview/${slug}`
    request.status = "approved"
    request.lastError = ""

    await request.save()

    return {
      success: true,
      statusCode: 200,
      message: "Feature approved and AI page generated",
      request
    }
  } catch (aiErr) {
    console.error("AI generation error:", aiErr.message)

    request.status = "failed"
    request.lastError = aiErr.message || "AI generation failed"
    await request.save()

    return {
      success: false,
      statusCode: 500,
      message: "AI generation failed",
      request
    }
  }
}

// create feature request
exports.createRequest = async (req, res) => {
  try {
    const { prompt } = req.body

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: "Prompt is required" })
    }

    const currentUserId = req.user?._id || req.user?.id

    if (!currentUserId) {
      return res.status(401).json({ message: "User not authenticated properly" })
    }

    const cleanedPrompt = prompt.trim()
    const slug = await createUniqueSlug(cleanedPrompt)

    const feature = await FeatureRequest.create({
      prompt: cleanedPrompt,
      userId: currentUserId,
      generatedCode: "",
      status: "pending",
      pageSlug: slug,
      previewUrl: `/preview/${slug}`,
      lastError: "",
      generationAttempts: 0,
      lastGeneratedAt: null
    })

    return res.status(201).json({
      message: "Request submitted successfully",
      feature
    })
  } catch (err) {
    console.error("Create request error:", err)
    return res.status(500).json({ message: "Server error" })
  }
}

// get my requests
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await FeatureRequest.find({ userId: req.user._id }).sort({
      createdAt: -1
    })

    return res.json(requests)
  } catch (err) {
    console.error("Get my requests error:", err)
    return res.status(500).json({ message: "Server error" })
  }
}

// admin - all requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await FeatureRequest.find()
      .populate("userId", "email role")
      .sort({ createdAt: -1 })

    return res.json(requests)
  } catch (err) {
    console.error("Get all requests error:", err)
    return res.status(500).json({ message: "Server error" })
  }
}

// approve request (AI generation)
exports.approveRequest = async (req, res) => {
  try {
    const { id } = req.params

    const request = await FeatureRequest.findById(id)

    if (!request) {
      return res.status(404).json({ message: "Request not found" })
    }

    const result = await runGenerationForRequest(request)

    return res.status(result.statusCode).json({
      message: result.message,
      request: result.request
    })
  } catch (err) {
    console.error("Approve request error:", err)
    return res.status(500).json({ message: "Server error" })
  }
}

// retry / generate again with optional prompt update
exports.retryGenerateRequest = async (req, res) => {
  try {
    const { id } = req.params
    const { prompt } = req.body

    const request = await FeatureRequest.findById(id)

    if (!request) {
      return res.status(404).json({ message: "Request not found" })
    }

    if (prompt && typeof prompt === "string" && prompt.trim()) {
      request.prompt = prompt.trim()
    }

    const result = await runGenerationForRequest(request)

    return res.status(result.statusCode).json({
      message: result.message,
      request: result.request
    })
  } catch (err) {
    console.error("Retry request error:", err)
    return res.status(500).json({ message: "Server error" })
  }
}

// update prompt only before retry if admin wants to edit it first
exports.updatePrompt = async (req, res) => {
  try {
    const { id } = req.params
    const { prompt } = req.body

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ message: "Valid prompt is required" })
    }

    const request = await FeatureRequest.findById(id)

    if (!request) {
      return res.status(404).json({ message: "Request not found" })
    }

    request.prompt = prompt.trim()
    await request.save()

    return res.json({
      message: "Prompt updated successfully",
      request
    })
  } catch (err) {
    console.error("Update prompt error:", err)
    return res.status(500).json({ message: "Server error" })
  }
}

// reject request
exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params

    const request = await FeatureRequest.findById(id)

    if (!request) {
      return res.status(404).json({ message: "Request not found" })
    }

    request.status = "rejected"
    await request.save()

    return res.json({
      message: "Request rejected successfully",
      request
    })
  } catch (err) {
    console.error("Reject request error:", err)
    return res.status(500).json({ message: "Server error" })
  }
}

// preview by slug
exports.getPreviewBySlug = async (req, res) => {
  try {
    const { slug } = req.params

    const feature = await FeatureRequest.findOne({ pageSlug: slug })

    if (!feature) {
      return res.status(404).json({ message: "Feature not found" })
    }

    return res.json({
      generatedCode: feature.generatedCode || "",
      prompt: feature.prompt,
      status: feature.status,
      pageSlug: feature.pageSlug,
      previewUrl: feature.previewUrl || "",
      lastError: feature.lastError || "",
      generationAttempts: feature.generationAttempts || 0,
      lastGeneratedAt: feature.lastGeneratedAt || null
    })
  } catch (err) {
    console.error("Preview error:", err)
    return res.status(500).json({ message: "Server error" })
  }
}

// public deployed page
exports.getPublicPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params

    const feature = await FeatureRequest.findOne({
      pageSlug: slug,
      status: "deployed"
    })

    if (!feature) {
      return res.status(404).json({ message: "Page not found" })
    }

    return res.json({
      generatedCode: feature.generatedCode,
      prompt: feature.prompt,
      pageSlug: feature.pageSlug,
      deployedAt: feature.deployedAt || null
    })
  } catch (err) {
    console.error("Public page error:", err)
    return res.status(500).json({ message: "Server error" })
  }
}

// update code
exports.updateFeatureCode = async (req, res) => {
  try {
    const { slug } = req.params
    const { code } = req.body

    if (!code || typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ message: "Valid code is required" })
    }

    if (!isValidGeneratedCode(code)) {
      return res.status(400).json({
        message: "Invalid code format (GeneratedPage missing)"
      })
    }

    const feature = await FeatureRequest.findOne({ pageSlug: slug })

    if (!feature) {
      return res.status(404).json({ message: "Feature not found" })
    }

    feature.generatedCode = code.trim()
    feature.lastError = ""
    await feature.save()

    return res.json({
      message: "Code updated successfully",
      feature: {
        pageSlug: feature.pageSlug,
        status: feature.status
      }
    })
  } catch (err) {
    console.error("Update code error:", err)
    return res.status(500).json({ message: "Failed to update code" })
  }
}

// deploy
exports.deployFeature = async (req, res) => {
  try {
    const { slug } = req.params

    const feature = await FeatureRequest.findOne({ pageSlug: slug })

    if (!feature) {
      return res.status(404).json({ message: "Feature not found" })
    }

    if (!isValidGeneratedCode(feature.generatedCode)) {
      return res.status(400).json({
        message: "Invalid or empty code. Cannot deploy."
      })
    }

    feature.status = "deployed"
    feature.deployedAt = new Date()
    feature.deployedUrl = `/live/${feature.pageSlug}`
    feature.lastError = ""

    await feature.save()

    return res.json({
      message: "Feature deployed successfully",
      feature
    })
  } catch (err) {
    console.error("Deploy error:", err)
    return res.status(500).json({ message: "Deployment failed" })
  }
}

// rollback
exports.rollbackFeature = async (req, res) => {
  try {
    const { slug } = req.params

    const feature = await FeatureRequest.findOne({ pageSlug: slug })

    if (!feature) {
      return res.status(404).json({ message: "Feature not found" })
    }

    feature.status = "approved"
    feature.deployedAt = null
    feature.deployedUrl = ""

    await feature.save()

    return res.json({
      message: "Feature rolled back successfully",
      feature
    })
  } catch (err) {
    console.error("Rollback error:", err)
    return res.status(500).json({ message: "Rollback failed" })
  }
}

// update display name
exports.updateDisplayName = async (req, res) => {
  try {
    const { id } = req.params
    const { displayName } = req.body

    if (!displayName || !displayName.trim()) {
      return res.status(400).json({ message: "Display name is required" })
    }

    const feature = await FeatureRequest.findById(id)

    if (!feature) {
      return res.status(404).json({ message: "Feature not found" })
    }

    feature.displayName = displayName.trim()
    await feature.save()

    return res.json({
      message: "Display name updated successfully",
      feature
    })
  } catch (err) {
    console.error("Display name error:", err)
    return res.status(500).json({ message: "Server error" })
  }
}