const mongoose = require("mongoose")

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

    generatedCode: {
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
      default: ""
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model("FeatureRequest", featureRequestSchema)