import mongoose from "mongoose";

const alertTimelineSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    severity: {
      type: String,
      enum: ["critical", "high", "medium", "low"],
      required: true,
    },

    target: {
      type: String,
      required: true,
      trim: true,
    },

    scanId: {
      type: String,
      default: null,
    },

    missionId: {
      type: String,
      default: null,
    },

    source: {
      type: String,
      default: "finding-engine",
    },

    status: {
      type: String,
      enum: ["open", "acknowledged", "investigating", "resolved", "closed"],
      default: "open",
    },

    // Phase 3A Intelligence Fields

    evidence: {
      type: [String],
      default: [],
    },

    riskScore: {
      type: Number,
      default: 0,
    },

    affectedAsset: {
      type: String,
      default: "",
      trim: true,
    },

    recommendedActions: {
      type: [String],
      default: [],
    },

    threatContext: {
      type: Object,
      default: {},
    },

    relatedFindings: {
      type: [String],
      default: [],
    },

    acknowledgedAt: {
      type: Date,
      default: null,
    },

    investigatingAt: {
      type: Date,
      default: null,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    closedAt: {
      type: Date,
      default: null,
    },

    timeline: {
      type: [alertTimelineSchema],

      default: () => [
        {
          action: "created",
          timestamp: new Date(),
          notes: "Alert created",
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

const Alert = mongoose.model("Alert", alertSchema);

export default Alert;
