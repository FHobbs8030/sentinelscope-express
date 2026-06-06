import mongoose from "mongoose";

const scanSchema = new mongoose.Schema(
  {
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

const Scan = mongoose.model("Scan", scanSchema);

export default Scan;
