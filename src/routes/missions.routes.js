import express from "express";

import {
  getMissions,
  createMission,
  updateMission,
} from "../controllers/missions.controller.js";

const router = express.Router();

router.get("/", getMissions);

router.post("/", createMission);

router.patch("/:id", updateMission);

export default router;
