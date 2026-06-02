import express from "express";

import {
  getMissions,
  createMission,
  updateMission,
  deleteMission,
} from "../controllers/missions.controller.js";

const router = express.Router();

router.get("/", getMissions);

router.post("/", createMission);

router.patch("/:id", updateMission);

router.delete("/:id", deleteMission);

export default router;
