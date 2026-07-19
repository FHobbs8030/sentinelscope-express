import mongoose from "mongoose";

const scanSchema = new mongoose.Schema(
  {
    clientScanId: {
      type: String,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    target: {
      type: String,
      required: true,
      trim: true,
    },

    missionId: {
      type: String,
      default: null,
    },

    missionMongoId: {
      type: String,
      default: null,
    },

    scanType: {
      type: String,
      required: true,
      enum: ["recon", "enumeration", "vulnerability", "full"],
      default: "recon",
    },

    profile: {
      type: String,
      default: "General",
      trim: true,
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    status: {
      type: String,
      enum: [
        "queued",
        "initializing",
        "recon",
        "enumeration",
        "analysis",
        "exploitation",
        "reporting",
        "completed",
        "failed",
        "cancelled",
        "interrupted",
      ],
      default: "queued",
    },

    currentStage: {
      type: String,
      enum: [
        "queued",
        "initializing",
        "recon",
        "enumeration",
        "analysis",
        "exploitation",
        "reporting",
        "completed",
        "failed",
        "cancelled",
        "interrupted",
      ],
      default: "queued",
    },

    runtimeState: {
      type: String,
      enum: ["active", "interrupted", "completed"],
      default: "active",
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    findingsCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

scanSchema.index(
  { clientScanId: 1 },
  {
    unique: true,
    sparse: true,
  },
);

const Scan = mongoose.model("Scan", scanSchema);

export default Scan;
