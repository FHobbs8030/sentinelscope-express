import mongoose from "mongoose";

const missionSchema = new mongoose.Schema(
  {
    clientMissionId: {
      type: String,
      trim: true,
    },

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

    scanId: {
      type: String,
      default: null,
    },

    scanMongoId: {
      type: String,
      default: null,
    },

    queueLease: {
      type: String,
      enum: ["active"],
    },

    claimedAt: {
      type: Date,
      default: null,
    },

    runtimeOwnerId: {
      type: String,
      default: null,
    },

    runtimeLeaseExpiresAt: {
      type: Date,
      default: null,
    },

    runtimeHeartbeatAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

missionSchema.index(
  { clientMissionId: 1 },
  {
    unique: true,
    sparse: true,
  },
);

missionSchema.index(
  { queueLease: 1 },
  {
    unique: true,
    partialFilterExpression: {
      queueLease: "active",
    },
  },
);

missionSchema.index({
  state: 1,
  createdAt: 1,
  _id: 1,
});

const Mission = mongoose.model("Mission", missionSchema);

export default Mission;
