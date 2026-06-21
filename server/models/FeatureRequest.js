const mongoose = require("mongoose")

const deploymentVersionSchema = new mongoose.Schema(
  {
    version: {
      type: Number,
      required: true
    },

    generatedCode: {
      type: String,
      default: ""
    },

    fixedCode: {
      type: String,
      default: ""
    },

    compiledCode: {
      type: String,
      default: ""
    },

    deployedAt: {
      type: Date,
      default: Date.now
    },

    deployedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    buildStatus: {
      type: String,
      enum: ["success", "failed"],
      default: "success"
    }
  },
  { _id: false }
)

const buildLogSchema = new mongoose.Schema(
  {
    stage: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["info", "success", "warning", "error"],
      default: "info"
    },

    message: {
      type: String,
      required: true
    },

    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
)

const validationResultSchema = new mongoose.Schema(
  {
    syntaxValid: {
      type: Boolean,
      default: false
    },

    jsxValid: {
      type: Boolean,
      default: false
    },

    componentFound: {
      type: Boolean,
      default: false
    },

    importsValid: {
      type: Boolean,
      default: false
    },

    exportsValid: {
      type: Boolean,
      default: false
    },

    validationPassed: {
      type: Boolean,
      default: false
    },

    errors: {
      type: [String],
      default: []
    },

    warnings: {
      type: [String],
      default: []
    }
  },
  { _id: false }
)

const featureRequestSchema = new mongoose.Schema(
  {
    prompt: {
      type: String,
      required: true,
      trim: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: [
        "pending",
        "generating",
        "validating",
        "compiling",
        "preview-ready",
        "approved",
        "rejected",
        "failed",
        "deployed"
      ],
      default: "pending"
    },

    aiSchema: {
      type: Object,
      default: null
    },

    /*
     * Original AI generated source
     */
    generatedCode: {
      type: String,
      default: ""
    },

    /*
     * Auto-fixed version after validator
     */
    fixedCode: {
      type: String,
      default: ""
    },

    /*
     * Backend compiled JS
     * This becomes the source used in deployment
     */
    compiledCode: {
      type: String,
      default: ""
    },

    pageSlug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      default: ""
    },

    previewUrl: {
      type: String,
      default: ""
    },

    deployedUrl: {
      type: String,
      default: ""
    },

    deployedAt: {
      type: Date,
      default: null
    },

    displayName: {
      type: String,
      default: "",
      trim: true
    },

    lastError: {
      type: String,
      default: "",
      trim: true
    },

    generationAttempts: {
      type: Number,
      default: 0
    },

    lastGeneratedAt: {
      type: Date,
      default: null
    },

    compiledAt: {
      type: Date,
      default: null
    },

    /*
     * Validation Engine
     */
    validationStatus: {
      type: String,
      enum: ["pending", "passed", "failed"],
      default: "pending"
    },

    validationResults: {
      type: validationResultSchema,
      default: () => ({})
    },

    /*
     * Build Pipeline
     */
    buildStatus: {
      type: String,
      enum: [
        "not-started",
        "building",
        "success",
        "failed"
      ],
      default: "not-started"
    },

    buildErrors: {
      type: [String],
      default: []
    },

    buildLogs: {
      type: [buildLogSchema],
      default: []
    },

    /*
     * Deployment Versioning
     */
    deploymentVersion: {
      type: Number,
      default: 0
    },

    versions: {
      type: [deploymentVersionSchema],
      default: []
    },

    /*
     * Health Monitoring
     */
    renderSuccessCount: {
      type: Number,
      default: 0
    },

    renderFailureCount: {
      type: Number,
      default: 0
    },

    runtimeErrorCount: {
      type: Number,
      default: 0
    },

    averageLoadTimeMs: {
      type: Number,
      default: 0
    },

    lastHealthCheckAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model(
  "FeatureRequest",
  featureRequestSchema
)