import mongoose from "mongoose";

const findingSchema = new mongoose.Schema(
  {
    scanId: {
      type: String,
      required: true,
    },

    missionId: {
      type: String,
      required: true,
    },

    target: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    severity: {
      type: String,
      enum: [
        "critical",
        "high",
        "medium",
        "low",
        "informational",
      ],
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Finding",
  findingSchema
);
