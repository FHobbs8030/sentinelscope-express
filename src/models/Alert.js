import mongoose from "mongoose";

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
      enum: ["open", "acknowledged", "resolved"],
      default: "open",
    },
  },
  {
    timestamps: true,
  },
);

const Alert = mongoose.model("Alert", alertSchema);

export default Alert;
