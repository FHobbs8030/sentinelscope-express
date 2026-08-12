import express from "express";

import {
  getMissions,
  getMissionQueueState,
  acquireMissionRuntimeLease,
  claimNextMission,
  createMission,
  updateMission,
} from "../controllers/missions.controller.js";

const router = express.Router();

router.get("/", getMissions);

router.get("/queue/state", getMissionQueueState);

router.post("/:id/runtime/lease", acquireMissionRuntimeLease);

router.post("/queue/claim", claimNextMission);

router.post("/", createMission);

router.patch("/:id", updateMission);

export default router;
