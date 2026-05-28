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

    scanType: {
      type: String,
      required: true,
      enum: ["recon", "enumeration", "vulnerability", "full"],
      default: "recon",
    },

    status: {
      type: String,
      enum: ["queued", "running", "completed", "failed", "cancelled"],
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
