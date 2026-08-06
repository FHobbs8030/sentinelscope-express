import mongoose from "mongoose";

const findingSchema = new mongoose.Schema(
  {
    clientFindingId: {
      type: String,
      trim: true,
    },

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
      enum: ["critical", "high", "medium", "low", "informational"],
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
  },
);

findingSchema.index(
  { clientFindingId: 1 },
  {
    unique: true,
    sparse: true,
  },
);

findingSchema.index({ createdAt: -1 });

findingSchema.index({
  severity: 1,
  createdAt: -1,
});

findingSchema.index({
  status: 1,
  createdAt: -1,
});

findingSchema.index({
  target: 1,
  createdAt: -1,
});

export default mongoose.model(
  "Finding",
  findingSchema
);
