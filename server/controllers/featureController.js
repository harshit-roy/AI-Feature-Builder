const FeatureRequest = require("../models/FeatureRequest")
const stringSimilarity = require("string-similarity")
const generateReactPage = require("../services/aiService")
const slugify = require("slugify")

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
      previewUrl: `/preview/${slug}`
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

// get all requests (admin)
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

// approve request (admin)
exports.approveRequest = async (req, res) => {
  try {
    const { id } = req.params

    const request = await FeatureRequest.findById(id)

    if (!request) {
      return res.status(404).json({ message: "Request not found" })
    }

    request.status = "generating"
    await request.save()

    try {
      const code = await generateReactPage(request.prompt)
      const slug = request.pageSlug || (await createUniqueSlug(request.prompt))

      request.generatedCode = code || ""
      request.pageSlug = slug
      request.previewUrl = `/preview/${slug}`
      request.status = "approved"

      await request.save()

      return res.json({
        message: "Feature approved and AI page generated",
        request
      })
    } catch (aiErr) {
      console.error("AI generation error:", aiErr.message)

      request.status = "failed"
      await request.save()

      return res.status(500).json({
        message: "AI generation failed",
        request
      })
    }
  } catch (err) {
    console.error("Approve request error:", err)
    return res.status(500).json({ message: "Server error" })
  }
}

// reject request (admin)
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

// preview feature by slug
exports.previewFeature = async (req, res) => {
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
      previewUrl: feature.previewUrl || ""
    })
  } catch (err) {
    console.error("Preview feature error:", err)
    return res.status(500).json({ message: "Server error" })
  }
}

// admin listing
exports.getAllFeaturesForAdmin = async (req, res) => {
  try {
    const features = await FeatureRequest.find()
      .populate("userId", "email role")
      .sort({ createdAt: -1 })

    return res.json(features)
  } catch (err) {
    console.error("Get all features for admin error:", err)
    return res.status(500).json({ message: "Server error" })
  }
}

// get preview by slug
exports.getPreviewBySlug = async (req, res) => {
  try {
    const { slug } = req.params

    const feature = await FeatureRequest.findOne({ pageSlug: slug })

    if (!feature) {
      return res.status(404).json({
        message: "Feature not found"
      })
    }

    return res.json({
      generatedCode: feature.generatedCode || "",
      prompt: feature.prompt,
      status: feature.status,
      pageSlug: feature.pageSlug,
      previewUrl: feature.previewUrl || ""
    })
  } catch (err) {
    console.error("Get preview by slug error:", err)
    return res.status(500).json({
      message: "Server error"
    })
  }
}

// get public deployed page
exports.getPublicPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params

    const feature = await FeatureRequest.findOne({
      pageSlug: slug,
      status: "deployed"
    })

    if (!feature) {
      return res.status(404).json({
        message: "Page not found"
      })
    }

    res.json({
      generatedCode: feature.generatedCode,
      prompt: feature.prompt,
      pageSlug: feature.pageSlug,
      deployedAt: feature.deployedAt || null
    })
  } catch (err) {
    console.error("Public page fetch error:", err)
    res.status(500).json({
      message: "Server error"
    })
  }
}

// update feature code
exports.updateFeatureCode = async (req, res) => {
  try {
    const { slug } = req.params
    const { code } = req.body

    if (!code || typeof code !== "string" || !code.trim()) {
      return res.status(400).json({
        message: "Valid code is required"
      })
    }

    const feature = await FeatureRequest.findOne({ pageSlug: slug })

    if (!feature) {
      return res.status(404).json({
        message: "Feature not found"
      })
    }

    feature.generatedCode = code.trim()
    await feature.save()

    return res.json({
      message: "Code updated successfully",
      feature: {
        pageSlug: feature.pageSlug,
        status: feature.status,
        previewUrl: feature.previewUrl
      }
    })
  } catch (err) {
    console.error("Update feature code error:", err)
    return res.status(500).json({
      message: "Failed to update code"
    })
  }
}

// deploy feature
exports.deployFeature = async (req, res) => {
  try {
    const { slug } = req.params

    const feature = await FeatureRequest.findOne({ pageSlug: slug })

    if (!feature) {
      return res.status(404).json({
        message: "Feature not found"
      })
    }

    if (!feature.generatedCode || !feature.generatedCode.trim()) {
      return res.status(400).json({
        message: "Feature code is empty. Cannot deploy."
      })
    }

    feature.status = "deployed"
    feature.deployedAt = new Date()
    feature.deployedUrl = `/live/${feature.pageSlug}`

    await feature.save()

    return res.json({
      message: "Feature deployed successfully",
      feature: {
        pageSlug: feature.pageSlug,
        status: feature.status,
        deployedAt: feature.deployedAt,
        deployedUrl: feature.deployedUrl
      }
    })
  } catch (err) {
    console.error("Deploy feature error:", err)
    return res.status(500).json({
      message: "Deployment failed"
    })
  }
}

// rollback deployed feature
exports.rollbackFeature = async (req, res) => {
  try {
    const { slug } = req.params

    const feature = await FeatureRequest.findOne({ pageSlug: slug })

    if (!feature) {
      return res.status(404).json({
        message: "Feature not found"
      })
    }

    feature.status = "approved"
    feature.deployedAt = null
    feature.deployedUrl = ""

    await feature.save()

    return res.json({
      message: "Feature rolled back successfully",
      feature: {
        pageSlug: feature.pageSlug,
        status: feature.status
      }
    })
  } catch (err) {
    console.error("Rollback feature error:", err)
    return res.status(500).json({
      message: "Rollback failed"
    })
  }
}


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

    res.json({
      message: "Display name updated successfully",
      feature
    })
  } catch (err) {
    console.error("Update display name error:", err)
    res.status(500).json({ message: "Server error" })
  }
}