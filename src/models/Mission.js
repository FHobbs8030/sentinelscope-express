import mongoose from "mongoose";

const missionSchema = new mongoose.Schema(
  {
    target: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      default: "recon",
    },

    profile: {
      type: String,
      default: "standard",
    },

    severity: {
      type: String,
      default: "medium",
    },

    state: {
      type: String,
      enum: [
        "queued",
        "initializing",
        "running",
        "completed",
        "failed",
        "cancelled",
      ],
      default: "queued",
    },

    progress: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Mission = mongoose.model("Mission", missionSchema);

export default Mission;
