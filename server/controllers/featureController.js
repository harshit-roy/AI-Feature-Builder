const FeatureRequest = require("../models/FeatureRequest")
const generateReactPage = require("../services/aiService")
const slugify = require("slugify")

const { validateReactCode } = require("../services/validatorService")
const { autoFixCode } = require("../services/autoFixService")
const {
  compileReactCode
} = require("../services/compilerService")

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
  request.generationAttempts =
    (request.generationAttempts || 0) + 1

  request.lastGeneratedAt = new Date()

  await request.save()

  try {
    /*
     * Generate raw AI code
     */
    const generatedCode =
      await generateReactPage(request.prompt)

    /*
     * First validation pass
     */
    const initialValidation =
      validateReactCode(generatedCode)

    /*
     * Auto fix
     */
    const fixedCode =
  autoFixCode(generatedCode)

const finalValidation =
  validateReactCode(fixedCode)

let compiledCode = ""

if (finalValidation.success) {

try {
  console.log("========== COMPILING ==========")

  compiledCode =
    await compileReactCode(
      fixedCode
    )

  console.log("COMPILE SUCCESS")
  console.log(
    compiledCode.substring(0, 500)
  )
}
catch (err) {
  console.error(
    "COMPILE FAILED:"
  )

  console.error(err)

  throw err
}
}

    if (!finalValidation.success) {
      request.status = "failed"

      request.lastError =
        finalValidation.errors.join("\n")

      request.validationStatus = "failed"

      request.validationResults = {
        syntaxValid:
          finalValidation.syntaxValid,

        jsxValid:
          finalValidation.jsxValid,

        componentFound:
          finalValidation.componentFound,

        importsValid:
          finalValidation.importsValid,

        exportsValid:
          finalValidation.exportsValid,

        validationPassed: false,

        errors:
          finalValidation.errors,

        warnings:
          finalValidation.warnings
      }

      await request.save()

      return {
        success: false,
        statusCode: 400,
        message:
          "Generated code failed validation",
        request
      }
    }

    const slug =
      request.pageSlug ||
      (await createUniqueSlug(request.prompt))

    request.generatedCode = generatedCode

    request.fixedCode = fixedCode
    request.compiledCode =
  compiledCode
  console.log(
  "FINAL COMPILED LENGTH:",
  request.compiledCode.length
)
    request.pageSlug = slug

    request.previewUrl = `/preview/${slug}`

    request.status = "approved"

    request.lastError = ""

    request.validationStatus = "passed"

    request.validationResults = {
      syntaxValid:
        finalValidation.syntaxValid,

      jsxValid:
        finalValidation.jsxValid,

      componentFound:
        finalValidation.componentFound,

      importsValid:
        finalValidation.importsValid,

      exportsValid:
        finalValidation.exportsValid,

      validationPassed: true,

      errors:
        finalValidation.errors,

      warnings:
        finalValidation.warnings
    }

    await request.save()

    return {
      success: true,
      statusCode: 200,
      message:
        "Feature approved and validated",
      request
    }
  } catch (err) {
    console.error(
      "Generation pipeline error:",
      err
    )

    request.status = "failed"

    request.lastError =
      err.message || "Generation failed"

    await request.save()

    return {
      success: false,
      statusCode: 500,
      message:
        "Generation failed",
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

    const feature =
      await FeatureRequest.findOne({
        pageSlug: slug
      })

    if (!feature) {
      return res.status(404).json({
        message: "Feature not found"
      })
    }

    return res.json({
      generatedCode:
        feature.generatedCode || "",

      fixedCode:
        feature.fixedCode || "",

      prompt:
        feature.prompt,

      status:
        feature.status,

      pageSlug:
        feature.pageSlug,

      previewUrl:
        feature.previewUrl || "",

      deployedUrl:
        feature.deployedUrl || "",

      validationStatus:
        feature.validationStatus || "pending",

      validationResults:
        feature.validationResults || {},

      buildStatus:
        feature.buildStatus || "not-started",

      buildErrors:
        feature.buildErrors || [],

      buildLogs:
        feature.buildLogs || [],

      lastError:
        feature.lastError || "",

      generationAttempts:
        feature.generationAttempts || 0,

      lastGeneratedAt:
        feature.lastGeneratedAt || null,

      deploymentVersion:
        feature.deploymentVersion || 0
    })
  } catch (err) {
    console.error(
      "Preview error:",
      err
    )

    return res.status(500).json({
      message:
        "Server error"
    })
  }
}

// public deployed page
exports.getPublicPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params

    const feature =
      await FeatureRequest.findOne({
        pageSlug: slug,
        status: "deployed"
      })

    if (!feature) {
      return res.status(404).json({
        message:
          "Page not found"
      })
    }

    return res.json({
  compiledCode:
    feature.compiledCode || "",

  generatedCode:
    feature.fixedCode ||
    feature.generatedCode,

  validationStatus:
    feature.validationStatus,

  deployedAt:
    feature.deployedAt,

  deploymentVersion:
    feature.deploymentVersion || 0,

  pageSlug:
    feature.pageSlug,

  prompt:
    feature.prompt
})
  } catch (err) {
    console.error(
      "Public page error:",
      err
    )

    return res.status(500).json({
      message:
        "Server error"
    })
  }
}

// update code
exports.updateFeatureCode = async (req, res) => {
  try {
    const { slug } = req.params
    const { code } = req.body

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        message: "Valid code is required"
      })
    }

    const feature = await FeatureRequest.findOne({
      pageSlug: slug
    })

    if (!feature) {
      return res.status(404).json({
        message: "Feature not found"
      })
    }

    const fixedCode =
  autoFixCode(code)

const validation =
  validateReactCode(fixedCode)

let compiledCode = ""

if (validation.success) {
  compiledCode =
    await compileReactCode(
      fixedCode
    )
}

    feature.generatedCode = code.trim()

    feature.fixedCode = fixedCode
    feature.compiledCode =
  compiledCode

    feature.validationStatus =
      validation.success
        ? "passed"
        : "failed"

    feature.validationResults = {
      syntaxValid:
        validation.syntaxValid,

      jsxValid:
        validation.jsxValid,

      componentFound:
        validation.componentFound,

      importsValid:
        validation.importsValid,

      exportsValid:
        validation.exportsValid,

      validationPassed:
        validation.success,

      errors:
        validation.errors,

      warnings:
        validation.warnings
    }

    feature.lastError =
      validation.success
        ? ""
        : validation.errors.join("\n")

    await feature.save()

    if (!validation.success) {
      return res.status(400).json({
        message:
          "Validation failed",
        validation
      })
    }

    return res.json({
      message:
        "Code saved successfully",
      validation
    })
  } catch (err) {
    console.error(
      "Update code error:",
      err
    )

    return res.status(500).json({
      message:
        "Failed to update code"
    })
  }
}

// deploy
exports.deployFeature = async (req, res) => {
  try {
    const { slug } = req.params

    const feature =
      await FeatureRequest.findOne({
        pageSlug: slug
      })

    if (!feature) {
      return res.status(404).json({
        message:
          "Feature not found"
      })
    }

    const validation =
      validateReactCode(
        feature.fixedCode ||
        feature.generatedCode
      )

    if (!validation.success) {
      feature.validationStatus =
        "failed"

      feature.lastError =
        validation.errors.join("\n")

      await feature.save()

      return res.status(400).json({
        message:
          "Deployment blocked. Validation failed.",
        validation
      })
    }

    feature.status =
      "deployed"
    if (!feature.compiledCode) {
  feature.compiledCode =
    await compileReactCode(
      feature.fixedCode ||
      feature.generatedCode
    )

  await feature.save()
}
    feature.deployedAt =
      new Date()

    feature.deployedUrl =
      `/live/${feature.pageSlug}`

    feature.lastError = ""

    feature.validationStatus =
      "passed"

    await feature.save()

    return res.json({
      message:
        "Feature deployed successfully",
      feature
    })
  } catch (err) {
    console.error(
      "Deploy error:",
      err
    )

    return res.status(500).json({
      message:
        "Deployment failed"
    })
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